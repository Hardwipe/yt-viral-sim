#!/usr/bin/env python3

import json
import subprocess
from pathlib import Path


def inspect_video(video_path: str) -> dict:
    path = Path(video_path)
    if not path.exists():
        raise FileNotFoundError(f"Video not found: {video_path}")

    cmd = [
        "ffprobe",
        "-v", "error",
        "-print_format", "json",
        "-show_entries", "format=duration:stream=width,height,codec_type",
        str(path),
    ]

    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    data = json.loads(result.stdout)

    duration = 0.0
    if "format" in data and "duration" in data["format"]:
        duration = float(data["format"]["duration"])

    width = None
    height = None
    for stream in data.get("streams", []):
        if stream.get("codec_type") == "video":
            width = stream.get("width")
            height = stream.get("height")
            break

    if width is None or height is None:
        raise ValueError(f"Could not determine width/height for: {video_path}")

    aspect_ratio = width / height if height else 0

    return {
        "path": str(path),
        "duration_seconds": duration,
        "width": width,
        "height": height,
        "aspect_ratio": aspect_ratio,
        "is_vertical": height > width,
        "is_square": height == width,
        "is_horizontal": width > height,
    }