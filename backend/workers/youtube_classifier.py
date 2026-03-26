#!/usr/bin/env python3

from backend.workers.media_inspector import inspect_video

SHORTS_MAX_SECONDS = 180.0  # 3 minutes


def classify_for_youtube(video_path: str) -> dict:
    meta = inspect_video(video_path)

    shorts_candidate = (
        meta["duration_seconds"] <= SHORTS_MAX_SECONDS
        and (meta["is_vertical"] or meta["is_square"])
    )

    upload_type = "shorts" if shorts_candidate else "long"

    return {
        **meta,
        "upload_type": upload_type,
    }


if __name__ == "__main__":
    import json
    import sys

    if len(sys.argv) != 2:
        print("Usage: python youtube_classifier.py <video_path>")
        sys.exit(1)

    result = classify_for_youtube(sys.argv[1])
    print(json.dumps(result, indent=2))