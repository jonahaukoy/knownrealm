"""Independent QA checks for the coordinate-compatible basemap redraw.

The validator reparses all three site datasets instead of trusting the build
manifest. It checks the exact raster contract, every landmark dot and label,
coastline registration, input/output hashes, and both PNG and JPEG outputs.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


CANVAS = (5652, 3682)
COARSE_MASK_SIZE = (707, 460)
CORAL = np.array([0xC4, 0x54, 0x3F], dtype=np.int16)
EXPECTED_SOURCE_COUNTS = {"base": 153, "hotd": 138, "knight": 59}
EXPECTED_ANCHOR_COUNT = 163
EXPECTED_NAME_COUNT = 163
EXPECTED_CONFLICTS: dict[str, set[tuple[int, int]]] = {}
NAME_ONLY_ANCHORS = {"The Stepstones"}
HIDDEN_BASEMAP_ANCHORS = {
    "Bear Island",
    "The Blackwater Rush",
    "The Dothraki Sea",
    "The Fingers",
    "The Honeywine",
    "The Kingswood",
    "The Mander",
    "The Mountains of the Moon",
    "The Neck",
    "The Red Waste",
    "The Rhoyne",
    "The Trident",
    "The Wall",
    "The Wolfswood",
    "Valyria",
}
EXPECTED_CARTOGRAPHIC_LABELS = {
    "The Lands of Always Winter",
    "The Frozen Shore",
    "Sea Dragon Point",
    "Bear Island",
    "The Wolfswood",
    "Stony Shore",
    "The Hills",
    "Barrowlands",
    "The Neck",
    "The Haunted Forest",
    "The Gift",
    "The Grey Cliffs",
    "Skane",
    "Skagos",
    "Cape Kraken",
    "The Three Sisters",
    "The Mountains of the Moon",
    "The Fingers",
    "Crackclaw Point",
    "The Kingswood",
    "Shield Islands",
    "The Arbor",
    "Braavosian Coastlands",
    "Hills of Norvos",
    "The Axe",
    "The Flatlands",
    "Forest of Qohor",
    "The Footprint",
    "The Golden Fields",
    "The Disputed Lands",
    "The Orange Shore",
    "Lhazar",
    "Ghiscar",
    "Ibben",
    "Bay of Ice",
    "Bay of Seals",
    "Bay of Ibben",
    "Blazewater Bay",
    "The Bite",
    "Ironman's Bay",
    "Blackwater Bay",
    "Shipbreaker Bay",
    "Sea of Myrth",
    "Sea of Dorne",
    "Redwyne Straits",
    "The Sea of Sighs",
    "Slaver's Bay",
    "The Smoking Sea",
    "The Gulf of Grief",
    "Ghiscari Strait",
    "Long Lake",
    "The Last River",
    "Weeping Water",
    "Broken Branch",
    "White Knife",
    "Green Fork",
    "Blue Fork",
    "Red Fork",
    "The Blackwater Rush",
    "Blueburn",
    "The Mander",
    "Cockleswent",
    "The Honeywine",
    "Scourge",
    "Greenblood",
    "Brimstone",
    "Qhoyne",
    "Dagger Lake",
    "Skahazadhan",
    "The Kingsroad",
    "The Goldroad",
    "The Roseroad",
    "The Searoad",
    "Prince's Pass",
}
EXPECTED_KINGDOM_LABELS = {
    "THE NORTH",
    "THE RIVERLANDS",
    "THE WESTERLANDS",
    "THE REACH",
    "THE STORMLANDS",
    "THE CROWNLANDS",
    "DORNE",
    "THE VALE OF ARRYN",
    "THE IRON ISLANDS",
}
EXPECTED_CARTOGRAPHIC_CENTERS = {
    "Bear Island": [790, 430],
    "The Haunted Forest": [1310, 90],
    "The Fingers": [1840, 1310],
    "Forest of Qohor": [3150, 1880],
    "Long Lake": [1370, 570],
    "The Blackwater Rush": [1350, 2075],
    "The Mander": [995, 2390],
    "Cockleswent": [1090, 2418],
    "The Honeywine": [750, 2630],
    "Greenblood": [1620, 2855],
    "Qhoyne": [2790, 2180],
    "Dagger Lake": [2700, 2290],
    "The Kingsroad": [1235, 1215],
    "Prince's Pass": [1135, 2610],
}
REQUIRED_V5_RIVERS = {
    "white-knife-long-lake-outlet",
    "white-knife-main",
    "white-knife-cerwyn-fork",
    "green-fork",
    "blue-fork",
    "red-fork-lower",
    "tumblestone",
    "trident-main",
    "gods-eye-outlet",
    "blackwater-lower",
    "mander-lower",
    "qoyne-eastern-lake-outlet",
    "upper-rhoyne",
    "rhoyne-middle",
    "rhoyne-lower",
    "golden-fields-west-northwest",
    "golden-fields-west-north",
    "golden-fields-west-northeast",
    "golden-fields-east-north",
    "golden-fields-east-northeast",
    "golden-fields-east-east",
    "golden-fields-east-southeast",
    "central-south-trunk",
    "central-lake-middle-outlet",
    "central-lake-east-outlet",
    "skahazadhan-main",
}
FORBIDDEN_RIVERS = {
    "central-southern-branch",
    "central-east-fork",
    "lower-rhoyne-east",
    "qarth-watercourse",
    "red-waste-wash",
    "trident-eastern-branch",
}
REQUIRED_LAND_POLYGONS = {
    "isle-of-faces",
    "tyrosh",
    "driftmark-islet",
    "claw-isle",
    "lys",
    "stepstones-northwest",
    "stepstones-north",
    "stepstones-northeast",
    "stepstones-middle-east",
    "stepstones-middle-west",
    "stepstones-southwest",
    "stepstones-main",
    "stepstones-east",
}
REQUIRED_LAND_ELLIPSES = {
    "lys-northwest-islet",
    "lys-northeast-islet",
    "lys-south-islet",
    "stepstones-tiny-1",
    "stepstones-tiny-2",
    "stepstones-tiny-3",
    "stepstones-tiny-4",
    "stepstones-tiny-5",
    "stepstones-tiny-6",
}
REQUIRED_WATER_POLYGONS = {
    "blackwater-bay-kings-landing-coast",
    "long-lake",
    "dagger-lake",
    "red-lake",
    "stoney-sept-lake",
    "central-middle-lake",
    "central-east-lake",
}
LOCATION_RE = re.compile(
    r'^\s*\["(?P<name>[^"]+)",\s*'
    r"(?P<x>\d+),\s*(?P<y>\d+),\s*"
    r'"(?P<type>[^"]+)",\s*"(?P<region>[^"]+)",\s*'
    r"(?P<rank>\d+),"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "image",
        nargs="?",
        type=Path,
        default=Path("assets/ASOIAF_map_redrawn_v6.png"),
    )
    parser.add_argument(
        "--manifest",
        type=Path,
        default=Path("assets/ASOIAF_map_redrawn_v6.manifest.json"),
    )
    parser.add_argument(
        "--landmask",
        type=Path,
        default=Path("assets/landmask.png"),
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parents[1],
    )
    parser.add_argument("--json", action="store_true", dest="as_json")
    return parser.parse_args()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def load_manifest(path: Path) -> dict:
    if not path.exists():
        raise AssertionError(f"missing manifest: {path}")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def anchor_rows(manifest: dict) -> list[dict]:
    rows = manifest.get("anchors")
    if isinstance(rows, list):
        return rows
    raise AssertionError("manifest has no anchors list")


def parse_site_datasets(
    root: Path,
) -> tuple[set[tuple[str, int, int]], dict[str, int], dict[str, set[tuple[int, int]]]]:
    paths = [
        ("base", root / "js" / "data.js"),
        ("hotd", root / "hotd" / "js" / "data.js"),
        ("knight", root / "knight" / "js" / "data.js"),
    ]
    anchors: set[tuple[str, int, int]] = set()
    counts: dict[str, int] = {}
    name_positions: dict[str, set[tuple[int, int]]] = {}
    for source_name, path in paths:
        count = 0
        unmatched: list[tuple[int, str]] = []
        for line_number, line in enumerate(
            path.read_text(encoding="utf-8").splitlines(),
            start=1,
        ):
            match = LOCATION_RE.match(line)
            if not match:
                if line.lstrip().startswith('["'):
                    unmatched.append((line_number, line.strip()))
                continue
            count += 1
            name = match.group("name")
            x = int(match.group("x"))
            y = int(match.group("y"))
            rank = int(match.group("rank"))
            if not (0 <= x < CANVAS[0] and 0 <= y < CANVAS[1]):
                raise AssertionError(f"{path}:{line_number}: out-of-bounds anchor {(x, y)}")
            if rank not in {1, 2, 3}:
                raise AssertionError(f"{path}:{line_number}: unsupported rank {rank}")
            anchors.add((name, x, y))
            name_positions.setdefault(name, set()).add((x, y))
        if unmatched:
            detail = "; ".join(f"line {number}: {text}" for number, text in unmatched[:5])
            raise AssertionError(f"{path}: unparsed LOCATION_ROWS entries: {detail}")
        counts[source_name] = count
    conflicts = {
        name: positions
        for name, positions in name_positions.items()
        if len(positions) > 1
    }
    return anchors, counts, conflicts


def dot_is_present(
    rgb: np.ndarray,
    x: int,
    y: int,
    tolerance: int,
) -> tuple[bool, int]:
    # The printed reference dot sits three pixels above the SVG pin tip.
    x0, x1 = max(0, x - 8), min(CANVAS[0], x + 9)
    y0, y1 = max(0, y - 11), min(CANVAS[1], y + 6)
    patch = rgb[y0:y1, x0:x1].astype(np.int16)
    distance = np.max(np.abs(patch - CORAL), axis=2)
    matching = int(np.count_nonzero(distance <= tolerance))
    return matching >= 5, matching


def coastline_iou(image: Image.Image, landmask_path: Path) -> float:
    with Image.open(landmask_path) as opened:
        reference = opened.convert("L")
    if reference.size != COARSE_MASK_SIZE:
        raise AssertionError(
            f"landmask is {reference.size}, expected {COARSE_MASK_SIZE}"
        )
    reference = reference.point(lambda value: 255 if value >= 128 else 0)
    # Fill the legacy mask's small interior terrain/river cuts while preserving
    # its major coastline and islands.
    reference = reference.filter(ImageFilter.MaxFilter(5))
    reference = reference.filter(ImageFilter.MinFilter(5))
    ref = np.asarray(reference, dtype=np.uint8) >= 128
    sample = image.resize(reference.size, Image.Resampling.LANCZOS)
    arr = np.asarray(sample.convert("RGB"), dtype=np.int16)
    predicted = arr.mean(axis=2) >= 96
    intersection = int(np.count_nonzero(ref & predicted))
    union = int(np.count_nonzero(ref | predicted))
    reference.close()
    sample.close()
    return intersection / union if union else 1.0


def manifest_anchor_set(rows: list[dict]) -> set[tuple[str, int, int]]:
    result: set[tuple[str, int, int]] = set()
    for row in rows:
        if "anchor" not in row:
            raise AssertionError(f"manifest row has no anchor: {row}")
        x, y = (int(value) for value in row["anchor"])
        result.add((str(row["name"]), x, y))
    return result


def terrain_variant_sheet_qa(root: Path) -> dict:
    """Verify that the dedicated v5 terrain sheet has 20 usable RGBA cells."""
    path = (
        root
        / "assets"
        / "_sources"
        / "map-redraw"
        / "generated"
        / "terrain-symbols-v5.png"
    )
    if not path.exists():
        return {
            "path": str(path),
            "exists": False,
            "format": None,
            "mode": None,
            "size": None,
            "transparent": False,
            "nonempty_cells": 0,
        }

    with Image.open(path) as opened:
        image_format = opened.format
        sheet = opened.convert("RGBA")
    alpha = sheet.getchannel("A")
    transparent = alpha.getextrema()[0] < 255
    alpha.close()
    nonempty_cells = 0
    columns, rows = 5, 4
    for row in range(rows):
        for column in range(columns):
            left = round(column * sheet.width / columns)
            top = round(row * sheet.height / rows)
            right = round((column + 1) * sheet.width / columns)
            bottom = round((row + 1) * sheet.height / rows)
            cell = sheet.crop((left, top, right, bottom))
            cell_alpha = cell.getchannel("A")
            solid = cell_alpha.point(
                lambda value: 255 if value >= 10 else 0,
                mode="L",
            )
            if solid.getbbox():
                nonempty_cells += 1
            solid.close()
            cell_alpha.close()
            cell.close()
    result = {
        "path": str(path),
        "exists": True,
        "format": image_format,
        "mode": sheet.mode,
        "size": list(sheet.size),
        "transparent": transparent,
        "nonempty_cells": nonempty_cells,
    }
    sheet.close()
    return result


def verify_manifest_hashes(
    manifest: dict,
    root: Path,
    target: Path,
) -> list[str]:
    failures: list[str] = []
    for relative, recorded in manifest.get("inputs", {}).items():
        path = root / relative
        if not path.exists():
            failures.append(f"manifest input is missing: {relative}")
            continue
        actual = sha256(path)
        if actual != recorded.get("sha256"):
            failures.append(f"manifest input hash mismatch: {relative}")

    target_hash = sha256(target)
    output_hashes = {
        row.get("sha256")
        for row in manifest.get("outputs", [])
        if isinstance(row, dict)
    }
    if target_hash not in output_hashes:
        failures.append("image hash is not one of the manifest's built outputs")
    return failures


def major_label_anchor_overlaps(manifest: dict) -> list[dict]:
    anchors = anchor_rows(manifest)
    overlaps: list[dict] = []
    for label in manifest.get("major_labels", []):
        box = label.get("bbox")
        if not box:
            continue
        for anchor in anchors:
            if not anchor.get("render_dot", True):
                continue
            x, y = anchor["anchor"]
            dot_box = (x - 7, y - 10, x + 7, y + 4)
            width = max(0, min(box[2], dot_box[2]) - max(box[0], dot_box[0]))
            height = max(0, min(box[3], dot_box[3]) - max(box[1], dot_box[1]))
            if width * height:
                overlaps.append(
                    {
                        "major_label": label["text"],
                        "anchor": anchor["name"],
                        "area": width * height,
                    }
                )
    return overlaps


def label_bbox_overlaps(manifest: dict) -> list[dict]:
    """Find collisions among baked place labels and major cartographic labels."""
    place_labels = [
        (row["name"], row["label"]["bbox"])
        for row in anchor_rows(manifest)
        if isinstance(row.get("label"), dict) and row["label"].get("bbox")
    ]
    overlaps: list[dict] = []
    for index, (first_name, first_box) in enumerate(place_labels):
        for second_name, second_box in place_labels[index + 1 :]:
            width = max(
                0,
                min(first_box[2], second_box[2])
                - max(first_box[0], second_box[0]),
            )
            height = max(
                0,
                min(first_box[3], second_box[3])
                - max(first_box[1], second_box[1]),
            )
            if width * height:
                overlaps.append(
                    {
                        "first": first_name,
                        "second": second_name,
                        "area": width * height,
                    }
                )
    for major in manifest.get("major_labels", []):
        major_box = major.get("bbox")
        if not major_box:
            continue
        for place_name, place_box in place_labels:
            width = max(
                0,
                min(major_box[2], place_box[2])
                - max(major_box[0], place_box[0]),
            )
            height = max(
                0,
                min(major_box[3], place_box[3])
                - max(major_box[1], place_box[1]),
            )
            if width * height:
                overlaps.append(
                    {
                        "first": major["text"],
                        "second": place_name,
                        "area": width * height,
                    }
                )
    return overlaps


def gods_eye_water_geometry(rgb: np.ndarray) -> dict:
    """Measure the largest teal-water component in the Gods Eye window."""
    left, top, right, bottom = (1290, 1810, 1390, 1940)
    patch = rgb[top:bottom, left:right].astype(np.int16)
    water = (
        (patch[:, :, 2] > patch[:, :, 0] + 8)
        & (patch[:, :, 1] > patch[:, :, 0] + 4)
        & (patch.mean(axis=2) < 120)
    )
    seen = np.zeros(water.shape, dtype=bool)
    largest: list[tuple[int, int]] = []
    for y, x in zip(*np.where(water)):
        if seen[y, x]:
            continue
        stack = [(int(y), int(x))]
        seen[y, x] = True
        component: list[tuple[int, int]] = []
        while stack:
            cy, cx = stack.pop()
            component.append((cy, cx))
            for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                ny = cy + dy
                nx = cx + dx
                if (
                    0 <= ny < water.shape[0]
                    and 0 <= nx < water.shape[1]
                    and water[ny, nx]
                    and not seen[ny, nx]
                ):
                    seen[ny, nx] = True
                    stack.append((ny, nx))
        if len(component) > len(largest):
            largest = component
    if not largest:
        return {"pixels": 0, "bbox": [0, 0, 0, 0]}
    ys = [point[0] for point in largest]
    xs = [point[1] for point in largest]
    return {
        "pixels": len(largest),
        "bbox": [
            left + min(xs),
            top + min(ys),
            left + max(xs) + 1,
            top + max(ys) + 1,
        ],
    }


def main() -> int:
    args = parse_args()
    root = args.root.resolve()
    image_path = args.image if args.image.is_absolute() else root / args.image
    manifest_path = (
        args.manifest if args.manifest.is_absolute() else root / args.manifest
    )
    landmask_path = (
        args.landmask if args.landmask.is_absolute() else root / args.landmask
    )
    failures: list[str] = []

    if not image_path.exists():
        print(f"ERROR: missing image: {image_path}", file=sys.stderr)
        return 2

    image = Image.open(image_path)
    expected_format = (
        "PNG"
        if image_path.suffix.lower() == ".png"
        else "JPEG"
        if image_path.suffix.lower() in {".jpg", ".jpeg"}
        else None
    )
    if image.size != CANVAS:
        failures.append(f"size is {image.size}, expected {CANVAS}")
    if image.mode != "RGB":
        failures.append(f"mode is {image.mode}, expected RGB")
    if expected_format is None:
        failures.append(f"unsupported extension: {image_path.suffix}")
    elif image.format != expected_format:
        failures.append(f"format is {image.format}, expected {expected_format}")
    if image.format == "PNG":
        if image.info.get("srgb") != 0:
            failures.append("PNG is missing the perceptual sRGB intent chunk")
        gamma = image.info.get("gamma")
        if gamma is None or abs(float(gamma) - 0.45455) > 0.00001:
            failures.append(f"PNG gamma is {gamma}, expected 0.45455")
    elif image.format == "JPEG":
        dpi = image.info.get("dpi")
        if not dpi:
            failures.append("JPEG is missing its 96 DPI density metadata")
        elif any(abs(float(value) - 96.0) > 0.1 for value in dpi):
            failures.append(f"JPEG density is {dpi}, expected 96 DPI")

    manifest = load_manifest(manifest_path)
    rows = anchor_rows(manifest)
    independent, counts, conflicts = parse_site_datasets(root)
    manifest_anchors = manifest_anchor_set(rows)
    if counts != EXPECTED_SOURCE_COUNTS:
        failures.append(f"dataset counts are {counts}, expected {EXPECTED_SOURCE_COUNTS}")
    if len(independent) != EXPECTED_ANCHOR_COUNT:
        failures.append(
            f"dataset has {len(independent)} anchors, expected {EXPECTED_ANCHOR_COUNT}"
        )
    if len({name for name, _x, _y in independent}) != EXPECTED_NAME_COUNT:
        failures.append(
            "dataset distinct name count differs from "
            f"{EXPECTED_NAME_COUNT}"
        )
    if conflicts != EXPECTED_CONFLICTS:
        failures.append(
            f"coordinate conflict set is {conflicts}, expected {EXPECTED_CONFLICTS}"
        )
    required_semantic_anchors = {
        ("The Gods Eye", 1314, 1848),
        ("The Isle of Faces", 1338, 1866),
        ("Qohor", 2890, 1760),
    }
    if not required_semantic_anchors <= independent:
        failures.append(
            "Gods Eye, Isle of Faces, or Qohor is not registered to its "
            "audited source coordinate"
        )
    if manifest_anchors != independent:
        failures.append(
            "manifest anchors differ from independently parsed site datasets"
        )
    unlabelled = [
        row
        for row in rows
        if row.get("render_label", True)
        and (
            not isinstance(row.get("label"), dict)
            or row["label"].get("rendered") is False
        )
    ]
    if unlabelled:
        failures.append(f"{len(unlabelled)} manifest anchors have no rendered label")
    rendered_label_count = sum(
        bool(row.get("render_label", True))
        and isinstance(row.get("label"), dict)
        for row in rows
    )

    display_policy = {
        row["name"]: (bool(row.get("render_label", True)), bool(row.get("render_dot", True)))
        for row in rows
        if row["name"] in NAME_ONLY_ANCHORS | HIDDEN_BASEMAP_ANCHORS
    }
    expected_display_policy = {
        **{name: (True, False) for name in NAME_ONLY_ANCHORS},
        **{name: (False, False) for name in HIDDEN_BASEMAP_ANCHORS},
    }
    if display_policy != expected_display_policy:
        failures.append(
            f"basemap display policy is {display_policy}, expected {expected_display_policy}"
        )

    if int(manifest.get("version", 0)) < 7:
        failures.append("manifest predates the v6 cartographic compositor")
    terrain = manifest.get("counts", {}).get("terrain_symbols", {})
    minimum_terrain = {"forest": 150, "hill": 80, "mountain": 200}
    for kind, minimum in minimum_terrain.items():
        if int(terrain.get(kind, 0)) < minimum:
            failures.append(
                f"terrain count for {kind} is {terrain.get(kind, 0)}, "
                f"expected at least {minimum}"
            )

    terrain_zones = manifest.get("counts", {}).get(
        "terrain_symbols_by_zone",
        {},
    )
    for zone in ("shadow-tower-massif", "haunted-forest-wall"):
        if int(terrain_zones.get(zone, 0)) <= 0:
            failures.append(f"registered terrain zone {zone} has no symbols")

    terrain_variants = manifest.get("counts", {}).get(
        "terrain_symbol_variants",
        {},
    )
    if sum(int(value) for value in terrain_variants.values()) != sum(
        int(value) for value in terrain.values()
    ):
        failures.append("terrain variant counts do not sum to terrain symbols")
    variant_families: dict[str, set[str]] = {}
    invalid_variant_names: list[str] = []
    for name in terrain_variants:
        match = re.fullmatch(
            r"(forest|hill|marsh|mountain):cell-(\d+)",
            str(name),
        )
        if not match or int(match.group(2)) >= 20:
            invalid_variant_names.append(str(name))
            continue
        variant_families.setdefault(match.group(1), set()).add(str(name))
    if invalid_variant_names:
        failures.append(
            "invalid terrain variant keys: " + ", ".join(invalid_variant_names)
        )
    minimum_variants = {"forest": 6, "hill": 4, "marsh": 1, "mountain": 6}
    for kind, minimum in minimum_variants.items():
        if len(variant_families.get(kind, set())) < minimum:
            failures.append(
                f"terrain family {kind} uses "
                f"{len(variant_families.get(kind, set()))} variants, "
                f"expected at least {minimum}"
            )

    terrain_orientation = manifest.get("terrain_orientation", {})
    orientation_counts = terrain_orientation.get("counts", {})
    placed_terrain_total = sum(int(value) for value in terrain.values())
    if (
        terrain_orientation.get("upright") is not True
        or terrain_orientation.get("allowed_rotations") != [0]
        or terrain_orientation.get("horizontal_mirroring") is not True
        or int(orientation_counts.get("rotation-0", -1))
        != placed_terrain_total
        or int(orientation_counts.get("mirrored", 0))
        + int(orientation_counts.get("unmirrored", 0))
        != placed_terrain_total
    ):
        failures.append("terrain symbols are not all recorded as upright")

    terrain_clearance = manifest.get("terrain_clearance", {})
    required_clearance_values = {
        "river_clearance_pixels": 1,
        "road_added_clearance_pixels": 1,
        "total_exclusion_pixels": 1,
        "allowed_land_pixels": 1,
    }
    for key, minimum in required_clearance_values.items():
        if int(terrain_clearance.get(key, 0)) < minimum:
            failures.append(f"terrain clearance metric {key} is missing or zero")
    if (
        int(terrain_clearance.get("river_extra_width", 0)) < 12
        or int(terrain_clearance.get("road_extra_width", 0)) < 12
        or int(terrain_clearance.get("wall_clearance_width", 0)) < 26
        or "strict" not in str(terrain_clearance.get("method", "")).lower()
    ):
        failures.append("terrain clearance no longer reserves the v6 corridors")
    land_pixels = int(manifest.get("land_mask", {}).get("land_pixels", 0))
    allowed_land_pixels = int(terrain_clearance.get("allowed_land_pixels", 0))
    if land_pixels and allowed_land_pixels >= land_pixels:
        failures.append("terrain clearance did not remove any land corridor")

    terrain_sheet = terrain_variant_sheet_qa(root)
    generated_sheets = manifest.get("generated_icon_sheet_used", {})
    terrain_sheet_input = (
        "assets/_sources/map-redraw/generated/terrain-symbols-v5.png"
    )
    if (
        not isinstance(generated_sheets, dict)
        or generated_sheets.get("terrain") != "terrain-symbols-v5.png"
        or terrain_sheet_input not in manifest.get("inputs", {})
        or terrain_sheet["format"] != "PNG"
        or terrain_sheet["mode"] != "RGBA"
        or terrain_sheet["transparent"] is not True
        or terrain_sheet["nonempty_cells"] != 20
    ):
        failures.append(
            "dedicated v5 terrain variant sheet is missing or not a complete "
            "transparent 5x4 grid"
        )

    rivers = manifest.get("rivers", {})
    path_widths = rivers.get("path_widths", {})
    river_names = set(path_widths)
    if not REQUIRED_V5_RIVERS <= river_names or FORBIDDEN_RIVERS & river_names:
        failures.append("river network is missing required trunks or retains removed routes")
    if int(rivers.get("paths", 0)) != len(path_widths) or len(path_widths) < 50:
        failures.append("manifest does not record the rebuilt river network")
    river_course_audit = rivers.get("course_audit", [])
    audited_course_names = [str(row.get("name")) for row in river_course_audit]
    if (
        len(river_course_audit) != len(path_widths)
        or len(set(audited_course_names)) != len(audited_course_names)
        or set(audited_course_names) != river_names
    ):
        failures.append("river course audit does not cover every unique path")
    rivers_with_water_reentry = [
        str(row.get("name"))
        for row in river_course_audit
        if row.get("internal_water_runs")
        or int(row.get("internal_water_samples", 0)) != 0
    ]
    if rivers_with_water_reentry:
        failures.append(
            "river centerlines leave land and reappear: "
            + ", ".join(rivers_with_water_reentry)
        )
    river_tortuosity_missing = [
        str(row.get("name"))
        for row in river_course_audit
        if float(row.get("tortuosity", 0.0)) < 1.001
        or float(row.get("rendered_length", 0.0)) <= 0.0
        or float(row.get("max_control_segment", 0.0)) <= 0.0
    ]
    if river_tortuosity_missing:
        failures.append(
            "river winding metrics are missing or implausibly straight: "
            + ", ".join(river_tortuosity_missing)
        )

    declared_mouths = rivers.get("mouth_endpoints", {})
    river_mouth_rows = [
        row for row in river_course_audit if row.get("mouth_side") is not None
    ]
    audited_mouths = {
        str(row.get("name")): str(row.get("mouth_side"))
        for row in river_mouth_rows
    }
    invalid_river_mouths = [
        row.get("name")
        for row in river_mouth_rows
        if row.get("mouth_in_water") is not True
    ]
    if (
        not isinstance(declared_mouths, dict)
        or not declared_mouths
        or audited_mouths != declared_mouths
        or invalid_river_mouths
    ):
        failures.append(
            "river receiving-water QA differs from the manifest-declared mouths"
            + (
                ": " + ", ".join(str(name) for name in invalid_river_mouths)
                if invalid_river_mouths
                else ""
            )
        )

    shared_junctions = rivers.get("shared_junctions", {})
    invalid_junctions: list[str] = []
    if not isinstance(shared_junctions, dict) or not shared_junctions:
        invalid_junctions.append("none declared")
    else:
        for coordinate, names in shared_junctions.items():
            try:
                x_text, y_text = str(coordinate).split(",", maxsplit=1)
                x, y = int(x_text), int(y_text)
            except (TypeError, ValueError):
                invalid_junctions.append(str(coordinate))
                continue
            junction_names = {str(name) for name in names}
            if (
                not (0 <= x < CANVAS[0] and 0 <= y < CANVAS[1])
                or len(junction_names) < 2
                or not junction_names <= river_names
            ):
                invalid_junctions.append(str(coordinate))
    if invalid_junctions:
        failures.append(
            "river network has invalid manifest-declared confluences: "
            + ", ".join(invalid_junctions)
        )
    if int(manifest.get("roads", {}).get("routes", 0)) != 12:
        failures.append("manifest does not record the requested road network")
    route_details = manifest.get("roads", {}).get("route_details", [])
    route_names = {row.get("name") for row in route_details}
    required_roads = {
        "kingsroad",
        "goldroad",
        "highgarden-kingslanding-roseroad",
        "casterly-highgarden-searoad",
        "oldtown-highgarden",
        "storm-road",
        "summerhall-road",
        "boneway",
    }
    if not required_roads <= route_names:
        failures.append("road network is missing one or more audited source routes")
    roads_with_water_reentry = [
        row["name"]
        for row in route_details
        if row.get("internal_water_runs")
    ]
    if roads_with_water_reentry:
        failures.append(
            "road centerlines leave land and reappear: "
            + ", ".join(roads_with_water_reentry)
        )
    roads_with_water_strokes = [
        row["name"]
        for row in route_details
        if int(row.get("outer_stroke_water_pixels", -1)) != 0
    ]
    if roads_with_water_strokes:
        failures.append(
            "road outer strokes overlap water or lack full-stroke QA: "
            + ", ".join(roads_with_water_strokes)
        )
    road_tortuosity_missing = [
        str(row.get("name"))
        for row in route_details
        if float(row.get("tortuosity", 0.0)) < 1.003
        or float(row.get("rendered_length", 0.0)) <= 0.0
        or float(row.get("max_control_segment", 0.0)) <= 0.0
    ]
    if road_tortuosity_missing:
        failures.append(
            "road winding metrics are missing or implausibly straight: "
            + ", ".join(road_tortuosity_missing)
        )

    coastline = manifest.get("coastline", {})
    if (
        coastline.get("material")
        != "single color-normalized canonical sea/lake/river water plate"
        or int(coastline.get("uniform_tint_alpha", 0)) <= 0
        or int(coastline.get("uniform_tint_pixels", 0))
        != CANVAS[0] * CANVAS[1]
        or int(coastline.get("near_shelf_nonzero", -1)) != 0
        or int(coastline.get("far_shelf_nonzero", -1)) != 0
        or "canonical" not in str(rivers.get("method", "")).lower()
        or "exact" not in str(rivers.get("method", "")).lower()
    ):
        failures.append(
            "sea, lake, and river pixels do not use the audited uniform "
            "canonical water material"
        )

    wall = manifest.get("wall", {})
    wall_route = wall.get("route", [])
    if (
        len(wall_route) != 6
        or wall_route[0] != [1286, 242]
        or wall_route[-1] != [1546, 247]
    ):
        failures.append("Wall route does not run exactly from Shadow Tower to Eastwatch")
    if (
        wall.get("castle_black_keep") is not None
        or wall.get("removed_keep_icon") is not True
        or int(wall.get("supersample", 0)) < 4
        or "supersampled" not in str(wall.get("method", "")).lower()
        or "no keep icon" not in str(wall.get("method", "")).lower()
    ):
        failures.append("Wall is not the supersampled icon-free v5 rendering")
    if int(manifest.get("snow", {}).get("crust_marks", 0)) < 200:
        failures.append("far-north snow detailing is unexpectedly sparse")
    ship_cleanup = (
        manifest.get("land_mask", {})
        .get("coarse_cleanup", {})
        .get("removed_legacy_ship_components", [])
    )
    if len(ship_cleanup) != 4:
        failures.append(
            f"manifest records {len(ship_cleanup)} removed ship components, expected 4"
        )
    repairs = (
        manifest.get("land_mask", {})
        .get("coarse_cleanup", {})
        .get("manual_registered_repairs", [])
    )
    repaired_land_polygons = {
        name
        for row in repairs
        for name in row.get("land_polygons", [])
    }
    repaired_land_ellipses = {
        name
        for row in repairs
        for name in row.get("land_ellipses", [])
    }
    repaired_water_polygons = {
        name
        for row in repairs
        for name in row.get("water_polygons", [])
    }
    if not REQUIRED_LAND_POLYGONS <= repaired_land_polygons:
        failures.append("manifest is missing one or more registered island polygons")
    if not REQUIRED_LAND_ELLIPSES <= repaired_land_ellipses:
        failures.append("manifest is missing one or more small island/islet repairs")
    if not REQUIRED_WATER_POLYGONS <= repaired_water_polygons:
        failures.append("manifest is missing one or more registered v6 waters")
    native_features = {
        name: kind
        for row in repairs
        for name, kind in row.get("native_registered_features", {}).items()
    }
    if native_features.get("gods-eye") != "water" or native_features.get(
        "isle-of-faces"
    ) != "land-island":
        failures.append("manifest does not preserve native Gods Eye geometry")
    major_labels = {
        row.get("text"): row for row in manifest.get("major_labels", [])
    }
    expected_kingdom_centers = {
        "THE NORTH": [1410, 760],
        "THE RIVERLANDS": [1140, 1675],
        "THE WESTERLANDS": [920, 1945],
        "THE REACH": [1050, 2155],
        "THE STORMLANDS": [1510, 2330],
        "THE CROWNLANDS": [1370, 1990],
        "DORNE": [1300, 2795],
        "THE VALE OF ARRYN": [1720, 1505],
        "THE IRON ISLANDS": [655, 1455],
    }
    invalid_major_geometry: list[str] = []
    kingdom_style_signatures: set[tuple] = set()
    for name, expected_center in expected_kingdom_centers.items():
        row = major_labels.get(name, {})
        bbox = row.get("bbox")
        if (
            row.get("center") != expected_center
            or row.get("requested_center") != expected_center
            or row.get("kind") != "kingdom"
            or int(row.get("size", 0)) != 27
            or int(row.get("angle", -1)) != 0
            or row.get("color") != "#1F2924"
            or int(row.get("alpha", 0)) < 235
            or int(row.get("stroke_width", 0)) != 1
            or int(row.get("tracking", -1)) != 3
            or row.get("fixed") is not True
            or not isinstance(bbox, list)
            or len(bbox) != 4
            or not (
                0 <= int(bbox[0]) < int(bbox[2]) <= CANVAS[0]
                and 0 <= int(bbox[1]) < int(bbox[3]) <= CANVAS[1]
            )
        ):
            invalid_major_geometry.append(name)
        kingdom_style_signatures.add(
            (
                row.get("size"),
                row.get("kind"),
                row.get("angle"),
                row.get("color"),
                row.get("alpha"),
                row.get("stroke_width"),
                row.get("stroke_color"),
                row.get("tracking"),
                row.get("font"),
            )
        )
    if set(major_labels) & EXPECTED_KINGDOM_LABELS != EXPECTED_KINGDOM_LABELS:
        invalid_major_geometry.append("kingdom inventory")
    if len(kingdom_style_signatures) != 1:
        invalid_major_geometry.append("kingdom style mismatch")
    if invalid_major_geometry:
        failures.append(
            "uniform fixed kingdom annotations changed: "
            + ", ".join(invalid_major_geometry)
        )
    for essos_region in ("DOTHRAKI SEA", "THE RED WASTE", "VALYRIA"):
        row = major_labels.get(essos_region, {})
        if (
            row.get("kind") != "region"
            or row.get("color") != "#1F2924"
            or int(row.get("alpha", 0)) < 225
            or int(row.get("stroke_width", 0)) != 1
        ):
            failures.append(
                f"Essos major land label {essos_region} lacks v6 contrast"
            )

    cartographic_rows = manifest.get("cartographic_labels", [])
    if not isinstance(cartographic_rows, list):
        failures.append("manifest cartographic_labels field is not a list")
        cartographic_rows = []
    cartographic_names = [str(row.get("text")) for row in cartographic_rows]
    cartographic_name_set = set(cartographic_names)
    recorded_cartographic_count = int(
        manifest.get("counts", {}).get("cartographic_labels", -1)
    )
    if (
        recorded_cartographic_count != len(cartographic_rows)
        or len(cartographic_rows) != len(EXPECTED_CARTOGRAPHIC_LABELS)
        or len(cartographic_name_set) != len(cartographic_names)
        or cartographic_name_set != EXPECTED_CARTOGRAPHIC_LABELS
    ):
        missing_cartographic = sorted(
            EXPECTED_CARTOGRAPHIC_LABELS - cartographic_name_set
        )
        unexpected_cartographic = sorted(
            cartographic_name_set - EXPECTED_CARTOGRAPHIC_LABELS
        )
        failures.append(
            "cartographic label inventory differs from the audited v6 list "
            f"(count={len(cartographic_rows)}, "
            f"unique={len(cartographic_name_set)}, "
            f"missing={missing_cartographic}, "
            f"unexpected={unexpected_cartographic})"
        )
    cartographic_by_name = {
        str(row.get("text")): row for row in cartographic_rows
    }
    land_cartographic_kinds = {
        "coast",
        "geographic",
        "hills",
        "island",
        "mountains",
        "wood",
    }
    low_contrast_land_labels = [
        str(row.get("text"))
        for row in cartographic_rows
        if row.get("kind") in land_cartographic_kinds
        and (
            row.get("color") != "#1F2924"
            or int(row.get("alpha", 0)) < 235
            or int(row.get("rendered_size", 0)) < 16
            or int(row.get("stroke_width", 0)) != 1
        )
    ]
    if low_contrast_land_labels:
        failures.append(
            "dotless land labels remain too light or small: "
            + ", ".join(low_contrast_land_labels)
        )
    incorrect_cartographic_centers: list[str] = []
    for name, expected_center in EXPECTED_CARTOGRAPHIC_CENTERS.items():
        row = cartographic_by_name.get(name, {})
        if (
            row.get("center") != expected_center
            or row.get("requested_center") != expected_center
            or row.get("fixed") is not True
        ):
            incorrect_cartographic_centers.append(name)
    if incorrect_cartographic_centers:
        failures.append(
            "key cartographic labels moved from their source-registered "
            "centers: " + ", ".join(incorrect_cartographic_centers)
        )
    invalid_cartographic_geometry = [
        str(row.get("text"))
        for row in cartographic_rows
        if (
            row.get("fixed") is not True
            or int(row.get("outside_area", -1)) != 0
            or not isinstance(row.get("bbox"), list)
            or len(row.get("bbox", [])) != 4
        )
    ]
    if invalid_cartographic_geometry:
        failures.append(
            "cartographic labels are not fixed fully on-canvas: "
            + ", ".join(invalid_cartographic_geometry)
        )

    eyrie = next((row for row in rows if row["name"] == "The Eyrie"), None)
    if (
        eyrie is None
        or eyrie.get("label", {}).get("placement") != "manual-upper-left"
        or eyrie.get("label", {}).get("bbox") != [1508, 1563, 1578, 1584]
    ):
        failures.append("The Eyrie label is not fixed fully on land")
    if any(row.get("kind") == "watershed" for row in manifest.get("decorations", [])):
        failures.append("removed Dothraki watershed icon is still present")
    unexpected_fonts = [
        row["name"]
        for row in rows
        if row.get("render_label", True)
        and "ebgaramond" not in str(row.get("label", {}).get("font", "")).lower()
    ]
    if unexpected_fonts:
        failures.append(
            f"{len(unexpected_fonts)} location labels do not use EB Garamond"
        )
    oversized_labels = [
        row["name"]
        for row in rows
        if row.get("render_label", True)
        and int(row.get("label", {}).get("font_size", 0)) > 17
    ]
    if oversized_labels:
        failures.append(f"{len(oversized_labels)} location labels exceed 17 px")

    rgb = np.asarray(image.convert("RGB"))
    tolerance = 52 if image.format == "JPEG" else 44
    missing: list[dict] = []
    expected_dot_rows = [row for row in rows if row.get("render_dot", True)]
    suppressed_dot_rows = [row for row in rows if not row.get("render_dot", True)]
    for row in expected_dot_rows:
        name = str(row["name"])
        x, y = (int(value) for value in row["anchor"])
        present, matching = dot_is_present(rgb, x, y, tolerance)
        if not present:
            missing.append(
                {"name": name, "x": x, "y": y, "coral_pixels": matching}
            )
    if missing:
        failures.append(
            f"{len(missing)} of {len(expected_dot_rows)} requested anchor dots are missing"
        )
    unexpected_dots: list[dict] = []
    for row in suppressed_dot_rows:
        x, y = (int(value) for value in row["anchor"])
        present, matching = dot_is_present(rgb, x, y, tolerance)
        if present:
            unexpected_dots.append(
                {"name": row["name"], "x": x, "y": y, "coral_pixels": matching}
            )
    if unexpected_dots:
        failures.append(f"{len(unexpected_dots)} suppressed anchor dots remain")

    overlaps = major_label_anchor_overlaps(manifest)
    if overlaps:
        failures.append(f"{len(overlaps)} major-label/anchor halo overlaps remain")
    label_overlaps = label_bbox_overlaps(manifest)
    if label_overlaps:
        failures.append(f"{len(label_overlaps)} baked label overlaps remain")

    gods_eye_geometry = gods_eye_water_geometry(rgb)
    gods_bbox = gods_eye_geometry["bbox"]
    if not (
        4800 <= gods_eye_geometry["pixels"] <= 6500
        and 1299 <= gods_bbox[0] <= 1307
        and 1818 <= gods_bbox[1] <= 1826
        and 1374 <= gods_bbox[2] <= 1382
        and 1928 <= gods_bbox[3] <= 1940
    ):
        failures.append(
            "Gods Eye raster geometry differs from the source-sized lake: "
            f"{gods_eye_geometry}"
        )

    iou = coastline_iou(image, landmask_path)
    if iou < 0.90:
        failures.append(f"coastline IoU is only {iou:.4f} (minimum 0.9000)")
    failures.extend(verify_manifest_hashes(manifest, root, image_path))

    result = {
        "ok": not failures,
        "image": str(image_path),
        "size": list(image.size),
        "mode": image.mode,
        "format": image.format,
        "dataset_rows_by_source": counts,
        "distinct_name_count": len({name for name, _x, _y in independent}),
        "unique_anchor_count": len(independent),
        "expected_dot_count": len(expected_dot_rows),
        "rendered_label_count": rendered_label_count,
        "missing_anchor_count": len(missing),
        "missing_anchors": missing,
        "unexpected_suppressed_dots": unexpected_dots,
        "major_label_anchor_overlaps": overlaps,
        "label_bbox_overlaps": label_overlaps,
        "river_path_count": len(path_widths),
        "audited_river_mouth_count": len(declared_mouths),
        "audited_river_junction_count": len(shared_junctions),
        "cartographic_label_count": len(cartographic_rows),
        "cartographic_label_unique_count": len(cartographic_name_set),
        "terrain_variant_sheet": terrain_sheet,
        "terrain_variant_family_counts": {
            kind: len(names)
            for kind, names in sorted(variant_families.items())
        },
        "gods_eye_water_geometry": gods_eye_geometry,
        "coastline_iou": round(iou, 6),
        "sha256": sha256(image_path),
        "failures": failures,
    }
    image.close()

    if args.as_json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(f"Image: {image_path}")
        print(
            f"Raster: {result['size'][0]} x {result['size'][1]} "
            f"{result['mode']} {result['format']}"
        )
        print(
            f"Landmark dots: {len(expected_dot_rows) - len(missing)}/"
            f"{len(expected_dot_rows)} requested present; "
            f"labels: {result['rendered_label_count']}/{len(rows)}"
        )
        print(
            f"Rivers: {len(path_widths)} paths, "
            f"{len(declared_mouths)} mouths, "
            f"{len(shared_junctions)} junctions; "
            f"cartographic labels: {len(cartographic_rows)}"
        )
        print(f"Coastline IoU: {iou:.4f}")
        if failures:
            for failure in failures:
                print(f"FAIL: {failure}")
        else:
            print("PASS")

    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
