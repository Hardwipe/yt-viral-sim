import argparse
import json
from googleapiclient.http import MediaFileUpload

def get_authenticated_service():
    raise NotImplementedError("Hook this into your existing auth flow.")

def build_description(upload_type: str, base_description: str = "") -> str:
    description = base_description.strip()
    if upload_type == "shorts" and "#Shorts" not in description:
        description = (description + "\n\n#Shorts").strip()
    return description

def upload_video(file_path, title, upload_type, description="", privacy_status="public", category_id="22"):
    youtube = get_authenticated_service()

    body = {
        "snippet": {
            "title": title,
            "description": build_description(upload_type, description),
            "categoryId": category_id,
        },
        "status": {
            "privacyStatus": privacy_status,
            "selfDeclaredMadeForKids": False,
        },
    }

    media = MediaFileUpload(file_path, chunksize=-1, resumable=True)

    request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=media,
    )

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Upload progress: {int(status.progress() * 100)}%")

    print(json.dumps({
        "upload_type": upload_type,
        "youtube_response": response
    }, indent=2))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--upload-type", required=True, choices=["shorts", "long"])
    parser.add_argument("--description", default="")
    parser.add_argument("--privacy", default="public")
    parser.add_argument("--category", default="22")
    args = parser.parse_args()

    upload_video(
        file_path=args.file,
        title=args.title,
        upload_type=args.upload_type,
        description=args.description,
        privacy_status=args.privacy,
        category_id=args.category,
    )