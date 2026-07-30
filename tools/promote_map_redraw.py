"""Atomically promote the validated basemap redraw into the site's live assets."""

from __future__ import annotations

import hashlib
import os
import shutil
from pathlib import Path

from PIL import Image


CANVAS = (5652, 3682)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def require_inside(path: Path, root: Path) -> Path:
    resolved = path.resolve()
    try:
        resolved.relative_to(root.resolve())
    except ValueError as exc:
        raise ValueError(f"refusing path outside workspace: {resolved}") from exc
    return resolved


def validate_raster(path: Path, expected_format: str) -> None:
    with Image.open(path) as image:
        if image.format != expected_format:
            raise AssertionError(
                f"{path.name}: format {image.format}, expected {expected_format}"
            )
        if image.size != CANVAS or image.mode != "RGB":
            raise AssertionError(
                f"{path.name}: raster {image.size} {image.mode}, "
                f"expected {CANVAS} RGB"
            )


def atomic_copy(source: Path, target: Path) -> None:
    temporary = target.with_name(f".{target.name}.map-redraw.tmp")
    if temporary.exists():
        temporary.unlink()
    try:
        shutil.copy2(source, temporary)
        os.replace(temporary, target)
    finally:
        if temporary.exists():
            temporary.unlink()


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    assets = require_inside(root / "assets", root)
    staging_png = require_inside(assets / "ASOIAF_map_redrawn_v6.png", root)
    staging_jpg = require_inside(assets / "ASOIAF_map_redrawn_v6.jpg", root)
    live_png = require_inside(assets / "ASOIAF_map.png", root)
    live_jpg = require_inside(assets / "ASOIAF_map.jpg", root)
    backup_dir = require_inside(
        assets / "_sources" / "map-redraw" / "legacy-reference",
        root,
    )
    backup_dir.mkdir(parents=True, exist_ok=True)
    backup_png = require_inside(backup_dir / "ASOIAF_map.pre-v6.png", root)
    backup_jpg = require_inside(backup_dir / "ASOIAF_map.pre-v6.jpg", root)

    validate_raster(staging_png, "PNG")
    validate_raster(staging_jpg, "JPEG")
    validate_raster(live_png, "PNG")
    validate_raster(live_jpg, "JPEG")
    if not backup_png.exists():
        atomic_copy(live_png, backup_png)
    if not backup_jpg.exists():
        atomic_copy(live_jpg, backup_jpg)
    validate_raster(backup_png, "PNG")
    validate_raster(backup_jpg, "JPEG")

    atomic_copy(staging_png, live_png)
    atomic_copy(staging_jpg, live_jpg)
    if sha256(live_png) != sha256(staging_png):
        raise AssertionError("live PNG hash differs from staging after promotion")
    if sha256(live_jpg) != sha256(staging_jpg):
        raise AssertionError("live JPEG hash differs from staging after promotion")

    print(f"Promoted PNG: {live_png} sha256={sha256(live_png)}")
    print(f"Promoted JPEG: {live_jpg} sha256={sha256(live_jpg)}")
    print(f"Pre-v6 PNG backup: {backup_png} sha256={sha256(backup_png)}")
    print(f"Pre-v6 JPEG backup: {backup_jpg} sha256={sha256(backup_jpg)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
