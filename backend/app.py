import uuid
import subprocess
from pathlib import Path

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

from workers.youtube_classifier import classify_for_youtube

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
SCRIPT_PATH = BASE_DIR / "scripts" / "post_upload.sh"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {"mp4", "mov", "avi", "mkv", "webm", "m4v"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True}), 200


@app.route("/api/upload", methods=["POST"])
def upload_video():
    print("UPLOAD HIT")
    print("FILES:", request.files)
    print("FORM:", request.form)

    file = request.files.get("video")
    title = request.form.get("title", "").strip()

    if not file:
        return jsonify({"error": "Missing video"}), 400

    if not title:
        return jsonify({"error": "Missing title"}), 400

    if not file.filename:
        return jsonify({"error": "Missing filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(file.filename)
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    save_path = UPLOAD_DIR / unique_name

    try:
        file.save(save_path)
    except Exception as e:
        return jsonify({"error": f"Failed to save upload: {e}"}), 500

    try:
        meta = classify_for_youtube(str(save_path))
    except FileNotFoundError as e:
        return jsonify({"error": f"Missing dependency: {e}. Install ffmpeg so ffprobe is available."}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to inspect video: {e}"}), 500

    log_file = open(BASE_DIR / "upload.log", "a")

    try:
        subprocess.Popen(
            [
                "bash",
                str(SCRIPT_PATH),
                str(save_path),
                title,
                meta["upload_type"],
            ],
            stdout=log_file,
            stderr=log_file,
            cwd=str(BASE_DIR),
        )
    except Exception as e:
        log_file.close()
        return jsonify({"error": f"Failed to start background upload: {e}"}), 500

    return jsonify({
        "message": "Upload received. Background YouTube job started.",
        "detected_upload_type": meta["upload_type"],
        "duration_seconds": meta["duration_seconds"],
        "width": meta["width"],
        "height": meta["height"],
        "filename": unique_name,
    }), 202


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)