#!/usr/bin/env python3
"""
Build an original, coordinate-compatible "Mineral Tidal Survey" basemap.

The script deliberately treats the existing map as a registration/data guide,
not as paint to reuse.  It combines newly generated textures and icon art with
the existing logical coordinate system, then typesets every code-defined place
deterministically.

Inputs (never modified):
  assets/_sources/map-redraw/legacy-reference/ASOIAF_map.original.png
    (or assets/ASOIAF_map.png before the first promotion)
  assets/landmask.png
  js/data.js
  hotd/js/data.js
  knight/js/data.js
  assets/_sources/map-redraw/*

Outputs:
  assets/ASOIAF_map_redrawn_v6.png
  assets/ASOIAF_map_redrawn_v6.jpg
  assets/ASOIAF_map_redrawn_v6_preview.jpg
  assets/ASOIAF_map_redrawn_v6.manifest.json

Only Pillow and NumPy are required.  The compositor is deterministic for a
given seed and set of input bytes.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import random
import re
import struct
import sys
from collections import Counter, deque
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Sequence

import numpy as np
from PIL import (
    Image,
    ImageChops,
    ImageDraw,
    ImageFilter,
    ImageFont,
    ImageOps,
    PngImagePlugin,
    features,
)


CANVAS = (5652, 3682)
COARSE_MASK_SIZE = (707, 460)
DEFAULT_SEED = 240513
COMPOSITOR_VERSION = 7
EXPECTED_SOURCE_COUNTS = {"base": 153, "hotd": 138, "knight": 59}
EXPECTED_ANCHOR_COUNT = 163
EXPECTED_NAME_COUNT = 163
EXPECTED_CONFLICTS: dict[str, set[tuple[int, int]]] = {}

# These are cartographic display policies only. The rows remain available to
# the site's interactive map/wiki code, while the baked basemap avoids
# misleading point symbols for broad geographic features.
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

PALETTE = {
    "ocean": "#163941",
    "ocean_deep": "#082832",
    "ocean_light": "#285762",
    "land": "#C9CEB2",
    "land_light": "#E5E3C5",
    "snow": "#E6ECE7",
    "snow_highlight": "#F4F6EE",
    "snow_shadow": "#A8C2BF",
    "temperate": "#B8C49E",
    "grassland": "#D0B07D",
    "desert": "#C98568",
    "terrain_ink": "#39423B",
    "land_label": "#1F2924",
    "land_label_halo": "#DDE0C7",
    "river": "#315E65",
    "river_highlight": "#54888C",
    "road_shadow": "#6F6856",
    "road": "#D7CCAA",
    "wall_shadow": "#496D73",
    "wall_ice": "#CFE0DD",
    "wall_highlight": "#F3F5EC",
    "dot": "#C4543F",
    "dot_halo": "#E9E2C9",
    "sea_label": "#9EC8C5",
    "label": "#293A34",
}

LOCATION_RE = re.compile(
    r'^\s*\["(?P<name>[^"]+)",\s*'
    r"(?P<x>\d+),\s*(?P<y>\d+),\s*"
    r'"(?P<type>[^"]+)",\s*"(?P<region>[^"]+)",\s*'
    r"(?P<rank>\d+),"
)


@dataclass
class Anchor:
    name: str
    x: int
    y: int
    rank: int
    types: set[str] = field(default_factory=set)
    regions: set[str] = field(default_factory=set)
    sources: set[str] = field(default_factory=set)
    label: dict | None = None

    @property
    def key(self) -> tuple[str, int, int]:
        return (self.name, self.x, self.y)

    @property
    def render_label(self) -> bool:
        return self.name not in HIDDEN_BASEMAP_ANCHORS

    @property
    def render_dot(self) -> bool:
        return self.render_label and self.name not in NAME_ONLY_ANCHORS


def log(message: str) -> None:
    print(f"[map-redraw] {message}", flush=True)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def relpath(path: Path, root: Path) -> str:
    try:
        return path.resolve().relative_to(root.resolve()).as_posix()
    except ValueError:
        return path.resolve().as_posix()


def parse_locations(paths: Sequence[tuple[str, Path]]) -> tuple[list[Anchor], dict[str, int]]:
    merged: dict[tuple[str, int, int], Anchor] = {}
    counts: dict[str, int] = {}
    for source_name, path in paths:
        count = 0
        unmatched_rows: list[tuple[int, str]] = []
        for line_number, line in enumerate(
            path.read_text(encoding="utf-8").splitlines(),
            start=1,
        ):
            match = LOCATION_RE.match(line)
            if not match:
                if line.lstrip().startswith('["'):
                    unmatched_rows.append((line_number, line.strip()))
                continue
            count += 1
            name = match.group("name")
            x = int(match.group("x"))
            y = int(match.group("y"))
            rank = int(match.group("rank"))
            if not (0 <= x < CANVAS[0] and 0 <= y < CANVAS[1]):
                raise ValueError(
                    f"{path}:{line_number}: anchor {(x, y)} is outside {CANVAS}"
                )
            if rank not in {1, 2, 3}:
                raise ValueError(f"{path}:{line_number}: unsupported rank {rank}")
            key = (name, x, y)
            anchor = merged.get(key)
            if anchor is None:
                anchor = Anchor(name=name, x=x, y=y, rank=rank)
                merged[key] = anchor
            anchor.rank = min(anchor.rank, rank)
            anchor.types.add(match.group("type"))
            anchor.regions.add(match.group("region"))
            anchor.sources.add(source_name)
        if unmatched_rows:
            detail = "\n".join(
                f"  line {line_number}: {line}"
                for line_number, line in unmatched_rows[:10]
            )
            raise ValueError(f"{path}: unparsed LOCATION_ROWS entries:\n{detail}")
        counts[source_name] = count

    anchors = sorted(merged.values(), key=lambda item: (item.rank, item.y, item.x, item.name))
    if counts != EXPECTED_SOURCE_COUNTS:
        raise AssertionError(
            f"location row counts changed: {counts}, expected {EXPECTED_SOURCE_COUNTS}"
        )
    if len(anchors) != EXPECTED_ANCHOR_COUNT:
        raise AssertionError(
            f"distinct anchors changed: {len(anchors)}, expected {EXPECTED_ANCHOR_COUNT}"
        )
    if len({anchor.name for anchor in anchors}) != EXPECTED_NAME_COUNT:
        raise AssertionError(
            "distinct place-name count changed: "
            f"{len({anchor.name for anchor in anchors})}, "
            f"expected {EXPECTED_NAME_COUNT}"
        )
    name_positions: dict[str, set[tuple[int, int]]] = {}
    for anchor in anchors:
        name_positions.setdefault(anchor.name, set()).add((anchor.x, anchor.y))
    conflicts = {
        name: positions
        for name, positions in name_positions.items()
        if len(positions) > 1
    }
    if conflicts != EXPECTED_CONFLICTS:
        raise AssertionError(
            f"coordinate conflicts changed: {conflicts}, expected {EXPECTED_CONFLICTS}"
        )
    return anchors, counts


def load_rgb(path: Path, expected_size: tuple[int, int] | None = None) -> Image.Image:
    with Image.open(path) as opened:
        image = opened.convert("RGB")
    if expected_size and image.size != expected_size:
        raise ValueError(f"{path} is {image.size}, expected {expected_size}")
    return image


def load_mask(path: Path) -> Image.Image:
    with Image.open(path) as opened:
        mask = opened.convert("L")
    return mask.point(lambda value: 255 if value >= 128 else 0, mode="L")


def grade_texture(
    texture: Image.Image,
    dark: str,
    light: str,
    colorized_weight: float,
) -> Image.Image:
    texture = texture.convert("RGB")
    gray = ImageOps.autocontrast(texture.convert("L"), cutoff=1)
    colored = ImageOps.colorize(gray, black=dark, white=light)
    result = Image.blend(texture, colored, colorized_weight)
    texture.close()
    colored.close()
    gray.close()
    return result


def mirrored_tile(
    texture: Image.Image,
    size: tuple[int, int],
    offset: tuple[int, int] = (0, 0),
) -> Image.Image:
    """Tile a texture in a mirrored 2x2 repeat so adjacent edges match."""
    texture = texture.convert("RGB")
    tw, th = texture.size
    repeat = Image.new("RGB", (tw * 2, th * 2))
    repeat.paste(texture, (0, 0))
    repeat.paste(ImageOps.mirror(texture), (tw, 0))
    repeat.paste(ImageOps.flip(texture), (0, th))
    repeat.paste(ImageOps.mirror(ImageOps.flip(texture)), (tw, th))

    out = Image.new("RGB", size)
    rw, rh = repeat.size
    ox = -(offset[0] % rw)
    oy = -(offset[1] % rh)
    for y in range(oy, size[1], rh):
        for x in range(ox, size[0], rw):
            out.paste(repeat, (x, y))
    repeat.close()
    texture.close()
    return out


KNOWN_INLAND_WATER_WINDOWS = [
    # Coordinates in the legacy 707x460 landmask.  These windows preserve the
    # handful of meaningful enclosed lakes/inland waters while all other
    # enclosed black components are treated as terrain/label contamination.
    (114, 102, 134, 122),  # northern lake west of Winterfell
    (153, 218, 181, 251),  # the Gods Eye
    (492, 210, 528, 260),  # northeastern Essos lake group
    (394, 328, 442, 391),  # Valyrian inland-water/gulf complex
]

# Full-resolution source windows containing four legacy sailing-ship
# silhouettes that were accidentally classified as islands in landmask.png.
# These are deliberately explicit: indiscriminately removing small connected
# components would also erase real islets throughout the Stepstones and east.
KNOWN_LEGACY_SHIP_WINDOWS = [
    (2890, 945, 3110, 1065),  # two-ship fleet in the Shivering Sea
    (1540, 3260, 1685, 3360),  # southern Summer Sea ship
    (285, 3110, 385, 3190),  # western Summer Sea ship
]

KNOWN_LEGACY_SHIP_COARSE_COMPONENTS = [
    ((37, 390, 47, 397), 10),
    ((194, 409, 209, 418), 25),
    ((362, 124, 376, 132), 23),
    ((376, 119, 389, 125), 15),
]

# Small registered geography corrections requested after the v2 visual audit.
# They are authored polygons in the site's 5652×3682 coordinate space.  The
# reference raster is used only to register their position, never as paint.
FEATURE_LAND_POLYGONS: list[tuple[str, list[tuple[int, int]]]] = [
    (
        "isle-of-faces",
        [
            (1328, 1857),
            (1337, 1857),
            (1343, 1860),
            (1351, 1862),
            (1353, 1867),
            (1350, 1871),
            (1345, 1874),
            (1334, 1874),
            (1327, 1871),
            (1324, 1865),
            (1325, 1861),
        ],
    ),
    (
        "tyrosh",
        [
            (2061, 2524),
            (2067, 2525),
            (2069, 2529),
            (2067, 2533),
            (2062, 2536),
            (2059, 2540),
            (2054, 2544),
            (2049, 2547),
            (2044, 2547),
            (2040, 2543),
            (2040, 2539),
            (2044, 2536),
            (2048, 2533),
            (2052, 2529),
            (2057, 2526),
        ],
    ),
    (
        "driftmark-islet",
        [(1723, 2050), (1730, 2048), (1739, 2051), (1742, 2057), (1738, 2063), (1728, 2064), (1722, 2059)],
    ),
    (
        "claw-isle",
        [(1829, 1803), (1837, 1810), (1838, 1820), (1833, 1829), (1824, 1826), (1820, 1818), (1823, 1809)],
    ),
    (
        "lys",
        [
            (2162, 2900),
            (2177, 2904),
            (2191, 2906),
            (2208, 2898),
            (2217, 2890),
            (2230, 2888),
            (2237, 2897),
            (2228, 2908),
            (2215, 2914),
            (2204, 2926),
            (2192, 2932),
            (2180, 2945),
            (2166, 2942),
            (2159, 2926),
        ],
    ),
    (
        "stepstones-northwest",
        [(1860, 2662), (1868, 2644), (1882, 2630), (1897, 2635), (1905, 2652), (1898, 2671), (1887, 2690), (1873, 2709), (1862, 2694)],
    ),
    (
        "stepstones-north",
        [(1972, 2619), (1978, 2613), (1987, 2620), (1984, 2634), (1975, 2630)],
    ),
    (
        "stepstones-northeast",
        [(2020, 2612), (2028, 2597), (2040, 2603), (2044, 2618), (2034, 2630), (2023, 2625)],
    ),
    (
        "stepstones-middle-east",
        [(2005, 2680), (2015, 2674), (2029, 2679), (2024, 2688), (2010, 2687)],
    ),
    (
        "stepstones-middle-west",
        [(1957, 2689), (1963, 2685), (1968, 2690), (1963, 2694)],
    ),
    (
        "stepstones-southwest",
        [(1973, 2718), (1979, 2713), (1987, 2719), (1982, 2727), (1975, 2725)],
    ),
    (
        "stepstones-main",
        [(1983, 2760), (1988, 2743), (2000, 2738), (2013, 2745), (2023, 2761), (2017, 2774), (2004, 2784), (1990, 2778)],
    ),
    (
        "stepstones-east",
        [(2051, 2725), (2061, 2717), (2075, 2720), (2084, 2728), (2075, 2736), (2059, 2734)],
    ),
]

FEATURE_LAND_ELLIPSES: list[tuple[str, tuple[int, int, int, int]]] = [
    ("lys-northwest-islet", (2183, 2884, 2192, 2889)),
    ("lys-northeast-islet", (2225, 2878, 2233, 2888)),
    ("lys-south-islet", (2197, 2950, 2202, 2955)),
    ("stepstones-tiny-1", (1905, 2717, 1913, 2725)),
    ("stepstones-tiny-2", (1923, 2719, 1931, 2727)),
    ("stepstones-tiny-3", (1929, 2703, 1937, 2711)),
    ("stepstones-tiny-4", (1932, 2711, 1940, 2719)),
    ("stepstones-tiny-5", (1937, 2727, 1947, 2737)),
    ("stepstones-tiny-6", (1944, 2721, 1952, 2729)),
]

FEATURE_WATER_POLYGONS: list[tuple[str, list[tuple[int, int]]]] = [
    (
        "blackwater-bay-kings-landing-coast",
        [
            (1542, 2054),
            (1548, 2048),
            (1560, 2041),
            (1575, 2035),
            (1592, 2032),
            (1610, 2035),
            (1628, 2040),
            (1645, 2046),
            (1662, 2052),
            (1676, 2060),
            (1684, 2071),
            (1681, 2082),
            (1669, 2090),
            (1652, 2094),
            (1633, 2092),
            (1615, 2087),
            (1598, 2082),
            (1580, 2079),
            (1560, 2076),
            (1548, 2072),
            (1539, 2065),
            (1539, 2058),
        ],
    ),
    (
        "long-lake",
        [
            (1360, 506),
            (1367, 518),
            (1369, 540),
            (1368, 562),
            (1365, 584),
            (1361, 605),
            (1356, 623),
            (1352, 637),
            (1348, 642),
            (1345, 638),
            (1344, 626),
            (1345, 610),
            (1346, 590),
            (1347, 570),
            (1348, 550),
            (1351, 530),
            (1355, 514),
        ],
    ),
    (
        "dagger-lake",
        [
            (2698, 2248),
            (2702, 2258),
            (2705, 2280),
            (2704, 2305),
            (2703, 2335),
            (2699, 2338),
            (2696, 2310),
            (2695, 2280),
            (2696, 2260),
        ],
    ),
    (
        "red-lake",
        [(833, 2297), (839, 2301), (838, 2307), (830, 2316), (822, 2314), (821, 2308), (826, 2301)],
    ),
    (
        "stoney-sept-lake",
        [
            (1113, 1949),
            (1120, 1946),
            (1132, 1946),
            (1143, 1949),
            (1154, 1953),
            (1159, 1957),
            (1154, 1961),
            (1143, 1963),
            (1128, 1962),
            (1117, 1959),
            (1111, 1954),
        ],
    ),
    (
        "central-middle-lake",
        [
            (4126, 1889),
            (4136, 1890),
            (4143, 1896),
            (4149, 1905),
            (4150, 1915),
            (4147, 1924),
            (4141, 1932),
            (4133, 1938),
            (4123, 1945),
            (4115, 1943),
            (4109, 1938),
            (4111, 1930),
            (4115, 1922),
            (4116, 1913),
            (4118, 1903),
        ],
    ),
    (
        "central-east-lake",
        [
            (4218, 1935),
            (4227, 1935),
            (4235, 1939),
            (4241, 1947),
            (4242, 1955),
            (4239, 1964),
            (4236, 1972),
            (4229, 1979),
            (4218, 1985),
            (4213, 1980),
            (4210, 1971),
            (4210, 1962),
            (4211, 1953),
            (4212, 1945),
        ],
    ),
]


def component_intersects_windows(
    bbox: tuple[int, int, int, int],
    windows: Sequence[tuple[int, int, int, int]],
) -> bool:
    return any(intersection_area(bbox, window) > 0 for window in windows)


def clean_coarse_landmask(coarse: Image.Image) -> tuple[Image.Image, dict]:
    """
    Remove terrain/label pinholes embedded in the legacy coarse landmask.

    The edge-connected ocean and channels are retained. Enclosed components are
    filled unless they intersect one of the explicit inland-water windows
    above. This is important because the legacy mask was generated from the
    fully illustrated source: directly eroding it turns every black mountain,
    label, or tree speck into a conspicuous ~30 px square at full resolution.
    """
    land = np.asarray(coarse, dtype=np.uint8) >= 128
    water = ~land
    height, width = land.shape
    visited = np.zeros_like(land, dtype=bool)
    filled_components = 0
    filled_pixels = 0
    retained_components = 0

    for y in range(height):
        for x in range(width):
            if not water[y, x] or visited[y, x]:
                continue
            queue: deque[tuple[int, int]] = deque([(x, y)])
            visited[y, x] = True
            component: list[tuple[int, int]] = []
            touches_edge = False
            while queue:
                cx, cy = queue.pop()
                component.append((cx, cy))
                if cx == 0 or cy == 0 or cx == width - 1 or cy == height - 1:
                    touches_edge = True
                for nx, ny in (
                    (cx - 1, cy),
                    (cx + 1, cy),
                    (cx, cy - 1),
                    (cx, cy + 1),
                ):
                    if (
                        0 <= nx < width
                        and 0 <= ny < height
                        and water[ny, nx]
                        and not visited[ny, nx]
                    ):
                        visited[ny, nx] = True
                        queue.append((nx, ny))
            min_x = min(point[0] for point in component)
            min_y = min(point[1] for point in component)
            max_x = max(point[0] for point in component) + 1
            max_y = max(point[1] for point in component) + 1
            bbox = (min_x, min_y, max_x, max_y)
            preserve_as_water = (
                len(component) >= 31
                and component_intersects_windows(
                    bbox,
                    KNOWN_INLAND_WATER_WINDOWS,
                )
            )
            if not touches_edge and not preserve_as_water:
                for cx, cy in component:
                    land[cy, cx] = True
                filled_components += 1
                filled_pixels += len(component)
            elif not touches_edge:
                retained_components += 1

    removed_ship_components: list[dict] = []
    for window, expected_area in KNOWN_LEGACY_SHIP_COARSE_COMPONENTS:
        left, top, right, bottom = window
        actual_area = int(land[top:bottom, left:right].sum())
        if actual_area != expected_area:
            raise AssertionError(
                "legacy ship component changed inside "
                f"{window}: area={actual_area}, expected={expected_area}"
            )
        land[top:bottom, left:right] = False
        removed_ship_components.append(
            {
                "coarse_bbox": list(window),
                "coarse_area": actual_area,
                "classification": "legacy ship silhouette, forced to water",
            }
        )

    clean = Image.fromarray(np.uint8(land) * 255, mode="L")
    return clean, {
        "method": "fill enclosed legacy-mask noise except explicit inland-water windows",
        "preserved_inland_water_windows": [list(window) for window in KNOWN_INLAND_WATER_WINDOWS],
        "filled_components": filled_components,
        "filled_coarse_pixels": filled_pixels,
        "retained_enclosed_components": retained_components,
        "removed_legacy_ship_components": removed_ship_components,
    }


def build_precise_land_mask(
    source: Image.Image,
    coarse: Image.Image,
) -> tuple[Image.Image, dict]:
    """
    Keep the coarse mask as a topological prior, but solve its ~8 px boundary
    uncertainty from the source's strong light-land/dark-water separation.

    Interior dark terrain marks stay land; dark lakes and coastal water stay
    water.  This avoids accidentally treating labels, mountains, or rivers as
    holes in the continents.
    """
    clean_coarse, cleanup_qa = clean_coarse_landmask(coarse)
    coarse_full = clean_coarse.resize(CANVAS, Image.Resampling.BILINEAR)
    clean_coarse.close()
    prior = coarse_full.point(lambda value: 255 if value >= 128 else 0, mode="L")
    coarse_full.close()
    prior_draw = ImageDraw.Draw(prior)
    for window in KNOWN_LEGACY_SHIP_WINDOWS:
        prior_draw.rectangle(window, fill=0)

    # The downscaled landmask is roughly one mask pixel per eight source pixels.
    # A 31 px band safely brackets its coastline uncertainty.
    prior_dilated = prior.filter(ImageFilter.MaxFilter(31))
    prior_eroded = prior.filter(ImageFilter.MinFilter(31))

    gray = source.convert("L").filter(ImageFilter.GaussianBlur(1.15))
    source_land = gray.point(lambda value: 255 if value >= 76 else 0, mode="L")
    gray.close()

    # Close pinholes from letters, rivers, and terrain strokes along the coast.
    closed = source_land.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    source_land.close()

    boundary_solution = ImageChops.multiply(closed, prior_dilated)
    closed.close()
    prior_dilated.close()
    precise = ImageChops.lighter(prior_eroded, boundary_solution)
    prior_eroded.close()
    boundary_solution.close()
    prior.close()

    # One-pixel antialiasing pass followed by a hard registration mask.
    smoothed = precise.filter(ImageFilter.GaussianBlur(0.55))
    precise.close()
    final = smoothed.point(lambda value: 255 if value >= 128 else 0, mode="L")
    smoothed.close()
    # The legacy source's oversized black watershed tree crosses the northern
    # Essos shoreline. It contaminated both the old coarse mask and the source
    # threshold with blocky branch-shaped protrusions. Replace only that short
    # segment with a clean, independently authored shoreline curve.
    watershed_coast = [
        (3050, 1660),
        (3090, 1655),
        (3130, 1640),
        (3170, 1615),
        (3210, 1585),
        (3250, 1550),
        (3290, 1540),
        (3330, 1520),
        (3370, 1490),
        (3410, 1465),
        (3450, 1455),
        (3490, 1465),
        (3530, 1485),
        (3570, 1500),
        (3610, 1490),
        (3650, 1500),
        (3690, 1520),
        (3730, 1550),
        (3770, 1580),
        (3800, 1600),
        (3830, 1590),
        (3860, 1550),
        (3890, 1490),
        (3920, 1465),
        (3960, 1455),
        (4000, 1460),
    ]
    smooth_watershed_coast: list[tuple[float, float]] = [
        (float(x), float(y)) for x, y in watershed_coast
    ]
    for _ in range(3):
        refined: list[tuple[float, float]] = [smooth_watershed_coast[0]]
        for first, second in zip(
            smooth_watershed_coast,
            smooth_watershed_coast[1:],
        ):
            refined.append(
                (
                    first[0] * 0.75 + second[0] * 0.25,
                    first[1] * 0.75 + second[1] * 0.25,
                )
            )
            refined.append(
                (
                    first[0] * 0.25 + second[0] * 0.75,
                    first[1] * 0.25 + second[1] * 0.75,
                )
            )
        refined.append(smooth_watershed_coast[-1])
        smooth_watershed_coast = refined
    repaired_coast = [
        (round(x), round(y)) for x, y in smooth_watershed_coast
    ]
    replacement = final.copy()
    repair_draw = ImageDraw.Draw(replacement)
    repair_draw.polygon(
        [(3050, 1100), (4000, 1100), *reversed(repaired_coast)],
        fill=0,
    )
    repair_draw.polygon(
        [*repaired_coast, (4000, 1950), (3050, 1950)],
        fill=255,
    )
    repair_blend = Image.new("L", CANVAS, 0)
    blend_draw = ImageDraw.Draw(repair_blend)
    blend_draw.rectangle((3250, 1100, 3800, 1950), fill=255)
    for x in range(3050, 3250):
        blend_draw.line(
            ((x, 1100), (x, 1950)),
            fill=round(255 * (x - 3050) / 200),
        )
    for x in range(3800, 4001):
        blend_draw.line(
            ((x, 1100), (x, 1950)),
            fill=round(255 * (4000 - x) / 200),
        )
    repaired = Image.composite(replacement, final, repair_blend)
    replacement.close()
    final.close()
    repair_blend.close()

    # Regularize tiny staircase notches and one-pixel protrusions without
    # imposing the square corners produced by morphological filters.
    feathered_edges = repaired.filter(ImageFilter.GaussianBlur(1.5))
    repaired.close()
    finished = feathered_edges.point(
        lambda value: 255 if value >= 128 else 0,
        mode="L",
    )
    feathered_edges.close()

    # Source-dark mountains and labels can still produce square water holes
    # within a few pixels of the refined shore. Flood the connected ocean and
    # fill only the remaining enclosed holes, retaining the four audited
    # inland-water regions.
    topology_probe = finished.copy()
    ImageDraw.floodfill(topology_probe, (0, 0), 128, thresh=0)
    topology_array = np.asarray(topology_probe, dtype=np.uint8)
    enclosed_holes = topology_array == 0
    topology_probe.close()
    preserved_full_windows: list[list[int]] = []
    for left, top, right, bottom in KNOWN_INLAND_WATER_WINDOWS:
        full_window = [
            math.floor(left * CANVAS[0] / COARSE_MASK_SIZE[0]),
            math.floor(top * CANVAS[1] / COARSE_MASK_SIZE[1]),
            math.ceil(right * CANVAS[0] / COARSE_MASK_SIZE[0]),
            math.ceil(bottom * CANVAS[1] / COARSE_MASK_SIZE[1]),
        ]
        preserved_full_windows.append(full_window)
        enclosed_holes[
            full_window[1] : full_window[3],
            full_window[0] : full_window[2],
        ] = False
    filled_full_pixels = int(np.count_nonzero(enclosed_holes))
    finished_array = np.array(finished, dtype=np.uint8, copy=True)
    finished.close()
    finished_array[enclosed_holes] = 255
    finished = Image.fromarray(finished_array, mode="L")

    # Apply only the small registered geography corrections that are absent
    # from the topology. The Gods Eye and Isle of Faces deliberately remain
    # the source-derived registered mask geometry; no source paint is reused.
    feature_draw = ImageDraw.Draw(finished)
    # Remove the oversized source-derived Dagger Lake void before carving the
    # independently authored narrow lake/channel below.
    feature_draw.rectangle((2670, 2235, 2738, 2350), fill=255)
    for _name, polygon in FEATURE_WATER_POLYGONS:
        feature_draw.polygon(polygon, fill=0)
    for _name, polygon in FEATURE_LAND_POLYGONS:
        feature_draw.polygon(polygon, fill=255)
    for _name, ellipse in FEATURE_LAND_ELLIPSES:
        feature_draw.ellipse(ellipse, fill=255)

    # Reassert the audited ship windows after smoothing so no trace can bloom
    # back into a false islet.
    finished_draw = ImageDraw.Draw(finished)
    for window in KNOWN_LEGACY_SHIP_WINDOWS:
        finished_draw.rectangle(window, fill=0)

    cleanup_qa["manual_registered_repairs"] = [
        {
            "name": "northern-essos-watershed-tree-artifact",
            "bbox": [3050, 1100, 4000, 1950],
            "method": (
                "independently authored shoreline control points with "
                "200 px horizontal feathered joins"
            ),
        },
        {
            "name": "requested-small-geography-repairs",
            "method": "independently authored registered land/water polygons",
            "native_registered_features": {
                "gods-eye": "water",
                "isle-of-faces": "land-island",
            },
            "filled_legacy_water_windows": {
                "dagger-lake": [2670, 2235, 2738, 2350],
            },
            "land_polygons": [name for name, _polygon in FEATURE_LAND_POLYGONS],
            "land_ellipses": [name for name, _ellipse in FEATURE_LAND_ELLIPSES],
            "water_polygons": [name for name, _polygon in FEATURE_WATER_POLYGONS],
        },
    ]
    cleanup_qa["removed_false_land_windows"] = [
        {
            "name": "legacy-ship-silhouette",
            "bbox": list(window),
            "method": "audited explicit water override",
        }
        for window in KNOWN_LEGACY_SHIP_WINDOWS
    ]
    cleanup_qa["edge_regularization"] = {
        "method": "1.5 px Gaussian hard-mask pass",
        "purpose": "remove one-pixel hooks, staircase notches, and threshold burrs",
    }
    cleanup_qa["full_resolution_hole_cleanup"] = {
        "method": "edge-connected ocean flood with registered inland-water exemptions",
        "filled_pixels": filled_full_pixels,
        "preserved_full_resolution_windows": preserved_full_windows,
    }
    return finished, cleanup_qa


def lowres_gradient(
    size: tuple[int, int],
    center: tuple[float, float],
    radius: tuple[float, float],
    strength: float,
    invert: bool = False,
) -> Image.Image:
    """Return a memory-efficient elliptical falloff mask built at 1/8 scale."""
    sw = max(2, math.ceil(size[0] / 8))
    sh = max(2, math.ceil(size[1] / 8))
    yy, xx = np.mgrid[0:sh, 0:sw]
    cx = center[0] / size[0] * sw
    cy = center[1] / size[1] * sh
    rx = max(1.0, radius[0] / size[0] * sw)
    ry = max(1.0, radius[1] / size[1] * sh)
    distance = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    values = np.clip(1.0 - distance, 0.0, 1.0)
    values = values * values * (3.0 - 2.0 * values)
    if invert:
        values = 1.0 - values
    values = np.uint8(np.clip(values * 255.0 * strength, 0, 255))
    small = Image.fromarray(values, mode="L")
    full = small.resize(size, Image.Resampling.BILINEAR)
    small.close()
    return full


def apply_wash(
    image: Image.Image,
    color: str,
    wash_mask: Image.Image,
    land_mask: Image.Image,
) -> None:
    clipped = ImageChops.multiply(wash_mask, land_mask)
    image.paste(color, (0, 0, image.width, image.height), clipped)
    clipped.close()
    wash_mask.close()


def apply_biome_washes(land: Image.Image, land_mask: Image.Image) -> None:
    # Cool frozen north.
    apply_wash(
        land,
        PALETTE["snow"],
        lowres_gradient(CANVAS, (1150, 40), (1225, 825), 0.84),
        land_mask,
    )
    # Temperate Westeros.
    apply_wash(
        land,
        PALETTE["temperate"],
        lowres_gradient(CANVAS, (1150, 1500), (1050, 1500), 0.23),
        land_mask,
    )
    # Dorne and the southeastern grasslands.
    apply_wash(
        land,
        PALETTE["grassland"],
        lowres_gradient(CANVAS, (1350, 2940), (950, 720), 0.25),
        land_mask,
    )
    apply_wash(
        land,
        PALETTE["grassland"],
        lowres_gradient(CANVAS, (4050, 2200), (2150, 1300), 0.22),
        land_mask,
    )
    # The red waste gets an unmistakably different mineral wash.
    apply_wash(
        land,
        PALETTE["desert"],
        lowres_gradient(CANVAS, (4900, 2860), (1250, 950), 0.31),
        land_mask,
    )


def draw_far_north_snow(
    land: Image.Image,
    land_mask: Image.Image,
    seed: int,
) -> dict:
    """Add clipped, fine-scale snow crust and wind-carved drift marks."""
    rng = random.Random(seed ^ 0x51F04D)
    crust = Image.new("L", CANVAS, 0)
    crust_draw = ImageDraw.Draw(crust)
    crust_marks = 0
    for y0 in range(10, 760, 17):
        north_strength = max(0.0, min(1.0, (760.0 - y0) / 650.0))
        for x0 in range(430, 1910, 19):
            x = x0 + rng.randint(-7, 7)
            y = y0 + rng.randint(-6, 6)
            if land_mask.getpixel((x, y)) < 128:
                continue
            if rng.random() > 0.18 + north_strength * 0.48:
                continue
            radius_x = rng.randint(1, 4)
            radius_y = rng.randint(1, 2)
            crust_draw.ellipse(
                (
                    x - radius_x,
                    y - radius_y,
                    x + radius_x,
                    y + radius_y,
                ),
                fill=rng.randint(46, 104),
            )
            crust_marks += 1

    clipped_crust = ImageChops.multiply(crust, land_mask)
    crust.close()
    land.paste(PALETTE["snow_highlight"], (0, 0, *CANVAS), clipped_crust)
    crust_pixels = sum(clipped_crust.histogram()[1:])
    clipped_crust.close()

    drifts = Image.new("L", CANVAS, 0)
    drift_draw = ImageDraw.Draw(drifts)
    drift_count = 0
    for _ in range(86):
        x = rng.randint(520, 1810)
        y = rng.randint(25, 690)
        if land_mask.getpixel((x, y)) < 128:
            continue
        length = rng.randint(22, 64)
        rise = rng.randint(-9, 9)
        points = [
            (x - length // 2, y),
            (x - length // 6, y + rise),
            (x + length // 6, y - rise // 2),
            (x + length // 2, y + rise // 3),
        ]
        drift_draw.line(
            chaikin_curve(points, iterations=2),
            fill=rng.randint(34, 72),
            width=1,
        )
        drift_count += 1

    clipped_drifts = ImageChops.multiply(drifts, land_mask)
    drifts.close()
    land.paste(PALETTE["snow_shadow"], (0, 0, *CANVAS), clipped_drifts)
    drift_pixels = sum(clipped_drifts.histogram()[1:])
    clipped_drifts.close()
    return {
        "crust_marks": crust_marks,
        "crust_nonzero_pixels": crust_pixels,
        "drift_lines": drift_count,
        "drift_nonzero_pixels": drift_pixels,
        "extent": [430, 0, 1910, 760],
        "method": "seeded clipped snow crust and independently drawn drift hatching",
    }


def normalize_water_material(
    water_material: Image.Image,
    land_mask: Image.Image,
) -> dict:
    """Normalize one canonical water plate for sea, lakes, and every river."""
    # A land-dependent shelf made inland channels visibly darker than the
    # receiving coastal water. Use one restrained global tint instead: every
    # opaque river/lake/sea pixel now samples the same material and color
    # treatment, while the inner ink coastline supplies the edge definition.
    uniform_tint = Image.new("L", CANVAS, 42)
    water_material.paste(
        PALETTE["ocean_light"],
        (0, 0, *CANVAS),
        uniform_tint,
    )
    uniform_pixels = CANVAS[0] * CANVAS[1]
    uniform_tint.close()
    return {
        "near_shelf_nonzero": 0,
        "far_shelf_nonzero": 0,
        "uniform_tint_alpha": 42,
        "uniform_tint_pixels": uniform_pixels,
        "material": "single color-normalized canonical sea/lake/river water plate",
    }


def draw_coastline(canvas: Image.Image, land_mask: Image.Image) -> dict:
    """Draw only the restrained inner coastline above the pasted land."""
    eroded = land_mask.filter(ImageFilter.MinFilter(7))
    coast = ImageChops.subtract(land_mask, eroded)
    eroded.close()
    canvas.paste(PALETTE["terrain_ink"], (0, 0, *CANVAS), coast)
    counts = {"coast_pixels": coast.histogram()[255]}
    coast.close()
    return counts


V2_REPLACED_RIVER_CORRIDORS: list[tuple[str, list[tuple[int, int]], int]] = [
    (
        "white-knife",
        [(1360, 1070), (1335, 960), (1305, 830), (1350, 690), (1380, 525)],
        70,
    ),
    (
        "green-fork",
        [(1160, 1460), (1190, 1350), (1220, 1240), (1230, 1110)],
        72,
    ),
    (
        "trident-red-fork",
        [(1025, 1770), (1100, 1765), (1190, 1755), (1325, 1710), (1490, 1780)],
        82,
    ),
    (
        "trident-blue-fork",
        [(1060, 1595), (1160, 1615), (1260, 1670), (1360, 1730)],
        72,
    ),
    (
        "blackwater-rush",
        [(1285, 1840), (1320, 1910), (1400, 1970), (1535, 2057)],
        66,
    ),
    (
        "mander",
        [(1320, 2180), (1230, 2240), (1140, 2310), (1030, 2400), (910, 2460), (675, 2575)],
        86,
    ),
    (
        "honeywine",
        [(815, 2470), (790, 2550), (750, 2630), (720, 2680)],
        58,
    ),
    (
        "rhoyne-main",
        [(2600, 1800), (2600, 2020), (2650, 2250), (2710, 2480), (2780, 2730), (2838, 2925)],
        116,
    ),
    (
        "rhoyne-qohor-branch",
        [(2800, 1795), (2760, 1980), (2700, 2200), (2660, 2360)],
        92,
    ),
    (
        "central-essos-river",
        [(3500, 1370), (3490, 1600), (3570, 1840), (3670, 2060), (4000, 2150), (4320, 2290)],
        110,
    ),
    # Additional independently traced tributaries and regional watercourses.
    # These points intentionally describe broad geographic corridors rather
    # than following the legacy raster line-for-line.
    (
        "northwestern-rills",
        [(850, 1110), (920, 1050), (990, 970), (1030, 870), (1080, 770), (1130, 665)],
        54,
    ),
    (
        "last-river",
        [(1760, 730), (1680, 690), (1620, 650), (1570, 605), (1515, 565)],
        60,
    ),
    (
        "weeping-water",
        [(1770, 930), (1700, 905), (1620, 870), (1550, 835), (1485, 815)],
        54,
    ),
    (
        "fever-river",
        [(1110, 1280), (1170, 1330), (1240, 1380), (1320, 1430), (1395, 1500)],
        64,
    ),
    (
        "green-fork-lower",
        [(1230, 1110), (1300, 1230), (1360, 1370), (1440, 1515), (1515, 1640), (1585, 1765)],
        76,
    ),
    (
        "trident-eastern-branch",
        [(1760, 1530), (1700, 1590), (1630, 1660), (1540, 1735), (1490, 1780)],
        68,
    ),
    (
        "tumblestone",
        [(835, 1775), (930, 1760), (1030, 1745), (1130, 1755), (1230, 1755), (1325, 1710)],
        62,
    ),
    (
        "blackwater-western-tributary",
        [(1130, 1845), (1205, 1840), (1285, 1840)],
        54,
    ),
    (
        "gods-eye-outlet",
        [(1340, 1830), (1385, 1880), (1430, 1950), (1535, 2057)],
        58,
    ),
    (
        "mander-north-branch",
        [(1010, 2110), (1025, 2220), (1020, 2330), (1030, 2400)],
        58,
    ),
    (
        "mander-west-branch",
        [(690, 2310), (750, 2380), (820, 2460), (910, 2560)],
        54,
    ),
    (
        "mander-east-branch",
        [(1430, 2350), (1350, 2390), (1260, 2440), (1160, 2485), (1030, 2520)],
        62,
    ),
    (
        "cockleswent",
        [(1160, 2440), (1165, 2510), (1135, 2570), (1080, 2610), (1010, 2640)],
        52,
    ),
    (
        "rainwood-river",
        [(1620, 2490), (1580, 2440), (1530, 2380), (1480, 2320), (1430, 2280)],
        50,
    ),
    (
        "torrentine",
        [(760, 3120), (795, 3190), (840, 3250), (890, 3300)],
        50,
    ),
    (
        "greenblood",
        [(945, 3290), (1040, 3315), (1140, 3350), (1230, 3390), (1320, 3410)],
        70,
    ),
    (
        "scourge",
        [(1220, 3270), (1260, 3325), (1320, 3410)],
        46,
    ),
    (
        "vaith-river",
        [(1390, 3360), (1470, 3400), (1560, 3425), (1650, 3410)],
        50,
    ),
    (
        "upper-rhoyne-west",
        [(2340, 1490), (2400, 1600), (2470, 1740), (2540, 1910), (2620, 2110), (2660, 2360)],
        76,
    ),
    (
        "upper-rhoyne-east",
        [(2910, 1490), (2870, 1600), (2830, 1730), (2800, 1795)],
        64,
    ),
    (
        "qoyne",
        [(3030, 1570), (2960, 1660), (2880, 1780), (2800, 1910), (2700, 2200)],
        66,
    ),
    (
        "lower-rhoyne-west",
        [(2580, 2180), (2620, 2360), (2670, 2530), (2740, 2700), (2838, 2925)],
        80,
    ),
    (
        "lower-rhoyne-east",
        [(2940, 2070), (2890, 2210), (2840, 2380), (2800, 2540)],
        58,
    ),
    (
        "central-northwest-branch",
        [(3330, 1550), (3400, 1630), (3490, 1710)],
        54,
    ),
    (
        "central-northeast-branch",
        [(3790, 1570), (3720, 1640), (3640, 1740), (3570, 1840)],
        58,
    ),
    (
        "central-western-branch",
        [(3260, 2040), (3390, 2050), (3520, 2060), (3670, 2060)],
        62,
    ),
    (
        "central-eastern-branch",
        [(4380, 1930), (4300, 2010), (4200, 2070), (4080, 2120), (4000, 2150)],
        62,
    ),
    (
        "central-southern-branch",
        [(4000, 2150), (4040, 2300), (4100, 2450), (4180, 2600)],
        58,
    ),
    (
        "skahazadhan",
        [(5140, 2810), (5050, 2850), (4960, 2900), (4860, 2960), (4760, 3040), (4670, 3120)],
        82,
    ),
    (
        "ghiscari-north-branch",
        [(4850, 2740), (4790, 2830), (4740, 2940), (4670, 3050)],
        56,
    ),
    (
        "ghiscari-south-branch",
        [(4680, 3070), (4760, 3150), (4850, 3240), (4940, 3330)],
        58,
    ),
    (
        "red-waste-wash",
        [(5060, 3000), (5160, 3020), (5270, 3060), (5380, 3010)],
        48,
    ),
    (
        "qarth-watercourse",
        [(5330, 3260), (5410, 3300), (5490, 3370), (5570, 3430)],
        54,
    ),
]

V2_REPLACED_SECONDARY_RIVER_CORRIDORS: list[tuple[str, list[tuple[int, int]], int]] = [
    ("white-knife-west-fork", [(1170, 835), (1235, 850), (1305, 830)], 44),
    (
        "white-knife-east-fork",
        [(1475, 955), (1430, 905), (1370, 860), (1305, 830)],
        42,
    ),
    (
        "barrowlands-west",
        [(760, 1260), (815, 1210), (875, 1170), (930, 1110)],
        40,
    ),
    (
        "neck-west-drainage",
        [(990, 1210), (1040, 1290), (1110, 1370), (1160, 1460)],
        42,
    ),
    (
        "broken-branch",
        [(1830, 1050), (1770, 1015), (1700, 980), (1625, 935)],
        42,
    ),
    (
        "red-fork-west-headwater",
        [(720, 1690), (820, 1720), (920, 1750), (1025, 1770)],
        44,
    ),
    (
        "blue-fork-north-headwater",
        [(980, 1490), (1010, 1540), (1060, 1595)],
        38,
    ),
    ("slayne", [(1870, 2520), (1780, 2480), (1700, 2430), (1620, 2390)], 42),
    (
        "brimstone",
        [(1040, 3050), (1110, 3140), (1200, 3240), (1320, 3410)],
        42,
    ),
    (
        "greenblood-north-fork",
        [(900, 3150), (990, 3210), (1100, 3290), (1230, 3390)],
        40,
    ),
    (
        "norvos-west-fork",
        [(2480, 1760), (2510, 1880), (2580, 2020), (2620, 2110)],
        40,
    ),
    (
        "rhoyne-fallen-fields-west",
        [(2410, 2440), (2480, 2540), (2580, 2640), (2710, 2760)],
        46,
    ),
    (
        "rhoyne-fallen-fields-east",
        [(3100, 2310), (3020, 2410), (2930, 2520), (2800, 2640)],
        44,
    ),
    ("rhoyne-delta-west", [(2780, 2730), (2750, 2860), (2700, 2980)], 42),
    ("rhoyne-delta-east", [(2780, 2730), (2840, 2860), (2890, 2980)], 42),
    (
        "central-basin-west-rill",
        [(3230, 1760), (3330, 1810), (3440, 1860), (3570, 1840)],
        40,
    ),
    (
        "central-basin-east-rill",
        [(4450, 1810), (4390, 1920), (4300, 2010)],
        40,
    ),
    (
        "skahazadhan-upper-fork",
        [(5280, 2640), (5180, 2690), (5070, 2760), (4960, 2860)],
        42,
    ),
    ("qarth-west-rill", [(5170, 3130), (5250, 3180), (5330, 3260)], 38),
]

V2_REPLACED_ROAD_ROUTES: list[tuple[str, list[tuple[int, int]], str]] = [
    (
        "kingsroad",
        [
            (1424, 270),
            (1410, 370),
            (1380, 500),
            (1340, 610),
            (1270, 705),
            (1225, 770),
            (1210, 900),
            (1228, 1120),
            (1235, 1300),
            (1245, 1450),
            (1300, 1580),
            (1400, 1730),
            (1425, 1840),
            (1470, 1950),
            (1535, 2057),
        ],
        "royal",
    ),
    (
        "high-road",
        [
            (1400, 1730),
            (1440, 1700),
            (1480, 1670),
            (1514, 1627),
            (1545, 1605),
            (1587, 1593),
            (1660, 1585),
            (1730, 1605),
            (1800, 1642),
        ],
        "major",
    ),
    (
        "river-road",
        [
            (1400, 1730),
            (1295, 1807),
            (1200, 1810),
            (1088, 1765),
            (995, 1830),
            (875, 1900),
            (740, 1956),
        ],
        "major",
    ),
    (
        "goldroad",
        [
            (740, 1956),
            (850, 1970),
            (965, 1990),
            (1070, 2020),
            (1190, 2050),
            (1320, 2070),
            (1450, 2050),
            (1535, 2057),
        ],
        "royal",
    ),
    (
        "roseroad",
        [
            (1535, 2057),
            (1505, 2130),
            (1420, 2180),
            (1320, 2215),
            (1230, 2245),
            (1142, 2278),
            (1040, 2340),
            (970, 2405),
            (912, 2457),
            (850, 2530),
            (790, 2600),
            (720, 2668),
        ],
        "royal",
    ),
    (
        "storm-road",
        [
            (1535, 2057),
            (1555, 2140),
            (1615, 2215),
            (1680, 2290),
            (1654, 2358),
        ],
        "major",
    ),
    (
        "ocean-road",
        [
            (740, 1956),
            (695, 2070),
            (670, 2200),
            (665, 2350),
            (710, 2470),
            (790, 2570),
            (720, 2668),
        ],
        "major",
    ),
    (
        "princes-pass",
        [
            (912, 2457),
            (1005, 2495),
            (1080, 2545),
            (1169, 2643),
            (1240, 2690),
            (1328, 2719),
            (1370, 2660),
            (1361, 2586),
            (1410, 2500),
            (1440, 2383),
        ],
        "major",
    ),
    (
        "summerhall-spur",
        [(1440, 2383), (1510, 2350), (1580, 2325), (1654, 2358)],
        "minor",
    ),
    (
        "winterfell-white-harbor",
        [(1207, 745), (1250, 820), (1290, 920), (1330, 1000), (1361, 1059)],
        "minor",
    ),
    (
        "last-hearth-road",
        [(1207, 745), (1290, 670), (1380, 590), (1450, 525), (1494, 495)],
        "minor",
    ),
    (
        "dreadfort-road",
        [(1380, 590), (1460, 635), (1522, 692)],
        "minor",
    ),
    (
        "crownlands-coast-road",
        [(1535, 2057), (1570, 2005), (1622, 1962), (1700, 1930), (1790, 1900)],
        "minor",
    ),
]

# Precision v3 survey network. These assignments intentionally replace the
# v2 exploratory tables above: shared confluence endpoints prevent duplicate
# channels, and the routes stop wherever the source survey shows no network.
RIVER_CORRIDORS = [
    ("last-river", [(1392, 425), (1410, 440), (1432, 445), (1437, 461), (1458, 470), (1464, 491), (1486, 506), (1491, 525), (1515, 528), (1535, 548), (1560, 543), (1572, 560), (1595, 570), (1605, 582), (1606, 600), (1615, 613), (1618, 625), (1608, 638), (1595, 646), (1590, 657), (1593, 668), (1605, 674), (1612, 686), (1615, 700), (1620, 708), (1632, 713), (1644, 716), (1651, 719)], (2, 4)),
    ("weeping-water", [(1538, 631), (1550, 652), (1545, 674), (1562, 689), (1585, 693), (1602, 716), (1627, 724), (1652, 742)], (2, 4)),
    ("broken-branch", [(1462, 844), (1490, 847), (1510, 862), (1511, 888), (1535, 902), (1541, 925), (1570, 937), (1594, 960), (1609, 984), (1616, 991)], (2, 4)),
    ("white-knife-long-lake-outlet", [(1348, 640), (1343, 646), (1340, 658), (1332, 667), (1320, 666), (1308, 676), (1297, 684), (1287, 698), (1272, 708), (1260, 720)], (2, 3)),
    ("white-knife-main", [(1260, 720), (1258, 740), (1264, 760), (1264, 780), (1254, 798), (1244, 815), (1248, 832), (1250, 850), (1260, 875), (1280, 868), (1297, 878), (1310, 889), (1315, 902), (1307, 912), (1294, 916), (1287, 928), (1297, 943), (1292, 955), (1302, 970), (1315, 987), (1323, 1004), (1332, 1020), (1331, 1035), (1340, 1048), (1347, 1057), (1352, 1070)], (3, 5)),
    ("white-knife-cerwyn-fork", [(1165, 850), (1190, 859), (1210, 875), (1240, 889), (1260, 875)], (2, 3)),
    ("stony-shore-rill", [(788, 820), (780, 849), (760, 875), (730, 895), (696, 901), (675, 920), (645, 929), (620, 951), (595, 962), (574, 990), (557, 1004)], (2, 4)),
    ("torrhens-square-drain", [(969, 914), (953, 930), (930, 942), (905, 944), (890, 965), (896, 990), (876, 1015), (870, 1050), (850, 1090), (842, 1127)], (2, 4)),
    ("barrowton-river", [(991, 1015), (985, 1035), (962, 1046), (952, 1070), (930, 1086), (919, 1110), (902, 1127), (904, 1139), (904, 1148)], (2, 4)),
    ("neck-fjord-river", [(1188, 1125), (1175, 1120), (1160, 1120), (1146, 1128), (1136, 1135), (1125, 1133), (1112, 1125), (1098, 1126), (1087, 1135), (1070, 1137), (1052, 1137), (1040, 1135), (1034, 1134), (1025, 1134)], (2, 5)),
    ("green-fork", [(1048, 1348), (1052, 1365), (1050, 1380), (1060, 1395), (1065, 1410), (1080, 1425), (1098, 1435), (1115, 1442), (1143, 1452), (1150, 1480), (1164, 1510), (1180, 1520), (1192, 1540), (1208, 1555), (1220, 1575), (1240, 1590), (1255, 1610), (1275, 1635), (1292, 1655), (1302, 1680), (1314, 1718)], (2, 8)),
    ("blue-fork", [(1105, 1600), (1120, 1605), (1140, 1604), (1160, 1612), (1180, 1624), (1200, 1638), (1220, 1650), (1240, 1660), (1260, 1672), (1280, 1688), (1298, 1700), (1314, 1718)], (2, 7)),
    ("red-fork-upper", [(1000, 1903), (1020, 1880), (1058, 1880), (1084, 1861), (1090, 1840), (1076, 1824), (1065, 1800), (1076, 1780), (1088, 1765)], (2, 4)),
    ("tumblestone", [(888, 1798), (905, 1782), (925, 1774), (950, 1770), (975, 1772), (995, 1755), (1015, 1752), (1035, 1760), (1055, 1760), (1070, 1768), (1088, 1765)], (2, 4)),
    (
        "red-fork-lower",
        [
            (1088, 1765),
            (1120, 1753),
            (1150, 1742),
            (1180, 1746),
            (1210, 1730),
            (1240, 1735),
            (1270, 1718),
            (1292, 1722),
            (1314, 1718),
        ],
        (4, 8),
    ),
    (
        "trident-main",
        [
            (1314, 1718),
            (1330, 1728),
            (1345, 1740),
            (1360, 1748),
            (1372, 1758),
            (1385, 1762),
            (1400, 1767),
            (1415, 1764),
            (1430, 1775),
            (1442, 1780),
            (1452, 1786),
            (1462, 1788),
        ],
        (22, 8),
    ),
    ("vale-upper-river", [(1420, 1382), (1450, 1390), (1480, 1382), (1510, 1366), (1542, 1362), (1572, 1347), (1605, 1342), (1638, 1322), (1675, 1312)], (2, 4)),
    ("vale-lower-river", [(1685, 1582), (1712, 1572), (1740, 1580), (1772, 1572), (1793, 1567), (1793, 1569), (1793, 1578)], (2, 4)),
    ("gods-eye-outlet", [(1330, 1918), (1327, 1940), (1347, 1962), (1342, 1990), (1368, 2010), (1385, 2045)], (2, 4)),
    ("blackwater-west", [(1157, 1957), (1170, 1952), (1183, 1955), (1190, 1960), (1212, 1985), (1215, 2015), (1240, 2038), (1280, 2040), (1330, 2025), (1385, 2045)], (2, 5)),
    (
        "blackwater-lower",
        [
            (1385, 2045),
            (1400, 2050),
            (1415, 2060),
            (1430, 2058),
            (1443, 2070),
            (1455, 2075),
            (1465, 2083),
            (1475, 2084),
        ],
        (5, 7),
    ),
    (
        "mander-northwest",
        [
            (900, 1900),
            (906, 1935),
            (895, 1970),
            (887, 2005),
            (895, 2040),
            (918, 2070),
            (925, 2100),
            (915, 2130),
            (920, 2160),
            (910, 2195),
            (915, 2230),
            (925, 2260),
            (920, 2290),
            (932, 2320),
            (930, 2350),
            (918, 2375),
            (920, 2400),
            (915, 2430),
            (912, 2457),
        ],
        (2, 6),
    ),
    ("mander-northeast", [(1320, 2162), (1272, 2168), (1240, 2190), (1200, 2202), (1170, 2230), (1140, 2275), (1100, 2300), (1050, 2340), (1040, 2380), (1000, 2410), (950, 2432), (912, 2457)], (2, 6)),
    ("blueburn", [(1300, 2280), (1270, 2285), (1240, 2300), (1210, 2305), (1180, 2295), (1140, 2275)], (2, 3)),
    ("cockleswent", [(1300, 2425), (1270, 2435), (1235, 2440), (1190, 2445), (1165, 2430), (1165, 2405), (1145, 2395), (1100, 2395), (1070, 2385), (1040, 2380)], (2, 3)),
    ("mander-lower", [(912, 2457), (890, 2468), (875, 2480), (850, 2485), (835, 2498), (810, 2503), (790, 2500), (775, 2488), (765, 2478), (760, 2474), (756, 2467), (748, 2462), (742, 2458)], (6, 8)),
    ("honeywine", [(790, 2538), (785, 2580), (780, 2610), (760, 2635), (740, 2650), (720, 2668), (710, 2680), (711, 2687), (706, 2695)], (2, 5)),
    ("rainwood-north-river", [(1570, 2250), (1562, 2235), (1580, 2215), (1585, 2190), (1600, 2180), (1598, 2152), (1630, 2140), (1652, 2122)], (2, 4)),
    ("slayne", [(1525, 2378), (1528, 2395), (1520, 2412), (1512, 2423), (1503, 2433), (1491, 2437), (1478, 2445), (1470, 2450), (1480, 2460), (1487, 2473), (1490, 2487), (1488, 2500), (1495, 2506), (1505, 2508)], (2, 5)),
    ("vultures-roost-rill", [(1218, 2580), (1250, 2574), (1290, 2562), (1340, 2550), (1390, 2544)], (2, 3)),
    ("torrentine", [(995, 2560), (980, 2600), (985, 2660), (970, 2710), (950, 2750), (920, 2790), (885, 2822), (889, 2825), (883, 2833)], (2, 5)),
    ("brimstone", [(1165, 2790), (1160, 2810), (1180, 2830), (1180, 2860), (1200, 2880), (1210, 2910), (1230, 2942), (1234, 2949), (1240, 2957)], (2, 4)),
    ("scourge", [(1345, 2800), (1360, 2820), (1400, 2830), (1450, 2830), (1500, 2840), (1570, 2842)], (2, 4)),
    ("vaith-greenblood-upper", [(1370, 2855), (1400, 2860), (1450, 2870), (1500, 2860), (1540, 2848), (1570, 2842)], (2, 4)),
    ("greenblood-lower", [(1570, 2842), (1620, 2845), (1660, 2860), (1695, 2880), (1729, 2890), (1735, 2888)], (4, 7)),
    ("braavosi-main", [(2195, 1406), (2201, 1413), (2205, 1435), (2220, 1455), (2222, 1472), (2240, 1490), (2260, 1500), (2280, 1530), (2300, 1570), (2302, 1620), (2330, 1650), (2322, 1680), (2340, 1700), (2350, 1740), (2352, 1780), (2380, 1810), (2390, 1850), (2410, 1880), (2440, 1900), (2450, 1950), (2480, 1980), (2490, 2020), (2520, 2050)], (5, 4)),
    ("braavosi-west-headwater", [(2220, 1535), (2220, 1510), (2230, 1498), (2240, 1490)], (2, 3)),
    ("braavosi-west-headwater-twig", [(2248, 1535), (2238, 1510), (2230, 1498)], (1, 2)),
    (
        "braavosi-east-fork",
        [(2310, 1602), (2303, 1595), (2298, 1587), (2302, 1578), (2300, 1570)],
        (2, 3),
    ),
    ("braavosi-southwest-fork", [(2250, 1850), (2260, 1880), (2310, 1900), (2360, 1900), (2410, 1880)], (2, 3)),
    ("noyne-main", [(2550, 1750), (2545, 1790), (2560, 1830), (2560, 1880), (2580, 1930), (2575, 1980), (2600, 2030), (2585, 2080), (2616, 2168)], (2, 5)),
    ("noyne-west-fork", [(2470, 1845), (2480, 1880), (2490, 1930), (2520, 1970), (2550, 2010), (2570, 2070), (2585, 2080)], (2, 4)),
    ("qoyne-west-headwater", [(2775, 1745), (2780, 1775), (2810, 1802)], (2, 3)),
    ("qoyne-east-headwater", [(2850, 1735), (2845, 1765), (2810, 1802)], (2, 3)),
    ("qoyne-main", [(2810, 1802), (2800, 1840), (2820, 1880), (2825, 1925), (2800, 1960), (2810, 2010), (2785, 2070), (2760, 2130), (2730, 2190), (2700, 2250)], (3, 6)),
    ("qoyne-eastern-lake-outlet", [(2980, 1900), (2970, 1935), (2950, 1960), (2920, 1975), (2880, 1985), (2840, 2000), (2810, 2010)], (2, 4)),
    ("upper-rhoyne", [(2616, 2168), (2645, 2195), (2670, 2220), (2700, 2250), (2700, 2280)], (5, 7)),
    ("rhoyne-middle", [(2702, 2335), (2695, 2380), (2698, 2430), (2688, 2480), (2690, 2530), (2705, 2580), (2740, 2630)], (6, 8)),
    ("golden-fields-west", [(2495, 2285), (2500, 2320), (2530, 2350), (2540, 2390), (2580, 2415), (2630, 2425), (2665, 2450), (2698, 2430)], (2, 4)),
    ("golden-fields-west-northwest", [(2478, 2250), (2485, 2270), (2495, 2285)], (1, 2)),
    ("golden-fields-west-north", [(2515, 2225), (2520, 2260), (2495, 2285)], (1, 2)),
    ("golden-fields-west-northeast", [(2550, 2250), (2530, 2270), (2495, 2285)], (1, 2)),
    ("golden-fields-east", [(2940, 2490), (2910, 2520), (2870, 2530), (2830, 2560), (2790, 2600), (2740, 2630)], (3, 5)),
    ("golden-fields-east-north", [(2945, 2355), (2925, 2390), (2930, 2440), (2940, 2490)], (1, 3)),
    ("golden-fields-east-northeast", [(3025, 2380), (2990, 2410), (2970, 2460), (2940, 2490)], (1, 3)),
    ("golden-fields-east-east", [(3090, 2450), (3050, 2460), (3000, 2480), (2940, 2490)], (1, 3)),
    ("golden-fields-east-southeast", [(3060, 2520), (3020, 2520), (2990, 2500), (2940, 2490)], (1, 3)),
    ("rhoyne-lower", [(2740, 2630), (2720, 2665), (2740, 2700), (2730, 2730), (2750, 2760), (2760, 2800), (2780, 2830), (2800, 2855)], (8, 9)),
    ("eastern-lower-tributary", [(2960, 2640), (2950, 2680), (2960, 2720), (2935, 2760), (2900, 2800), (2860, 2825), (2830, 2845), (2800, 2855)], (2, 5)),
    (
        "eastern-lower-north-fork",
        [(3000, 2650), (2988, 2660), (2980, 2672), (2968, 2675), (2960, 2680)],
        (1, 2),
    ),
    (
        "eastern-lower-east-fork",
        [(3010, 2720), (2998, 2716), (2985, 2724), (2972, 2718), (2960, 2720)],
        (1, 2),
    ),
    ("rhoyne-delta-west", [(2800, 2855), (2785, 2880), (2780, 2910), (2768, 2945), (2757, 2965), (2753, 2975)], (6, 5)),
    ("rhoyne-delta-centre", [(2800, 2855), (2805, 2885), (2815, 2915), (2825, 2942), (2821, 2945), (2825, 2955)], (6, 5)),
    ("rhoyne-delta-east", [(2800, 2855), (2830, 2865), (2855, 2880), (2870, 2905)], (6, 5)),
    ("central-outer-northwest-delta", [(3435, 1455), (3440, 1472), (3460, 1500), (3480, 1525), (3508, 1555), (3535, 1585)], (4, 2)),
    ("central-northwest-delta", [(3475, 1455), (3480, 1475), (3490, 1500), (3500, 1525), (3515, 1548), (3535, 1585)], (5, 3)),
    ("central-north-delta", [(3532, 1450), (3528, 1475), (3540, 1495), (3528, 1520), (3535, 1550), (3535, 1585)], (5, 3)),
    ("central-northeast-delta", [(3598, 1455), (3585, 1475), (3570, 1490), (3565, 1510), (3550, 1535), (3535, 1585)], (5, 3)),
    ("central-outer-northeast-delta", [(3620, 1460), (3610, 1478), (3595, 1498), (3585, 1520), (3560, 1550), (3535, 1585)], (4, 2)),
    ("central-headwater-trunk", [(3535, 1585), (3525, 1625), (3520, 1660), (3505, 1690), (3490, 1710)], (4, 5)),
    ("central-east-headwater", [(3615, 1755), (3580, 1755), (3560, 1738), (3535, 1720), (3490, 1710)], (2, 4)),
    ("central-west-upper", [(3275, 1855), (3310, 1840), (3340, 1815), (3370, 1800), (3400, 1780), (3435, 1760), (3460, 1740), (3490, 1710)], (2, 4)),
    ("central-middle", [(3490, 1710), (3475, 1750), (3435, 1775), (3410, 1805), (3370, 1820), (3350, 1850), (3365, 1880), (3355, 1905), (3390, 1930), (3440, 1940), (3460, 1980), (3490, 2010)], (4, 6)),
    ("central-west-rill", [(3265, 1895), (3300, 1885), (3330, 1880), (3365, 1880)], (1, 3)),
    (
        "central-south-trunk",
        [
            (3490, 2010),
            (3500, 2040),
            (3530, 2045),
            (3550, 2050),
            (3575, 2045),
            (3600, 2050),
            (3630, 2063),
            (3660, 2070),
            (3695, 2064),
            (3730, 2070),
            (3765, 2065),
            (3800, 2070),
            (3830, 2060),
            (3860, 2050),
        ],
        (5, 6),
    ),
    ("central-southwest-twig", [(3420, 2055), (3460, 2040), (3490, 2010)], (1, 3)),
    ("central-south-twig", [(3600, 2140), (3590, 2100), (3600, 2050)], (1, 3)),
    ("central-lake-middle-outlet", [(4135, 1930), (4132, 1960), (4150, 2010)], (2, 3)),
    ("central-lake-east-outlet", [(4235, 1970), (4235, 2000), (4200, 2020), (4150, 2010)], (2, 3)),
    ("central-lower-east-trunk", [(4150, 2010), (4110, 2040), (4070, 2050), (4040, 2075), (4000, 2090), (3950, 2090), (3900, 2070), (3860, 2050)], (3, 6)),
    ("skahazadhan-main", [(4555, 2460), (4510, 2460), (4490, 2480), (4450, 2490), (4420, 2520), (4380, 2530), (4350, 2550), (4320, 2550), (4290, 2560), (4250, 2550), (4210, 2550), (4180, 2545), (4150, 2550), (4125, 2560), (4108, 2570), (4096, 2578), (4088, 2580)], (2, 7)),
    ("skahazadhan-north-fork", [(4420, 2400), (4420, 2450), (4400, 2490), (4380, 2530)], (2, 3)),
    ("skahazadhan-south-system", [(4180, 2850), (4200, 2810), (4210, 2760), (4240, 2720), (4240, 2660), (4210, 2620), (4180, 2545)], (2, 4)),
    ("skahazadhan-southwest-fork", [(4140, 2860), (4160, 2830), (4180, 2850)], (1, 2)),
    ("skahazadhan-southeast-fork", [(4250, 2850), (4230, 2820), (4180, 2850)], (1, 2)),
]
SECONDARY_RIVER_CORRIDORS = []

RIVER_MOUTH_ENDPOINTS = {
    "last-river": "end",
    "weeping-water": "end",
    "broken-branch": "end",
    "white-knife-main": "end",
    "stony-shore-rill": "end",
    "torrhens-square-drain": "end",
    "barrowton-river": "end",
    "neck-fjord-river": "end",
    "trident-main": "end",
    "vale-upper-river": "end",
    "vale-lower-river": "end",
    "blackwater-lower": "end",
    "mander-lower": "end",
    "honeywine": "end",
    "rainwood-north-river": "end",
    "slayne": "end",
    "torrentine": "end",
    "brimstone": "end",
    "greenblood-lower": "end",
    "braavosi-main": "start",
    "rhoyne-delta-west": "end",
    "rhoyne-delta-centre": "end",
    "rhoyne-delta-east": "end",
    "central-outer-northwest-delta": "start",
    "central-northwest-delta": "start",
    "central-north-delta": "start",
    "central-northeast-delta": "start",
    "central-outer-northeast-delta": "start",
    "skahazadhan-main": "end",
}

RIVER_SHARED_JUNCTIONS = {
    (1260, 720): {
        "white-knife-long-lake-outlet",
        "white-knife-main",
    },
    (1260, 875): {
        "white-knife-main",
        "white-knife-cerwyn-fork",
    },
    (1314, 1718): {
        "green-fork",
        "blue-fork",
        "red-fork-lower",
        "trident-main",
    },
    (1385, 2045): {
        "gods-eye-outlet",
        "blackwater-west",
        "blackwater-lower",
    },
    (912, 2457): {
        "mander-northwest",
        "mander-northeast",
        "mander-lower",
    },
    (1570, 2842): {
        "scourge",
        "vaith-greenblood-upper",
        "greenblood-lower",
    },
    (2616, 2168): {
        "noyne-main",
        "upper-rhoyne",
    },
    (2740, 2630): {
        "rhoyne-middle",
        "golden-fields-east",
        "rhoyne-lower",
    },
    (2800, 2855): {
        "rhoyne-lower",
        "eastern-lower-tributary",
        "rhoyne-delta-west",
        "rhoyne-delta-centre",
        "rhoyne-delta-east",
    },
    (3490, 1710): {
        "central-headwater-trunk",
        "central-east-headwater",
        "central-west-upper",
        "central-middle",
    },
    (3535, 1585): {
        "central-outer-northwest-delta",
        "central-northwest-delta",
        "central-north-delta",
        "central-northeast-delta",
        "central-outer-northeast-delta",
        "central-headwater-trunk",
    },
    (3490, 2010): {
        "central-middle",
        "central-south-trunk",
        "central-southwest-twig",
    },
    (3860, 2050): {
        "central-south-trunk",
        "central-lower-east-trunk",
    },
    (4150, 2010): {
        "central-lake-middle-outlet",
        "central-lake-east-outlet",
        "central-lower-east-trunk",
    },
    (4380, 2530): {
        "skahazadhan-main",
        "skahazadhan-north-fork",
    },
    (4180, 2545): {
        "skahazadhan-main",
        "skahazadhan-south-system",
    },
}

ROAD_ROUTES = [
    ("kingsroad", [(1424, 258), (1417, 320), (1415, 380), (1400, 420), (1360, 450), (1315, 480), (1275, 515), (1235, 550), (1215, 590), (1207, 645), (1207, 745), (1215, 810), (1200, 860), (1202, 874), (1210, 950), (1220, 1040), (1228, 1120), (1225, 1220), (1230, 1320), (1240, 1420), (1245, 1500), (1270, 1580), (1320, 1660), (1385, 1755), (1395, 1820), (1410, 1900), (1435, 1980), (1472, 2049)], "royal"),
    (
        "high-road",
        [
            (1385, 1755),
            (1400, 1744),
            (1415, 1735),
            (1430, 1728),
            (1443, 1718),
            (1450, 1710),
            (1465, 1698),
            (1480, 1680),
            (1490, 1668),
            (1503, 1645),
            (1514, 1627),
            (1528, 1620),
            (1545, 1608),
            (1560, 1602),
            (1573, 1595),
            (1587, 1593),
        ],
        "major",
    ),
    (
        "river-road-east",
        [
            (1088, 1765),
            (1120, 1758),
            (1150, 1767),
            (1180, 1760),
            (1210, 1772),
            (1240, 1764),
            (1270, 1774),
            (1300, 1766),
            (1330, 1762),
            (1360, 1758),
            (1385, 1755),
        ],
        "major",
    ),
    (
        "river-road-west",
        [
            (1088, 1765),
            (1065, 1775),
            (1040, 1790),
            (1022, 1807),
            (1000, 1825),
            (982, 1837),
            (965, 1850),
            (948, 1858),
            (925, 1863),
            (900, 1875),
            (875, 1882),
            (850, 1900),
            (825, 1910),
            (800, 1930),
            (770, 1945),
            (740, 1956),
        ],
        "major",
    ),
    (
        "goldroad",
        [
            (740, 1956),
            (775, 1962),
            (800, 1970),
            (830, 1968),
            (860, 1980),
            (890, 1990),
            (920, 1988),
            (947, 1994),
            (975, 1999),
            (1005, 2010),
            (1040, 2015),
            (1080, 2028),
            (1120, 2035),
            (1160, 2048),
            (1200, 2045),
            (1240, 2052),
            (1280, 2045),
            (1315, 2038),
            (1350, 2030),
            (1380, 2035),
            (1415, 2025),
            (1445, 2036),
            (1472, 2049),
        ],
        "royal",
    ),
    ("highgarden-kingslanding-roseroad", [(912, 2457), (935, 2410), (970, 2370), (1010, 2335), (1060, 2310), (1100, 2290), (1142, 2278), (1190, 2260), (1240, 2245), (1300, 2220), (1360, 2180), (1410, 2145), (1430, 2110), (1438, 2080), (1445, 2065), (1472, 2049)], "royal"),
    ("casterly-highgarden-searoad", [(740, 1956), (730, 1980), (735, 2000), (720, 2025), (705, 2050), (695, 2100), (680, 2150), (690, 2186), (700, 2225), (700, 2260), (705, 2307), (740, 2330), (785, 2350), (820, 2380), (850, 2410), (885, 2440), (912, 2457)], "major"),
    ("oldtown-highgarden", [(720, 2668), (745, 2655), (775, 2645), (805, 2625), (825, 2595), (850, 2560), (875, 2525), (900, 2490), (912, 2457)], "major"),
    ("storm-road", [(1472, 2049), (1450, 2080), (1445, 2110), (1460, 2150), (1500, 2180), (1550, 2200), (1600, 2250), (1630, 2301), (1654, 2358)], "major"),
    ("summerhall-road", [(1654, 2358), (1620, 2340), (1580, 2335), (1540, 2345), (1500, 2360), (1440, 2383)], "minor"),
    ("boneway", [(1440, 2383), (1390, 2415), (1340, 2445), (1300, 2475), (1275, 2500), (1290, 2530), (1320, 2560), (1325, 2590), (1290, 2610), (1260, 2635), (1245, 2660), (1260, 2685), (1290, 2705), (1328, 2719)], "minor"),
    ("princes-pass", [(1115, 2582), (1105, 2610), (1090, 2635), (1110, 2660), (1135, 2680), (1150, 2700), (1163, 2718)], "minor"),
]

WALL_ROUTE = [
    (1286, 242),
    (1335, 240),
    (1385, 243),
    (1424, 244),
    (1490, 246),
    (1546, 247),
]


def chaikin_curve(
    points: Sequence[tuple[int, int]],
    iterations: int = 3,
) -> list[tuple[int, int]]:
    """Create an independently drawn smooth curve from authored control points."""
    current = [(float(x), float(y)) for x, y in points]
    for _ in range(iterations):
        refined: list[tuple[float, float]] = [current[0]]
        for first, second in zip(current, current[1:]):
            refined.append(
                (
                    first[0] * 0.75 + second[0] * 0.25,
                    first[1] * 0.75 + second[1] * 0.25,
                )
            )
            refined.append(
                (
                    first[0] * 0.25 + second[0] * 0.75,
                    first[1] * 0.25 + second[1] * 0.75,
                )
            )
        refined.append(current[-1])
        current = refined
    return [(round(x), round(y)) for x, y in current]


def catmull_rom_curve(
    points: Sequence[tuple[int, int]],
    spacing: float = 8.0,
) -> list[tuple[int, int]]:
    """
    Smooth a route with a centripetal Catmull-Rom spline.

    Centripetal timing passes through every authored junction while avoiding
    the loops and corner overshoot of the uniform variant at tight river bends
    and near coastlines.
    """
    if len(points) < 3:
        return list(points)

    def distance_parameter(
        first: tuple[float, float],
        second: tuple[float, float],
        previous: float,
    ) -> float:
        distance = math.hypot(second[0] - first[0], second[1] - first[1])
        return previous + max(1e-4, math.sqrt(distance))

    def blend(
        first: tuple[float, float],
        second: tuple[float, float],
        first_t: float,
        second_t: float,
        target_t: float,
    ) -> tuple[float, float]:
        denominator = max(1e-8, second_t - first_t)
        first_weight = (second_t - target_t) / denominator
        second_weight = (target_t - first_t) / denominator
        return (
            first[0] * first_weight + second[0] * second_weight,
            first[1] * first_weight + second[1] * second_weight,
        )

    result: list[tuple[int, int]] = []
    for index in range(len(points) - 1):
        p1 = (float(points[index][0]), float(points[index][1]))
        p2 = (float(points[index + 1][0]), float(points[index + 1][1]))
        if index:
            p0 = (float(points[index - 1][0]), float(points[index - 1][1]))
        else:
            p0 = (2.0 * p1[0] - p2[0], 2.0 * p1[1] - p2[1])
        if index + 2 < len(points):
            p3 = (float(points[index + 2][0]), float(points[index + 2][1]))
        else:
            p3 = (2.0 * p2[0] - p1[0], 2.0 * p2[1] - p1[1])
        t0 = 0.0
        t1 = distance_parameter(p0, p1, t0)
        t2 = distance_parameter(p1, p2, t1)
        t3 = distance_parameter(p2, p3, t2)
        segment_length = math.hypot(p2[0] - p1[0], p2[1] - p1[1])
        steps = max(2, math.ceil(segment_length / spacing))
        for step in range(steps):
            target_t = t1 + (t2 - t1) * step / steps
            a1 = blend(p0, p1, t0, t1, target_t)
            a2 = blend(p1, p2, t1, t2, target_t)
            a3 = blend(p2, p3, t2, t3, target_t)
            b1 = blend(a1, a2, t0, t2, target_t)
            b2 = blend(a2, a3, t1, t3, target_t)
            position = blend(b1, b2, t1, t2, target_t)
            point = (round(position[0]), round(position[1]))
            if not result or point != result[-1]:
                result.append(point)
    if result[-1] != points[-1]:
        result.append(points[-1])
    return result


def meander_curve(
    points: Sequence[tuple[int, int]],
    name: str,
    amplitude_range: tuple[float, float] = (5.0, 9.0),
    wavelength_range: tuple[float, float] = (58.0, 105.0),
    pin_fade_distance: float = 14.0,
) -> list[tuple[int, int]]:
    """
    Add deterministic bends while pinning every surveyed control point.

    The original atlas uses irregular hand-drawn courses, but castles,
    junctions, lakes, passes, and mouths must stay registered.  A Catmull-Rom
    base passes through every authored point; the lateral wobble fades to zero
    at the nearest sample for each of those points.
    """
    smooth = catmull_rom_curve(points, spacing=3.0)
    if len(smooth) < 3:
        return smooth
    dense = [(float(x), float(y)) for x, y in smooth]
    cumulative = [0.0]
    for first, second in zip(dense, dense[1:]):
        cumulative.append(
            cumulative[-1]
            + math.hypot(second[0] - first[0], second[1] - first[1])
        )
    distance_total = cumulative[-1]
    pin_distances: list[float] = []
    for authored_x, authored_y in points:
        nearest_index = min(
            range(len(dense)),
            key=lambda index: (
                (dense[index][0] - authored_x) ** 2
                + (dense[index][1] - authored_y) ** 2
            ),
        )
        pin_distances.append(cumulative[nearest_index])
    token = int.from_bytes(hashlib.sha256(name.encode("utf-8")).digest()[:8], "big")
    amplitude_low, amplitude_high = amplitude_range
    wavelength_low, wavelength_high = wavelength_range
    amplitude = amplitude_low + (
        (amplitude_high - amplitude_low) * (token % 1000) / 999.0
    )
    amplitude = min(amplitude, max(1.5, distance_total / 22.0))
    wavelength = wavelength_low + (
        (wavelength_high - wavelength_low)
        * ((token >> 10) % 1000)
        / 999.0
    )
    phase = ((token >> 16) % 6283) / 1000.0
    result: list[tuple[int, int]] = []
    for index, ((x, y), distance) in enumerate(zip(dense, cumulative)):
        before = dense[max(0, index - 1)]
        after = dense[min(len(dense) - 1, index + 1)]
        tangent_x = after[0] - before[0]
        tangent_y = after[1] - before[1]
        tangent_length = max(1e-6, math.hypot(tangent_x, tangent_y))
        normal_x = -tangent_y / tangent_length
        normal_y = tangent_x / tangent_length
        pin_envelope = min(
            1.0,
            min(abs(distance - pin) for pin in pin_distances)
            / max(1.0, pin_fade_distance),
        )
        lateral = amplitude * pin_envelope * (
            math.sin(distance * math.tau / wavelength + phase)
            + 0.32
            * math.sin(
                distance * math.tau / (wavelength * 0.43)
                + phase * 1.71
            )
        )
        point = (
            round(x + normal_x * lateral),
            round(y + normal_y * lateral),
        )
        if not result or point != result[-1]:
            result.append(point)
    result[0] = points[0]
    result[-1] = points[-1]
    return result


MEANDERING_RIVER_PREFIXES = (
    "braavosi-",
    "noyne-",
    "qoyne-",
    "upper-rhoyne",
    "rhoyne-",
    "golden-fields-",
    "eastern-lower-",
    "central-",
    "skahazadhan-",
)


def river_render_curve(
    name: str,
    points: Sequence[tuple[int, int]],
) -> list[tuple[int, int]]:
    """
    Select the independently drawn curve language for each watershed.

    The broad Essosi systems use deterministic low-amplitude meanders so their
    many arms do not read as mechanical splines. Tighter Westerosi courses use
    the surveyed Catmull-Rom line, preserving passes, castles, bridges, coves,
    and the exact endpoints supplied by the source comparison.
    """
    if name == "upper-rhoyne":
        return chaikin_curve(points, iterations=3)
    if name in {
        "vale-lower-river",
        "vale-upper-river",
        "vultures-roost-rill",
        "weeping-water",
    }:
        # These surveyed corridors run immediately beside coastal or lake
        # edges. Their authored control points already supply the bends; an
        # extra lateral wobble would make the channel briefly leave and
        # re-enter land.
        return catmull_rom_curve(points, spacing=4.0)
    if name.startswith(("white-knife-", "long-lake-")):
        return meander_curve(
            points,
            name,
            amplitude_range=(2.0, 4.0),
            wavelength_range=(52.0, 82.0),
            pin_fade_distance=12.0,
        )
    if name.startswith(MEANDERING_RIVER_PREFIXES):
        return meander_curve(
            points,
            name,
            amplitude_range=(10.0, 18.0),
            wavelength_range=(72.0, 132.0),
            pin_fade_distance=18.0,
        )
    return meander_curve(
        points,
        name,
        amplitude_range=(4.0, 8.0),
        wavelength_range=(52.0, 96.0),
        pin_fade_distance=14.0,
    )


def dense_polyline(points: Sequence[tuple[int, int]]) -> list[tuple[int, int]]:
    """Raster-order samples at no more than one pixel of separation."""
    dense: list[tuple[int, int]] = []
    for first, second in zip(points, points[1:]):
        dx = second[0] - first[0]
        dy = second[1] - first[1]
        steps = max(1, abs(dx), abs(dy))
        for step in range(steps):
            point = (
                round(first[0] + dx * step / steps),
                round(first[1] + dy * step / steps),
            )
            if not dense or point != dense[-1]:
                dense.append(point)
    if points and (not dense or dense[-1] != points[-1]):
        dense.append(points[-1])
    return dense


def path_land_audit(
    points: Sequence[tuple[int, int]],
    land: np.ndarray,
) -> dict:
    """
    Report water runs along a path centerline.

    A run touching either endpoint is a legitimate coastal terminus. Any
    interior water run means a route leaves land and later reappears, which is
    exactly the clipping artifact this pass is designed to prevent.
    """
    samples = dense_polyline(points)
    on_land = [
        bool(0 <= x < CANVAS[0] and 0 <= y < CANVAS[1] and land[y, x])
        for x, y in samples
    ]
    water_runs: list[tuple[int, int]] = []
    run_start: int | None = None
    for index, is_land in enumerate(on_land):
        if not is_land and run_start is None:
            run_start = index
        elif is_land and run_start is not None:
            water_runs.append((run_start, index - 1))
            run_start = None
    if run_start is not None:
        water_runs.append((run_start, len(on_land) - 1))
    internal = [
        (start, end)
        for start, end in water_runs
        if start > 0 and end < len(on_land) - 1
    ]
    transitions = sum(
        first != second for first, second in zip(on_land, on_land[1:])
    )
    return {
        "samples": len(samples),
        "water_runs": [[start, end] for start, end in water_runs],
        "internal_water_runs": [[start, end] for start, end in internal],
        "internal_water_samples": sum(end - start + 1 for start, end in internal),
        "land_water_transitions": transitions,
    }


def width_profile(
    profile: int | Sequence[int],
) -> tuple[int, int]:
    if isinstance(profile, int):
        return max(1, profile - 2), max(1, profile)
    values = list(profile)
    if len(values) != 2:
        raise ValueError(f"River width profile must have two values, got {profile!r}")
    return max(1, int(values[0])), max(1, int(values[1]))


def draw_variable_width_line(
    draw: ImageDraw.ImageDraw,
    points: Sequence[tuple[int, int]],
    start_width: int,
    end_width: int,
) -> None:
    """Draw a continuous line that broadens or narrows along its course."""
    if len(points) < 2:
        return
    distances = [0.0]
    for first, second in zip(points, points[1:]):
        distances.append(
            distances[-1] + math.hypot(second[0] - first[0], second[1] - first[1])
        )
    total = max(1.0, distances[-1])
    for index, (first, second) in enumerate(zip(points, points[1:])):
        progress = (distances[index] + distances[index + 1]) / (2.0 * total)
        width = max(1, round(start_width + (end_width - start_width) * progress))
        draw.line((first, second), fill=255, width=width)
        radius = max(0, (width - 1) // 2)
        if radius:
            draw.ellipse(
                (
                    first[0] - radius,
                    first[1] - radius,
                    first[0] + radius,
                    first[1] + radius,
                ),
                fill=255,
            )
    final_radius = max(0, (end_width - 1) // 2)
    if final_radius:
        final = points[-1]
        draw.ellipse(
            (
                final[0] - final_radius,
                final[1] - final_radius,
                final[0] + final_radius,
                final[1] + final_radius,
            ),
            fill=255,
        )


def draw_major_rivers(
    canvas: Image.Image,
    land_mask: Image.Image,
    water_material: Image.Image,
) -> dict:
    """
    Draw new river artwork from independently authored coordinate paths.

    The control points preserve approximate geographic registration, but no
    river pixels or source-raster linework are reused.
    """
    cores = Image.new("L", CANVAS, 0)
    core_draw = ImageDraw.Draw(cores)
    widths: dict[str, list[int]] = {}
    course_qa: list[dict] = []
    land_array = np.asarray(land_mask, dtype=np.uint8) >= 128
    all_corridors = RIVER_CORRIDORS
    authored_points = {
        name: set(points) for name, points, _profile in all_corridors
    }
    topology_failures: list[str] = []
    for junction, names in RIVER_SHARED_JUNCTIONS.items():
        missing = sorted(
            name
            for name in names
            if junction not in authored_points.get(name, set())
        )
        if missing:
            topology_failures.append(
                f"{junction} missing from {', '.join(missing)}"
            )
    if topology_failures:
        raise AssertionError(
            "River shared-junction topology changed: "
            + "; ".join(topology_failures)
        )

    mouth_failures: list[str] = []
    internal_water_failures: list[str] = []
    for name, points, corridor_profile in all_corridors:
        curve = river_render_curve(name, points)
        rendered_length = sum(
            math.hypot(second[0] - first[0], second[1] - first[1])
            for first, second in zip(curve, curve[1:])
        )
        direct_distance = math.hypot(
            curve[-1][0] - curve[0][0],
            curve[-1][1] - curve[0][1],
        )
        max_control_segment = max(
            math.hypot(second[0] - first[0], second[1] - first[1])
            for first, second in zip(points, points[1:])
        )
        start_width, end_width = width_profile(corridor_profile)
        widths[name] = [start_width, end_width]
        draw_variable_width_line(
            core_draw,
            curve,
            start_width,
            end_width,
        )
        audit = path_land_audit(curve, land_array)
        if audit["internal_water_runs"]:
            internal_water_failures.append(
                f"{name} {audit['internal_water_runs']}"
            )
        mouth_side = RIVER_MOUTH_ENDPOINTS.get(name)
        mouth_point = (
            curve[0]
            if mouth_side == "start"
            else curve[-1]
            if mouth_side == "end"
            else None
        )
        mouth_in_water = (
            mouth_point is not None
            and not bool(land_array[mouth_point[1], mouth_point[0]])
        )
        if mouth_side and not mouth_in_water:
            mouth_failures.append(
                f"{name} {mouth_side} {mouth_point} is not in water"
            )
        course_qa.append(
            {
                "name": name,
                "mouth_side": mouth_side,
                "mouth_point": list(mouth_point) if mouth_point else None,
                "mouth_in_water": mouth_in_water if mouth_side else None,
                "rendered_length": round(rendered_length, 3),
                "direct_distance": round(direct_distance, 3),
                "tortuosity": round(
                    rendered_length / max(1.0, direct_distance),
                    5,
                ),
                "max_control_segment": round(max_control_segment, 3),
                **audit,
            }
        )

    if mouth_failures:
        raise AssertionError(
            "River mouths do not overlap their receiving water: "
            + "; ".join(mouth_failures)
        )
    if internal_water_failures:
        raise AssertionError(
            "River geometry leaves land and re-enters it: "
            + "; ".join(internal_water_failures)
        )

    # The antialias pass is applied first, then every solid channel pixel is
    # replaced again from the canonical color-normalized water plate. This keeps
    # the edge soft without darkening or diluting the center: a solid river
    # pixel is byte-identical to the sea/lake material at that coordinate.
    antialiased_cores = cores.filter(ImageFilter.GaussianBlur(0.55))
    canvas.paste(water_material, (0, 0), antialiased_cores)
    canvas.paste(water_material, (0, 0), cores)
    antialiased_cores.close()
    nonzero_pixels = sum(cores.histogram()[1:])
    cores.close()
    return {
        "paths": len(all_corridors),
        "primary_paths": len(RIVER_CORRIDORS),
        "secondary_paths": 0,
        "control_points": sum(
            len(points) for _name, points, _width in all_corridors
        ),
        "path_widths": widths,
        "rendered_nonzero_pixels": nonzero_pixels,
        "course_audit": course_qa,
        "mouth_endpoints": dict(sorted(RIVER_MOUTH_ENDPOINTS.items())),
        "shared_junctions": {
            f"{x},{y}": sorted(names)
            for (x, y), names in sorted(RIVER_SHARED_JUNCTIONS.items())
        },
        "method": (
            "independently authored variable-width channels filled from the "
            "same canonical color-normalized water raster as sea and lakes; solid "
            "cores are re-pasted after edge antialiasing so their RGB remains "
            "exact; no source-raster river paint reused"
        ),
    }


def draw_roads(canvas: Image.Image, land_mask: Image.Image) -> dict:
    """Draw the principal Westerosi road network as restrained double strokes."""
    shadows = Image.new("L", CANVAS, 0)
    centers = Image.new("L", CANVAS, 0)
    shadow_draw = ImageDraw.Draw(shadows)
    center_draw = ImageDraw.Draw(centers)
    widths = {
        "royal": (6, 3),
        "major": (5, 2),
        "minor": (4, 2),
    }
    route_qa: list[dict] = []
    invalid_routes: list[tuple[str, list[list[int]]]] = []
    land_array = np.asarray(land_mask, dtype=np.uint8) >= 128
    for name, points, tier in ROAD_ROUTES:
        curve = meander_curve(
            points,
            f"road:{name}",
            amplitude_range=(3.0, 6.0),
            wavelength_range=(70.0, 125.0),
            pin_fade_distance=16.0,
        )
        rendered_length = sum(
            math.hypot(second[0] - first[0], second[1] - first[1])
            for first, second in zip(curve, curve[1:])
        )
        direct_distance = math.hypot(
            curve[-1][0] - curve[0][0],
            curve[-1][1] - curve[0][1],
        )
        max_control_segment = max(
            math.hypot(second[0] - first[0], second[1] - first[1])
            for first, second in zip(points, points[1:])
        )
        audit = path_land_audit(curve, land_array)
        if audit["internal_water_runs"]:
            invalid_routes.append((name, audit["internal_water_runs"]))
        outer_width, center_width = widths[tier]
        left = max(0, min(point[0] for point in curve) - outer_width - 2)
        top = max(0, min(point[1] for point in curve) - outer_width - 2)
        right = min(
            CANVAS[0],
            max(point[0] for point in curve) + outer_width + 3,
        )
        bottom = min(
            CANVAS[1],
            max(point[1] for point in curve) + outer_width + 3,
        )
        route_patch = Image.new("L", (right - left, bottom - top), 0)
        patch_draw = ImageDraw.Draw(route_patch)
        patch_draw.line(
            [(x - left, y - top) for x, y in curve],
            fill=255,
            width=outer_width,
            joint="curve",
        )
        land_patch = land_mask.crop((left, top, right, bottom))
        water_patch = ImageOps.invert(land_patch)
        land_patch.close()
        outside_patch = ImageChops.multiply(route_patch, water_patch)
        route_patch.close()
        water_patch.close()
        outer_water_pixels = sum(outside_patch.histogram()[1:])
        outside_patch.close()
        if outer_water_pixels:
            invalid_routes.append((name, [[-1, outer_water_pixels]]))
        shadow_draw.line(curve, fill=150, width=outer_width, joint="curve")
        center_draw.line(curve, fill=205, width=center_width, joint="curve")
        route_qa.append(
            {
                "name": name,
                "tier": tier,
                "control_points": len(points),
                "authored_points": [list(point) for point in points],
                "start": list(points[0]),
                "end": list(points[-1]),
                "outer_width": outer_width,
                "center_width": center_width,
                "outer_stroke_water_pixels": outer_water_pixels,
                "rendered_length": round(rendered_length, 3),
                "direct_distance": round(direct_distance, 3),
                "tortuosity": round(
                    rendered_length / max(1.0, direct_distance),
                    5,
                ),
                "max_control_segment": round(max_control_segment, 3),
                **audit,
            }
        )

    if invalid_routes:
        detail = "; ".join(
            f"{name}: {runs}" for name, runs in invalid_routes
        )
        raise AssertionError(
            "Road geometry crosses water (centerline run or outer-stroke pixels): "
            f"{detail}"
        )

    clipped_shadows = ImageChops.multiply(shadows, land_mask)
    clipped_centers = ImageChops.multiply(centers, land_mask)
    shadows.close()
    centers.close()
    canvas.paste(PALETTE["road_shadow"], (0, 0, *CANVAS), clipped_shadows)
    canvas.paste(PALETTE["road"], (0, 0, *CANVAS), clipped_centers)
    nonzero_pixels = sum(clipped_centers.histogram()[1:])
    clipped_shadows.close()
    clipped_centers.close()
    return {
        "routes": len(ROAD_ROUTES),
        "rendered_nonzero_pixels": nonzero_pixels,
        "route_details": route_qa,
        "method": (
            "independently authored, control-point-pinned winding survey "
            "double strokes with continuous centerline and full outer-stroke "
            "land validation"
        ),
    }


def sample_polyline(
    points: Sequence[tuple[int, int]],
    spacing: float,
) -> list[tuple[float, float, float, float]]:
    """Return regularly spaced points and normalized tangents along a path."""
    samples: list[tuple[float, float, float, float]] = []
    carried = 0.0
    for first, second in zip(points, points[1:]):
        dx = float(second[0] - first[0])
        dy = float(second[1] - first[1])
        length = math.hypot(dx, dy)
        if length <= 0.0:
            continue
        tx = dx / length
        ty = dy / length
        distance = spacing - carried if carried else 0.0
        while distance <= length:
            samples.append(
                (
                    first[0] + tx * distance,
                    first[1] + ty * distance,
                    tx,
                    ty,
                )
            )
            distance += spacing
        carried = max(0.0, length - (distance - spacing))
        if carried >= spacing:
            carried %= spacing
    return samples


def draw_the_wall(canvas: Image.Image, land_mask: Image.Image) -> dict:
    """Render a smooth, icon-free Wall from Shadow Tower to Eastwatch."""
    curve = chaikin_curve(WALL_ROUTE, iterations=3)
    padding = 32
    left = max(0, min(x for x, _y in curve) - padding)
    top = max(0, min(y for _x, y in curve) - padding)
    right = min(CANVAS[0], max(x for x, _y in curve) + padding + 1)
    bottom = min(CANVAS[1], max(y for _x, y in curve) + padding + 1)
    scale = 4
    patch_size = ((right - left) * scale, (bottom - top) * scale)
    local_curve = [
        ((x - left) * scale, (y - top) * scale)
        for x, y in curve
    ]

    def supersampled_line(
        points: Sequence[tuple[int, int]],
        width: int,
        offset_y: int = 0,
    ) -> Image.Image:
        layer = Image.new("L", patch_size, 0)
        draw = ImageDraw.Draw(layer)
        shifted = [(x, y + offset_y * scale) for x, y in points]
        draw.line(
            shifted,
            fill=255,
            width=width * scale,
            joint="curve",
        )
        radius = width * scale // 2
        for x, y in (shifted[0], shifted[-1]):
            draw.ellipse(
                (x - radius, y - radius, x + radius, y + radius),
                fill=255,
            )
        downsampled = layer.resize(
            (right - left, bottom - top),
            Image.Resampling.LANCZOS,
        )
        layer.close()
        return downsampled

    shadow = supersampled_line(local_curve, width=14, offset_y=3)
    ice = supersampled_line(local_curve, width=10)
    crest = supersampled_line(local_curve, width=2, offset_y=-2)

    clip = land_mask.crop((left, top, right, bottom))
    clip = clip.filter(ImageFilter.GaussianBlur(0.35))
    layers = [
        (shadow, PALETTE["wall_shadow"]),
        (ice, PALETTE["wall_ice"]),
        (crest, PALETTE["wall_highlight"]),
    ]
    rendered_pixels = 0
    for layer, color in layers:
        clipped = ImageChops.multiply(layer, clip)
        canvas.paste(color, (left, top, right, bottom), clipped)
        rendered_pixels += sum(clipped.histogram()[1:])
        clipped.close()
        layer.close()
    clip.close()
    return {
        "route": [list(point) for point in WALL_ROUTE],
        "castle_black_keep": None,
        "removed_keep_icon": True,
        "rendered_nonzero_pixels": rendered_pixels,
        "layer_widths": {"shadow": 14, "ice": 10, "crest": 2},
        "supersample": scale,
        "bbox": [left, top, right, bottom],
        "method": (
            "four-times supersampled rounded layered icework, downsampled with "
            "LANCZOS; no keep icon or decorative seam ticks"
        ),
    }


def build_terrain_clearance_mask(
    land_mask: Image.Image,
) -> tuple[Image.Image, dict]:
    """
    Reserve clean banks and verges before any terrain symbol is placed.

    The terrain pass receives this strict mask, so mountains, trees, stones,
    hills, and stipple can sit naturally beside infrastructure but can never
    be cut in half by a later river, road, Wall, or coastline stroke.
    """
    exclusion = Image.new("L", CANVAS, 0)
    draw = ImageDraw.Draw(exclusion)
    river_pixels = 0
    for name, points, profile in RIVER_CORRIDORS:
        curve = river_render_curve(name, points)
        width = max(width_profile(profile)) + 12
        draw.line(curve, fill=255, width=width, joint="curve")
    river_pixels = exclusion.histogram()[255]

    road_widths = {"royal": 6, "major": 5, "minor": 4}
    for _name, points, tier in ROAD_ROUTES:
        curve = catmull_rom_curve(points, spacing=4.0)
        draw.line(
            curve,
            fill=255,
            width=road_widths[tier] + 12,
            joint="curve",
        )
    road_and_river_pixels = exclusion.histogram()[255]

    wall_curve = chaikin_curve(WALL_ROUTE, iterations=3)
    draw.line(wall_curve, fill=255, width=26, joint="curve")
    for x, y in (wall_curve[0], wall_curve[-1]):
        draw.ellipse((x - 13, y - 13, x + 13, y + 13), fill=255)

    inverse = ImageOps.invert(exclusion)
    allowed = ImageChops.multiply(land_mask, inverse)
    inverse.close()
    qa = {
        "river_clearance_pixels": river_pixels,
        "road_added_clearance_pixels": road_and_river_pixels - river_pixels,
        "total_exclusion_pixels": exclusion.histogram()[255],
        "allowed_land_pixels": allowed.histogram()[255],
        "river_extra_width": 12,
        "road_extra_width": 12,
        "wall_clearance_width": 26,
        "method": (
            "pre-rasterized strict land-minus-infrastructure mask; terrain "
            "alpha must retain 100% coverage inside the allowed region"
        ),
    }
    exclusion.close()
    return allowed, qa


def chromakey_magenta(image: Image.Image) -> Image.Image:
    rgb = np.asarray(image.convert("RGB"), dtype=np.int16)
    key = np.array([255, 0, 244], dtype=np.int16)
    distance = np.sqrt(np.sum((rgb - key) ** 2, axis=2))
    alpha = np.uint8(np.clip((distance - 20.0) * 7.5, 0, 255))
    rgba = np.dstack([np.uint8(rgb), alpha])
    return Image.fromarray(rgba, mode="RGBA")


def load_icon_sheet(redraw_dir: Path) -> tuple[Image.Image, str]:
    alternate = redraw_dir / "terrain-symbols-alt.png"
    transparent = redraw_dir / "terrain-symbols.png"
    chroma = redraw_dir / "terrain-symbols-chromakey.png"
    # Prefer the cleaner alternate sheet when present; both sheets use the
    # same 4x4 taxonomy.
    for candidate in (alternate, transparent):
        if not candidate.exists():
            continue
        with Image.open(candidate) as opened:
            sheet = opened.convert("RGBA")
        if sheet.getchannel("A").getextrema()[0] < 255:
            return sheet, candidate.name
        sheet.close()
    if not chroma.exists():
        raise FileNotFoundError("No transparent or chromakey terrain symbol sheet found")
    with Image.open(chroma) as opened:
        return chromakey_magenta(opened), chroma.name


def load_terrain_variant_sheet(redraw_dir: Path) -> tuple[Image.Image, str]:
    """Load the v5 5x4 family of independently generated terrain symbols."""
    path = redraw_dir / "generated" / "terrain-symbols-v5.png"
    if not path.exists():
        raise FileNotFoundError(f"Missing generated terrain variant sheet: {path}")
    with Image.open(path) as opened:
        sheet = opened.convert("RGBA")
    if sheet.getchannel("A").getextrema()[0] >= 255:
        sheet.close()
        raise AssertionError(f"{path} has no transparent background")
    return sheet, path.name


def crop_icon_grid(
    sheet: Image.Image,
    columns: int = 4,
    rows: int = 4,
) -> list[Image.Image]:
    """Crop and tightly trim every cell in a generated symbol sheet."""
    icons: list[Image.Image] = []
    for row in range(rows):
        for col in range(columns):
            left = round(col * sheet.width / columns)
            top = round(row * sheet.height / rows)
            right = round((col + 1) * sheet.width / columns)
            bottom = round((row + 1) * sheet.height / rows)
            cell = sheet.crop((left, top, right, bottom))
            alpha = cell.getchannel("A")
            solid = alpha.point(lambda value: 255 if value >= 10 else 0, mode="L")
            bbox = solid.getbbox()
            solid.close()
            alpha.close()
            if bbox:
                pad = 3
                bbox = (
                    max(0, bbox[0] - pad),
                    max(0, bbox[1] - pad),
                    min(cell.width, bbox[2] + pad),
                    min(cell.height, bbox[3] + pad),
                )
                cell = cell.crop(bbox)
            icons.append(cell)
    return icons


def terrain_density_guide(source: Image.Image, coarse_mask: Image.Image) -> np.ndarray:
    guide_size = coarse_mask.size
    gray = source.convert("L")
    dark_ink = (
        gray.point(lambda value: 255 if value < 92 else 0, mode="L")
        .resize(guide_size, Image.Resampling.BOX)
        .filter(ImageFilter.GaussianBlur(0.8))
    )
    gray.close()
    ink_fraction = np.asarray(dark_ink, dtype=np.float32) / 255.0
    dark_ink.close()
    clean_land, _cleanup_qa = clean_coarse_landmask(coarse_mask)
    land_array = np.asarray(clean_land, dtype=np.float32) / 255.0
    clean_land.close()
    # The source's sub-92-luminance ink fraction is used only as a placement
    # density guide. A strict zero floor preserves source-blank plains instead
    # of sprinkling symbols across them.
    density = np.clip((ink_fraction - 0.025) / 0.2, 0.0, 1.0)
    density *= land_array
    return density


MOUNTAIN_ZONES: list[tuple[str, list[tuple[int, int]], float]] = [
    (
        "shadow-tower-massif",
        [
            (850, 40),
            (1250, 20),
            (1295, 220),
            (1310, 420),
            (1210, 650),
            (880, 640),
        ],
        1.0,
    ),
    (
        "frostfangs",
        [(900, 0), (1510, 0), (1500, 280), (1320, 360), (1090, 310), (880, 145)],
        0.88,
    ),
    (
        "northern-west-range",
        [(960, 280), (1430, 260), (1460, 650), (1220, 765), (960, 620)],
        0.68,
    ),
    (
        "mountains-of-the-moon",
        [
            (1080, 1390),
            (1250, 1290),
            (1540, 1320),
            (1860, 1420),
            (1910, 1580),
            (1760, 1785),
            (1450, 1835),
            (1170, 1740),
            (1060, 1550),
        ],
        0.94,
    ),
    (
        "westerlands",
        [(430, 1580), (1080, 1540), (1190, 1840), (1010, 2170), (560, 2220), (410, 1930)],
        0.72,
    ),
    (
        "red-mountains",
        [(610, 2530), (1010, 2490), (1430, 2530), (1810, 2660), (1680, 2950), (1240, 2880), (790, 2970), (590, 2780)],
        0.79,
    ),
    (
        "braavos-norvos-hills",
        [(2160, 1280), (2990, 1350), (3060, 2240), (2520, 2360), (2180, 1910)],
        0.62,
    ),
    (
        "bone-mountains",
        [(4220, 1000), (5490, 1020), (5590, 1770), (4890, 1940), (4320, 1650)],
        0.82,
    ),
    (
        "red-waste-west-rim",
        [(3250, 2420), (4220, 2360), (4360, 3050), (3630, 3220)],
        0.61,
    ),
    (
        "red-waste-east-rim",
        [(4540, 2220), (5580, 2260), (5620, 3340), (4740, 3360)],
        0.7,
    ),
    (
        "ibben",
        [(4610, 460), (5260, 480), (5260, 1040), (4730, 1070)],
        0.74,
    ),
    (
        "valyria-sothoryos",
        [(3090, 2820), (3940, 2830), (4030, 3682), (3070, 3682)],
        0.69,
    ),
]

FOREST_ZONES: list[tuple[str, list[tuple[int, int]], float]] = [
    (
        "haunted-forest-wall",
        [
            (1220, 0),
            (1830, 0),
            (1860, 300),
            (1500, 340),
            (1290, 245),
        ],
        1.0,
    ),
    (
        "haunted-forest",
        [(1320, 0), (1830, 0), (1860, 300), (1460, 320)],
        0.8,
    ),
    (
        "wolfswood",
        [(670, 510), (1170, 500), (1220, 1010), (850, 1130), (640, 930)],
        0.8,
    ),
    (
        "karhold-east-north",
        [(1470, 480), (1900, 500), (1890, 1020), (1550, 960)],
        0.7,
    ),
    (
        "the-neck",
        [(950, 1040), (1460, 1020), (1510, 1420), (1020, 1470)],
        0.72,
    ),
    (
        "kingswood-rainwood",
        [(1360, 2050), (1900, 2030), (1960, 2720), (1440, 2710)],
        0.74,
    ),
    (
        "forest-of-qohor",
        [(2890, 1370), (3530, 1420), (3530, 2340), (2890, 2280)],
        0.83,
    ),
    (
        "northeastern-essos",
        [(4420, 880), (5620, 900), (5610, 1580), (4660, 1660)],
        0.7,
    ),
    (
        "sothoryos-jungle",
        [(3110, 2920), (3900, 2910), (3940, 3682), (3070, 3682)],
        0.86,
    ),
]


def point_in_polygon(
    x: int,
    y: int,
    polygon: Sequence[tuple[int, int]],
) -> bool:
    inside = False
    previous_x, previous_y = polygon[-1]
    for current_x, current_y in polygon:
        crosses = (current_y > y) != (previous_y > y)
        if crosses:
            intersection_x = (
                (previous_x - current_x)
                * (y - current_y)
                / (previous_y - current_y)
                + current_x
            )
            if x < intersection_x:
                inside = not inside
        previous_x, previous_y = current_x, current_y
    return inside


def terrain_zone(
    x: int,
    y: int,
    zones: Sequence[tuple[str, Sequence[tuple[int, int]], float]],
) -> tuple[str, float] | None:
    for name, polygon, intensity in zones:
        if point_in_polygon(x, y, polygon):
            return name, intensity
    return None


def in_marsh_zone(x: int, y: int) -> bool:
    return (
        (1040 <= x <= 1390 and 1040 <= y <= 1310)
        or (2570 <= x <= 2940 and 2640 <= y <= 3000)
        or (3270 <= x <= 3650 and 3190 <= y <= 3540)
    )


def in_forest_zone(x: int, y: int) -> bool:
    return terrain_zone(x, y, FOREST_ZONES) is not None


def nearest_anchor_distance_sq(x: int, y: int, anchors: Sequence[Anchor]) -> int:
    return min((x - anchor.x) ** 2 + (y - anchor.y) ** 2 for anchor in anchors)


def scaled_icon(
    cache: dict[tuple[int, int, int, bool, int], Image.Image],
    icons: Sequence[Image.Image],
    index: int,
    width: int,
    angle: int,
    opacity: float = 1.0,
    mirror: bool = False,
) -> Image.Image:
    width = max(8, int(round(width / 4) * 4))
    opacity_key = round(opacity * 1000)
    key = (index, width, angle, mirror, opacity_key)
    cached = cache.get(key)
    if cached is not None:
        return cached
    source = icons[index]
    height = max(4, round(source.height * width / source.width))
    icon = source.resize((width, height), Image.Resampling.LANCZOS)
    if mirror:
        mirrored = ImageOps.mirror(icon)
        icon.close()
        icon = mirrored
    if angle:
        icon = icon.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    if opacity < 1.0:
        alpha = icon.getchannel("A").point(
            lambda value: round(value * opacity), mode="L"
        )
        icon.putalpha(alpha)
        alpha.close()
    cache[key] = icon
    return icon


def paste_rgba_clipped(
    canvas: Image.Image,
    art: Image.Image,
    center: tuple[int, int],
    clip_mask: Image.Image,
) -> bool:
    left = center[0] - art.width // 2
    top = center[1] - art.height // 2
    right = left + art.width
    bottom = top + art.height
    dst = (
        max(0, left),
        max(0, top),
        min(canvas.width, right),
        min(canvas.height, bottom),
    )
    if dst[0] >= dst[2] or dst[1] >= dst[3]:
        return False
    src = (dst[0] - left, dst[1] - top, dst[2] - left, dst[3] - top)
    crop = art.crop(src)
    alpha = crop.getchannel("A")
    clip = clip_mask.crop(dst)
    clipped_alpha = ImageChops.multiply(alpha, clip)
    crop.putalpha(clipped_alpha)
    canvas.paste(crop, (dst[0], dst[1]), crop)
    crop.close()
    alpha.close()
    clip.close()
    clipped_alpha.close()
    return True


def paste_rgba_fully_inside(
    canvas: Image.Image,
    art: Image.Image,
    center: tuple[int, int],
    clip_mask: Image.Image,
    minimum_coverage: float = 0.999,
) -> bool:
    """Paste only when the visible icon footprint is effectively all on land."""
    left = center[0] - art.width // 2
    top = center[1] - art.height // 2
    right = left + art.width
    bottom = top + art.height
    if left < 0 or top < 0 or right > canvas.width or bottom > canvas.height:
        return False
    alpha = art.getchannel("A")
    clip = clip_mask.crop((left, top, right, bottom))
    retained = ImageChops.multiply(alpha, clip)
    total_alpha = sum(value * count for value, count in enumerate(alpha.histogram()))
    retained_alpha = sum(
        value * count for value, count in enumerate(retained.histogram())
    )
    coverage = retained_alpha / max(1, total_alpha)
    if coverage < minimum_coverage:
        alpha.close()
        clip.close()
        retained.close()
        return False
    # Paste the accepted original alpha uncut. With >=99.9% weighted
    # coverage, any antialiased fringe outside land is imperceptible, while
    # mountain and tree silhouettes never end in a visibly sliced edge.
    canvas.paste(art, (left, top), art)
    alpha.close()
    clip.close()
    retained.close()
    return True


def place_terrain(
    canvas: Image.Image,
    land_mask: Image.Image,
    terrain_clip_mask: Image.Image,
    density: np.ndarray,
    icons: Sequence[Image.Image],
    anchors: Sequence[Anchor],
    rng: random.Random,
    step: int,
) -> tuple[dict, dict, dict, dict]:
    counts: Counter[str] = Counter()
    zone_counts: Counter[str] = Counter()
    variant_counts: Counter[str] = Counter()
    orientation_counts: Counter[str] = Counter()
    cache: dict[tuple[int, int, int, bool, int], Image.Image] = {}
    guide_h, guide_w = density.shape
    # Grid staggering plus seeded jitter creates reproducible, non-mechanical clusters.
    for row, y0 in enumerate(range(step // 2, CANVAS[1], step)):
        stagger = step // 2 if row % 2 else 0
        for x0 in range(step // 2 + stagger, CANVAS[0], step):
            x = min(CANVAS[0] - 1, max(0, x0 + rng.randint(-step // 3, step // 3)))
            y = min(CANVAS[1] - 1, max(0, y0 + rng.randint(-step // 3, step // 3)))
            if terrain_clip_mask.getpixel((x, y)) < 128:
                continue
            if nearest_anchor_distance_sq(x, y, anchors) < 30 * 30:
                continue

            gx = min(guide_w - 1, x * guide_w // CANVAS[0])
            gy = min(guide_h - 1, y * guide_h // CANVAS[1])
            mountain_zone = terrain_zone(x, y, MOUNTAIN_ZONES)
            forest_zone = terrain_zone(x, y, FOREST_ZONES)
            value = float(density[gy, gx])
            minimum_density = 0.025 if mountain_zone or forest_zone else 0.07
            if value < minimum_density:
                continue
            if mountain_zone and mountain_zone[0] == "shadow-tower-massif":
                selected_mountain_zone = True
                value = min(1.0, value * 1.7)
            elif forest_zone and forest_zone[0] == "haunted-forest-wall":
                selected_mountain_zone = False
                value = min(1.0, value * 1.6)
            else:
                selected_mountain_zone = (
                    mountain_zone is not None
                    and (
                        forest_zone is None
                        or mountain_zone[1] >= forest_zone[1]
                    )
                )

            if in_marsh_zone(x, y):
                probability = min(0.82, value * 1.08)
                zone_name = "marshland"
                kind = "marsh"
            elif selected_mountain_zone:
                assert mountain_zone is not None
                zone_name = mountain_zone[0]
                probability = min(
                    0.96,
                    0.08 + mountain_zone[1] * value * 1.35,
                )
                kind = "mountain"
            elif forest_zone is not None:
                zone_name = forest_zone[0]
                probability = min(
                    0.98,
                    0.18 + forest_zone[1] * value * 1.75,
                )
                kind = "forest"
            else:
                zone_name = "source-density"
                probability = min(0.8, value * 0.95)
                kind = "mountain" if value >= 0.5 else "hill"

            if rng.random() > probability:
                continue

            if kind == "marsh":
                index = 14
                width = rng.randint(20, 38)
                opacity = 0.54
            elif kind == "forest":
                index = rng.choice((0, 1, 2, 3, 4, 5, 5, 6, 6, 7, 7))
                width = rng.randint(22, 54)
                opacity = 0.72
            elif kind == "mountain":
                index = rng.choice((10, 11, 15, 16, 17, 18, 19))
                width = rng.randint(
                    32 if zone_name == "shadow-tower-massif" else 26,
                    72 if zone_name == "shadow-tower-massif" else 60,
                )
                opacity = 0.68
            else:
                index = rng.choice((8, 9, 11, 12, 13, 14))
                width = rng.randint(20, 44)
                opacity = 0.64

            # Preserve the historical seeded RNG stream while deliberately
            # keeping every cartographic terrain glyph upright. Rotating the
            # complete cell tilted tree trunks and mountain baselines.
            _discarded_angle = rng.choice((-12, -8, -4, 0, 0, 4, 8, 12))
            angle = 0
            mirror = rng.random() < 0.5
            icon = scaled_icon(
                cache,
                icons,
                index,
                width,
                angle,
                opacity=opacity,
                mirror=mirror,
            )
            if paste_rgba_fully_inside(
                canvas,
                icon,
                (x, y),
                terrain_clip_mask,
                minimum_coverage=1.0,
            ):
                counts[kind] += 1
                zone_counts[zone_name] += 1
                variant_counts[f"{kind}:cell-{index}"] += 1
                orientation_counts["rotation-0"] += 1
                orientation_counts[
                    "mirrored" if mirror else "unmirrored"
                ] += 1

    for image in cache.values():
        image.close()
    return (
        dict(sorted(counts.items())),
        dict(sorted(zone_counts.items())),
        dict(sorted(variant_counts.items())),
        {
            "upright": True,
            "allowed_rotations": [0],
            "horizontal_mirroring": True,
            "counts": dict(sorted(orientation_counts.items())),
        },
    )


def place_decorations(
    canvas: Image.Image,
    land_mask: Image.Image,
    icons: Sequence[Image.Image],
) -> dict:
    water_mask = ImageOps.invert(land_mask)
    cache: dict[tuple[int, int, int, bool, int], Image.Image] = {}
    ships = [
        (12, 2948, 1015, 104, -18),
        (13, 3045, 980, 94, 14),
        (14, 1605, 3306, 126, -10),
        (13, 332, 3145, 112, 22),
    ]
    placed = 0
    placements: list[dict] = []
    for index, x, y, width, angle in ships:
        icon = scaled_icon(cache, icons, index, width, angle, opacity=0.93)
        if paste_rgba_clipped(canvas, icon, (x, y), water_mask):
            placed += 1
            placements.append(
                {
                    "kind": "ship",
                    "sheet_cell": index,
                    "center": [x, y],
                    "width": width,
                    "angle": angle,
                }
            )

    for image in cache.values():
        image.close()
    water_mask.close()
    return {"ships": placed, "placements": placements}


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def expand_bbox(box: Sequence[int], padding: int) -> tuple[int, int, int, int]:
    return (
        int(box[0]) - padding,
        int(box[1]) - padding,
        int(box[2]) + padding,
        int(box[3]) + padding,
    )


def intersection_area(a: Sequence[int], b: Sequence[int]) -> int:
    width = max(0, min(a[2], b[2]) - max(a[0], b[0]))
    height = max(0, min(a[3], b[3]) - max(a[1], b[1]))
    return width * height


def coarse_land_fraction(mask: Image.Image, bbox: Sequence[int]) -> float:
    sx = mask.width / CANVAS[0]
    sy = mask.height / CANVAS[1]
    left = max(0, min(mask.width - 1, math.floor(bbox[0] * sx)))
    top = max(0, min(mask.height - 1, math.floor(bbox[1] * sy)))
    right = max(left + 1, min(mask.width, math.ceil(bbox[2] * sx)))
    bottom = max(top + 1, min(mask.height, math.ceil(bbox[3] * sy)))
    crop = mask.crop((left, top, right, bottom))
    mean = sum(index * count for index, count in enumerate(crop.histogram())) / (
        255.0 * crop.width * crop.height
    )
    crop.close()
    return mean


def text_metrics(
    draw: ImageDraw.ImageDraw,
    text: str,
    text_font: ImageFont.FreeTypeFont,
    stroke: int,
) -> tuple[int, int, tuple[int, int, int, int]]:
    raw = draw.textbbox((0, 0), text, font=text_font, stroke_width=stroke)
    return raw[2] - raw[0], raw[3] - raw[1], raw


def candidate_label_boxes(
    x: int,
    y: int,
    width: int,
    height: int,
    gap: int,
) -> list[tuple[str, tuple[int, int, int, int]]]:
    center_y = y - 3
    return [
        ("right", (x + gap, center_y - height // 2, x + gap + width, center_y - height // 2 + height)),
        ("left", (x - gap - width, center_y - height // 2, x - gap, center_y - height // 2 + height)),
        ("above", (x - width // 2, y - gap - height, x - width // 2 + width, y - gap)),
        ("below", (x - width // 2, y + gap, x - width // 2 + width, y + gap + height)),
        ("upper-right", (x + gap, y - gap - height, x + gap + width, y - gap)),
        ("lower-right", (x + gap, y + gap, x + gap + width, y + gap + height)),
        ("upper-left", (x - gap - width, y - gap - height, x - gap, y - gap)),
        ("lower-left", (x - gap - width, y + gap, x - gap, y + gap + height)),
    ]


ANCHOR_LABEL_BOX_OVERRIDES = {
    # Keep the complete name on the Vale's mountain shelf. The automatic
    # right-side placement extended over the narrow coastal water.
    "The Eyrie": ("manual-upper-left", (1508, 1563, 1578, 1584)),
}


def place_anchor_labels(
    canvas: Image.Image,
    anchors: Sequence[Anchor],
    coarse_mask: Image.Image,
    regular_font_path: Path,
    bold_font_path: Path,
    occupied: list[tuple[int, int, int, int]],
) -> dict:
    draw = ImageDraw.Draw(canvas)
    fonts = {
        1: font(bold_font_path, 17),
        2: font(regular_font_path, 13),
        3: font(regular_font_path, 10),
    }
    strokes = {1: 2, 2: 1, 3: 1}
    # All dot neighborhoods are protected before any label is laid out.
    dot_boxes = [
        (a.x - 7, a.y - 10, a.x + 7, a.y + 4)
        for a in anchors
        if a.render_dot
    ]
    occupied.extend(dot_boxes)

    placement_counts: Counter[str] = Counter()
    collision_total = 0
    rendered = 0
    hidden = 0
    for anchor in anchors:
        if not anchor.render_label:
            hidden += 1
            anchor.label = None
            continue
        text_font = fonts[anchor.rank]
        stroke = strokes[anchor.rank]
        width, height, raw_bbox = text_metrics(draw, anchor.name, text_font, stroke)
        gap = 9 if anchor.rank == 1 else 7
        override = ANCHOR_LABEL_BOX_OVERRIDES.get(anchor.name)
        candidates = (
            [override]
            if override is not None
            else candidate_label_boxes(anchor.x, anchor.y, width, height, gap)
        )

        best: tuple[float, str, tuple[int, int, int, int]] | None = None
        for preference, (side, box) in enumerate(candidates):
            outside = (
                max(0, 6 - box[0]) * height
                + max(0, box[2] - (CANVAS[0] - 6)) * height
                + max(0, 6 - box[1]) * width
                + max(0, box[3] - (CANVAS[1] - 6)) * width
            )
            overlap = sum(intersection_area(box, other) for other in occupied)
            land_fraction = coarse_land_fraction(coarse_mask, box)
            # Most labels belong on land.  The penalty is soft because island
            # and coastal labels sometimes read better over adjacent water.
            water_penalty = max(0.0, 0.54 - land_fraction) * width * height * 0.8
            score = outside * 1000 + overlap * 12 + water_penalty + preference
            option = (score, side, box)
            if best is None or option[0] < best[0]:
                best = option
        assert best is not None
        score, side, box = best
        if score >= 12:
            collision_total += 1

        draw_x = box[0] - raw_bbox[0]
        draw_y = box[1] - raw_bbox[1]
        draw.text(
            (draw_x, draw_y),
            anchor.name,
            font=text_font,
            fill=PALETTE["label"],
            stroke_width=stroke,
            stroke_fill=PALETTE["dot_halo"],
        )
        occupied.append(expand_bbox(box, 3))
        placement_counts[side] += 1
        rendered += 1
        anchor.label = {
            "text": anchor.name,
            "placement": side,
            "draw_position": [draw_x, draw_y],
            "bbox": list(box),
            "font": relpath(
                bold_font_path if anchor.rank == 1 else regular_font_path,
                regular_font_path.parents[2],
            ),
            "font_size": {1: 17, 2: 13, 3: 10}[anchor.rank],
            "stroke_width": stroke,
        }

    return {
        "rendered": rendered,
        "hidden": hidden,
        "name_only": sum(anchor.render_label and not anchor.render_dot for anchor in anchors),
        "suppressed_duplicate_labels": 0,
        "placement_counts": dict(sorted(placement_counts.items())),
        "labels_with_nonzero_collision_score": collision_total,
    }


def draw_anchor_dots(canvas: Image.Image, anchors: Sequence[Anchor]) -> None:
    draw = ImageDraw.Draw(canvas)
    for anchor in anchors:
        if not anchor.render_dot:
            continue
        cx = anchor.x
        cy = anchor.y - 3
        draw.ellipse((cx - 6, cy - 6, cx + 6, cy + 6), fill=PALETTE["dot_halo"])
        draw.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=PALETTE["dot"])


MAJOR_LABELS = [
    {
        "text": "THE NORTH",
        "center": (1410, 760),
        "size": 27,
        "kind": "kingdom",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE RIVERLANDS",
        "center": (1140, 1675),
        "size": 27,
        "kind": "kingdom",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE WESTERLANDS",
        "center": (920, 1945),
        "size": 27,
        "kind": "kingdom",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE REACH",
        "center": (1050, 2155),
        "size": 27,
        "kind": "kingdom",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE STORMLANDS",
        "center": (1510, 2330),
        "size": 27,
        "kind": "kingdom",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE CROWNLANDS",
        "center": (1370, 1990),
        "size": 27,
        "kind": "kingdom",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "DORNE",
        "center": (1300, 2795),
        "size": 27,
        "kind": "kingdom",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE VALE OF ARRYN",
        "lines": ["THE VALE", "OF ARRYN"],
        "center": (1720, 1505),
        "size": 27,
        "kind": "kingdom",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE IRON ISLANDS",
        "lines": ["THE IRON", "ISLANDS"],
        "center": (655, 1455),
        "size": 27,
        "kind": "kingdom",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "DOTHRAKI SEA",
        "center": (4140, 2270),
        "size": 40,
        "kind": "region",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE RED WASTE",
        "center": (4700, 2850),
        "size": 32,
        "kind": "region",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "VALYRIA",
        "center": (3320, 3425),
        "size": 24,
        "kind": "region",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE SHIVERING SEA",
        "center": (3130, 640),
        "size": 34,
        "kind": "sea",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE NARROW SEA",
        "lines": ["THE", "NARROW", "SEA"],
        "center": (1950, 2150),
        "size": 23,
        "kind": "sea",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE SUMMER SEA",
        "center": (2415, 3190),
        "size": 34,
        "kind": "sea",
        "angle": 0,
        "fixed": True,
    },
    {
        "text": "THE JADE SEA",
        "center": (5360, 2240),
        "size": 28,
        "kind": "sea",
        "angle": 0,
        "fixed": True,
    },
]


# Labels that belong to drawn geography rather than interactive point anchors.
# Positions are registered to the legacy reference coordinate system and are
# intentionally never collision-shifted: rivers, roads, bays, woods, and broad
# island groups should remain attached to the feature they describe.
CARTOGRAPHIC_LABELS = [
    # Westeros: broad landforms, forests, islands, and coasts.
    {
        "text": "The Lands of Always Winter",
        "center": (735, 100),
        "size": 20,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "The Frozen Shore",
        "center": (815, 240),
        "size": 15,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "Sea Dragon Point",
        "center": (805, 610),
        "size": 14,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "Bear Island",
        "center": (790, 430),
        "size": 14,
        "kind": "island",
        "angle": 0,
    },
    {
        "text": "The Wolfswood",
        "center": (1000, 680),
        "size": 15,
        "kind": "wood",
        "angle": 0,
    },
    {
        "text": "Stony Shore",
        "center": (610, 885),
        "size": 14,
        "kind": "coast",
        "angle": 0,
    },
    {
        "text": "The Hills",
        "center": (750, 1005),
        "size": 14,
        "kind": "hills",
        "angle": 0,
    },
    {
        "text": "Barrowlands",
        "center": (1060, 965),
        "size": 15,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "The Neck",
        "center": (1185, 1205),
        "size": 15,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "The Haunted Forest",
        "center": (1310, 90),
        "size": 18,
        "kind": "wood",
        "angle": 0,
    },
    {
        "text": "The Gift",
        "center": (1495, 380),
        "size": 18,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "The Grey Cliffs",
        "lines": ["The Grey", "Cliffs"],
        "center": (1815, 495),
        "size": 14,
        "kind": "coast",
        "angle": 0,
    },
    {
        "text": "Skane",
        "center": (1660, 190),
        "size": 12,
        "kind": "island",
        "angle": 0,
    },
    {
        "text": "Skagos",
        "center": (1680, 325),
        "size": 12,
        "kind": "island",
        "angle": 0,
    },
    {
        "text": "Cape Kraken",
        "center": (655, 1290),
        "size": 15,
        "kind": "coast",
        "angle": 0,
    },
    {
        "text": "The Three Sisters",
        "center": (1460, 1290),
        "size": 15,
        "kind": "island",
        "angle": 0,
    },
    {
        "text": "The Mountains of the Moon",
        "lines": ["The Mountains", "of the Moon"],
        "center": (1580, 1490),
        "size": 14,
        "kind": "mountains",
        "angle": -8,
    },
    {
        "text": "The Fingers",
        "center": (1840, 1310),
        "size": 14,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "Crackclaw Point",
        "lines": ["Crackclaw", "Point"],
        "center": (1740, 1840),
        "size": 14,
        "kind": "coast",
        "angle": 0,
    },
    {
        "text": "The Kingswood",
        "center": (1515, 2210),
        "size": 14,
        "kind": "wood",
        "angle": 0,
    },
    {
        "text": "Shield Islands",
        "lines": ["Shield", "Islands"],
        "center": (600, 2380),
        "size": 17,
        "kind": "island",
        "angle": 0,
    },
    {
        "text": "The Arbor",
        "center": (710, 2955),
        "size": 16,
        "kind": "island",
        "angle": 0,
    },
    # Essos: broad landforms, forests, island groups, and cultural regions.
    {
        "text": "Braavosian Coastlands",
        "lines": ["Braavosian", "Coastlands"],
        "center": (2250, 1710),
        "size": 15,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "Hills of Norvos",
        "center": (2605, 1705),
        "size": 17,
        "kind": "hills",
        "angle": 0,
    },
    {
        "text": "The Axe",
        "center": (2970, 1560),
        "size": 16,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "The Flatlands",
        "center": (2350, 2165),
        "size": 17,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "Forest of Qohor",
        "center": (3150, 1880),
        "size": 17,
        "kind": "wood",
        "angle": 0,
    },
    {
        "text": "The Footprint",
        "center": (4650, 1455),
        "size": 16,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "The Golden Fields",
        "lines": ["The Golden", "Fields"],
        "center": (2605, 2350),
        "size": 17,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "The Disputed Lands",
        "center": (2280, 2630),
        "size": 20,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "The Orange Shore",
        "center": (2535, 2825),
        "size": 16,
        "kind": "coast",
        "angle": 0,
    },
    {
        "text": "Lhazar",
        "center": (4550, 2490),
        "size": 20,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "Ghiscar",
        "center": (4100, 3135),
        "size": 20,
        "kind": "geographic",
        "angle": 0,
    },
    {
        "text": "Ibben",
        "center": (4510, 815),
        "size": 16,
        "kind": "island",
        "angle": 0,
    },
    # Seas, bays, gulfs, and straits.
    {
        "text": "Bay of Ice",
        "center": (980, 365),
        "size": 18,
        "kind": "bay",
        "angle": 0,
    },
    {
        "text": "Bay of Seals",
        "center": (1730, 400),
        "size": 18,
        "kind": "bay",
        "angle": 0,
    },
    {
        "text": "Bay of Ibben",
        "center": (4935, 865),
        "size": 16,
        "kind": "bay",
        "angle": 0,
    },
    {
        "text": "Blazewater Bay",
        "center": (630, 1180),
        "size": 17,
        "kind": "bay",
        "angle": 0,
    },
    {
        "text": "The Bite",
        "center": (1580, 1210),
        "size": 18,
        "kind": "bay",
        "angle": 0,
    },
    {
        "text": "Ironman's Bay",
        "center": (985, 1580),
        "size": 17,
        "kind": "bay",
        "angle": 0,
    },
    {
        "text": "Blackwater Bay",
        "lines": ["Blackwater", "Bay"],
        "center": (1650, 2045),
        "size": 17,
        "kind": "bay",
        "angle": 0,
    },
    {
        "text": "Shipbreaker Bay",
        "lines": ["Shipbreaker", "Bay"],
        "center": (1780, 2390),
        "size": 17,
        "kind": "bay",
        "angle": 0,
    },
    {
        "text": "Sea of Myrth",
        "center": (2230, 2475),
        "size": 18,
        "kind": "sea",
        "angle": 0,
    },
    {
        "text": "Sea of Dorne",
        "center": (1515, 2645),
        "size": 19,
        "kind": "sea",
        "angle": 0,
    },
    {
        "text": "Redwyne Straits",
        "center": (550, 2815),
        "size": 16,
        "kind": "strait",
        "angle": 0,
    },
    {
        "text": "The Sea of Sighs",
        "center": (3390, 2810),
        "size": 16,
        "kind": "sea",
        "angle": -55,
    },
    {
        "text": "Slaver's Bay",
        "center": (3825, 2805),
        "size": 20,
        "kind": "bay",
        "angle": 0,
    },
    {
        "text": "The Smoking Sea",
        "center": (3380, 3260),
        "size": 18,
        "kind": "sea",
        "angle": 0,
    },
    {
        "text": "The Gulf of Grief",
        "center": (3785, 3230),
        "size": 20,
        "kind": "gulf",
        "angle": 0,
    },
    {
        "text": "Ghiscari Strait",
        "center": (4075, 3360),
        "size": 16,
        "kind": "strait",
        "angle": 0,
    },
    # River and lake names follow their source feature rather than a dot.
    {
        "text": "Long Lake",
        "center": (1370, 570),
        "size": 10,
        "kind": "lake",
        "angle": 90,
    },
    {
        "text": "The Last River",
        "center": (1500, 520),
        "size": 10,
        "kind": "river",
        "angle": 20,
    },
    {
        "text": "Weeping Water",
        "center": (1580, 750),
        "size": 10,
        "kind": "river",
        "angle": 18,
    },
    {
        "text": "Broken Branch",
        "center": (1580, 945),
        "size": 10,
        "kind": "river",
        "angle": 15,
    },
    {
        "text": "White Knife",
        "center": (1300, 1030),
        "size": 10,
        "kind": "river",
        "angle": 65,
    },
    {
        "text": "Green Fork",
        "center": (1190, 1495),
        "size": 10,
        "kind": "river",
        "angle": 55,
    },
    {
        "text": "Blue Fork",
        "center": (1210, 1595),
        "size": 10,
        "kind": "river",
        "angle": 25,
    },
    {
        "text": "Red Fork",
        "center": (1190, 1700),
        "size": 10,
        "kind": "river",
        "angle": 15,
    },
    {
        "text": "The Blackwater Rush",
        "center": (1350, 2075),
        "size": 10,
        "kind": "river",
        "angle": 8,
    },
    {
        "text": "Blueburn",
        "center": (1235, 2300),
        "size": 10,
        "kind": "river",
        "angle": 10,
    },
    {
        "text": "The Mander",
        "center": (995, 2390),
        "size": 11,
        "kind": "river",
        "angle": 10,
    },
    {
        "text": "Cockleswent",
        "center": (1090, 2418),
        "size": 10,
        "kind": "river",
        "angle": 0,
    },
    {
        "text": "The Honeywine",
        "center": (750, 2630),
        "size": 10,
        "kind": "river",
        "angle": 65,
    },
    {
        "text": "Scourge",
        "center": (1465, 2818),
        "size": 10,
        "kind": "river",
        "angle": 0,
    },
    {
        "text": "Greenblood",
        "center": (1620, 2855),
        "size": 10,
        "kind": "river",
        "angle": 0,
    },
    {
        "text": "Brimstone",
        "center": (1230, 2890),
        "size": 10,
        "kind": "river",
        "angle": 65,
    },
    {
        "text": "Qhoyne",
        "center": (2790, 2180),
        "size": 10,
        "kind": "river",
        "angle": 65,
    },
    {
        "text": "Dagger Lake",
        "center": (2700, 2290),
        "size": 10,
        "kind": "lake",
        "angle": 82,
    },
    {
        "text": "Skahazadhan",
        "center": (4450, 2495),
        "size": 10,
        "kind": "river",
        "angle": -10,
    },
    # Roads and passes.
    {
        "text": "The Kingsroad",
        "center": (1235, 1215),
        "size": 10,
        "kind": "road",
        "angle": 88,
    },
    {
        "text": "The Goldroad",
        "center": (1045, 2070),
        "size": 10,
        "kind": "road",
        "angle": 0,
    },
    {
        "text": "The Roseroad",
        "center": (1235, 2245),
        "size": 10,
        "kind": "road",
        "angle": 0,
    },
    {
        "text": "The Searoad",
        "center": (805, 2350),
        "size": 10,
        "kind": "road",
        "angle": 58,
    },
    {
        "text": "Prince's Pass",
        "center": (1135, 2610),
        "size": 11,
        "kind": "pass",
        "angle": 35,
    },
]


def tracking_text_patch(
    text: str,
    text_font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int, int],
    tracking: int,
    stroke_width: int = 0,
    stroke_fill: tuple[int, int, int, int] | None = None,
) -> Image.Image:
    lines = text.splitlines()
    if len(lines) > 1:
        line_patches = [
            tracking_text_patch(
                line,
                text_font,
                fill,
                tracking,
                stroke_width=stroke_width,
                stroke_fill=stroke_fill,
            )
            for line in lines
        ]
        line_spacing = max(2, text_font.size // 6)
        width = max(patch.width for patch in line_patches)
        height = (
            sum(patch.height for patch in line_patches)
            + line_spacing * (len(line_patches) - 1)
        )
        multiline = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        y = 0
        for line_patch in line_patches:
            multiline.paste(
                line_patch,
                ((width - line_patch.width) // 2, y),
                line_patch,
            )
            y += line_patch.height + line_spacing
            line_patch.close()
        bbox = multiline.getchannel("A").getbbox()
        if bbox:
            cropped = multiline.crop(bbox)
            multiline.close()
            return cropped
        return multiline

    probe = Image.new("RGBA", (1, 1), (0, 0, 0, 0))
    probe_draw = ImageDraw.Draw(probe)
    widths: list[int] = []
    max_height = 0
    for char in text:
        bbox = probe_draw.textbbox(
            (0, 0),
            char,
            font=text_font,
            stroke_width=stroke_width,
        )
        # Use the glyph's advance rather than its painted bbox. A whitespace
        # glyph has no ink bbox, and the old one-pixel fallback visibly glued
        # words together in labels such as Castle Black and Dothraki Sea.
        widths.append(max(1, round(probe_draw.textlength(char, font=text_font))))
        max_height = max(max_height, bbox[3] - bbox[1])
    width = sum(widths) + tracking * max(0, len(text) - 1) + 8
    height = max_height + text_font.size + 8
    patch = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(patch)
    x = 4
    for char, char_width in zip(text, widths):
        draw.text(
            (x, 2),
            char,
            font=text_font,
            fill=fill,
            stroke_width=stroke_width,
            stroke_fill=stroke_fill or fill,
        )
        x += char_width + tracking
    bbox = patch.getchannel("A").getbbox()
    if bbox:
        patch = patch.crop(bbox)
    probe.close()
    return patch


def draw_major_labels(
    canvas: Image.Image,
    regular_font_path: Path,
    occupied: list[tuple[int, int, int, int]],
    anchors: Sequence[Anchor],
) -> list[dict]:
    placements: list[dict] = []
    dot_boxes = [
        (a.x - 7, a.y - 10, a.x + 7, a.y + 4)
        for a in anchors
        if a.render_dot
    ]
    offsets = [
        (0, 0),
        (0, -55),
        (0, 55),
        (-70, 0),
        (70, 0),
        (-90, -55),
        (90, -55),
        (-90, 55),
        (90, 55),
        (0, -105),
        (0, 105),
    ]
    for item in MAJOR_LABELS:
        text_font = font(regular_font_path, item["size"])
        if item["kind"] == "sea":
            color = PALETTE["sea_label"]
            alpha = 178
            stroke_width = 0
            stroke_color = color
        else:
            color = PALETTE["land_label"]
            alpha = 242 if item["kind"] == "kingdom" else 232
            stroke_width = 1
            stroke_color = PALETTE["land_label_halo"]
        rgba = tuple(bytes.fromhex(color.lstrip("#"))) + (alpha,)
        stroke_rgba = (
            tuple(bytes.fromhex(stroke_color.lstrip("#")))
            + (205 if stroke_width else alpha,)
        )
        display_text = "\n".join(item.get("lines", [item["text"]]))
        patch = tracking_text_patch(
            display_text,
            text_font,
            rgba,
            tracking=3,
            stroke_width=stroke_width,
            stroke_fill=stroke_rgba,
        )
        if item["angle"]:
            patch = patch.rotate(
                item["angle"],
                resample=Image.Resampling.BICUBIC,
                expand=True,
            )
        requested_x, requested_y = item["center"]
        best: tuple[int, int, int, int, int, int] | None = None
        item_offsets = [(0, 0)] if item.get("fixed") else offsets
        for offset_x, offset_y in item_offsets:
            center_x = requested_x + offset_x
            center_y = requested_y + offset_y
            left = center_x - patch.width // 2
            top = center_y - patch.height // 2
            box = (left, top, left + patch.width, top + patch.height)
            outside = (
                max(0, -box[0]) * patch.height
                + max(0, box[2] - CANVAS[0]) * patch.height
                + max(0, -box[1]) * patch.width
                + max(0, box[3] - CANVAS[1]) * patch.width
            )
            dot_overlap = sum(intersection_area(box, dot_box) for dot_box in dot_boxes)
            label_overlap = sum(intersection_area(box, other) for other in occupied)
            displacement = offset_x * offset_x + offset_y * offset_y
            candidate = (
                outside * 1_000_000
                + dot_overlap * 100_000
                + label_overlap * 100
                + displacement,
                left,
                top,
                dot_overlap,
                center_x,
                center_y,
            )
            if best is None or candidate[0] < best[0]:
                best = candidate
        assert best is not None
        _score, left, top, dot_overlap, center_x, center_y = best
        canvas.paste(patch, (left, top), patch)
        bbox = [left, top, left + patch.width, top + patch.height]
        occupied.append(expand_bbox(bbox, 6))
        placements.append(
            {
                **item,
                "requested_center": list(item["center"]),
                "center": [center_x, center_y],
                "bbox": bbox,
                "anchor_overlap_area": dot_overlap,
                "color": color,
                "alpha": alpha,
                "stroke_width": stroke_width,
                "stroke_color": stroke_color,
                "tracking": 3,
                "font": relpath(regular_font_path, regular_font_path.parents[2]),
            }
        )
        patch.close()
    return placements


def draw_cartographic_labels(
    canvas: Image.Image,
    italic_font_path: Path,
    occupied: list[tuple[int, int, int, int]],
    anchors: Sequence[Anchor],
) -> list[dict]:
    """Typeset fixed, dotless labels registered to drawn map features."""

    water_kinds = {"bay", "gulf", "sea", "strait"}
    river_kinds = {"lake", "river"}
    road_kinds = {"pass", "road"}
    land_kinds = {
        "coast",
        "geographic",
        "hills",
        "island",
        "mountains",
        "wood",
    }
    dot_boxes = [
        (anchor.x - 7, anchor.y - 10, anchor.x + 7, anchor.y + 4)
        for anchor in anchors
        if anchor.render_dot
    ]
    placements: list[dict] = []

    for item in CARTOGRAPHIC_LABELS:
        rendered_size = (
            max(16, item["size"] + 2)
            if item["kind"] in land_kinds
            else item["size"]
        )
        text_font = font(italic_font_path, rendered_size)
        if item["kind"] in water_kinds:
            color = PALETTE["sea_label"]
            alpha = 218
            stroke_width = 0
        elif item["kind"] in road_kinds:
            color = PALETTE["road_shadow"]
            alpha = 215
            stroke_width = 0
        elif item["kind"] in river_kinds:
            color = PALETTE["river"]
            alpha = 220
            stroke_width = 0
        else:
            color = PALETTE["land_label"]
            alpha = 242
            stroke_width = 1
        rgba = tuple(bytes.fromhex(color.lstrip("#"))) + (alpha,)
        display_text = "\n".join(item.get("lines", [item["text"]]))
        patch = tracking_text_patch(
            display_text,
            text_font,
            rgba,
            tracking=0,
            stroke_width=stroke_width,
            stroke_fill=rgba,
        )
        if item["angle"]:
            rotated = patch.rotate(
                item["angle"],
                resample=Image.Resampling.BICUBIC,
                expand=True,
            )
            patch.close()
            patch = rotated

        center_x, center_y = item["center"]
        left = center_x - patch.width // 2
        top = center_y - patch.height // 2
        bbox = [left, top, left + patch.width, top + patch.height]
        outside_area = (
            max(0, -bbox[0]) * patch.height
            + max(0, bbox[2] - CANVAS[0]) * patch.height
            + max(0, -bbox[1]) * patch.width
            + max(0, bbox[3] - CANVAS[1]) * patch.width
        )
        dot_overlap = sum(
            intersection_area(bbox, dot_box)
            for dot_box in dot_boxes
        )
        prior_label_overlap = sum(
            intersection_area(bbox, other)
            for other in occupied
        )

        canvas.paste(patch, (left, top), patch)
        occupied.append(expand_bbox(bbox, 4))
        placements.append(
            {
                **item,
                "requested_center": list(item["center"]),
                "center": [center_x, center_y],
                "bbox": bbox,
                "fixed": True,
                "anchor_overlap_area": dot_overlap,
                "prior_label_overlap_area": prior_label_overlap,
                "outside_area": outside_area,
                "color": color,
                "alpha": alpha,
                "rendered_size": rendered_size,
                "stroke_width": stroke_width,
                "font": relpath(
                    italic_font_path,
                    italic_font_path.parents[2],
                ),
            }
        )
        patch.close()

    return placements


def save_outputs(
    canvas: Image.Image,
    png_path: Path,
    jpg_path: Path,
    preview_path: Path,
    preview_width: int,
    jpeg_quality: int,
) -> None:
    if canvas.mode != "RGB" or canvas.size != CANVAS:
        raise AssertionError(f"Unexpected final canvas {canvas.mode} {canvas.size}")
    png_path.parent.mkdir(parents=True, exist_ok=True)
    png_info = PngImagePlugin.PngInfo()
    png_info.add(b"sRGB", b"\x00")
    png_info.add(b"gAMA", struct.pack(">I", 45455))
    canvas.save(
        png_path,
        format="PNG",
        compress_level=6,
        dpi=(72, 72),
        pnginfo=png_info,
    )
    canvas.save(
        jpg_path,
        format="JPEG",
        quality=jpeg_quality,
        subsampling=0,
        optimize=True,
        progressive=True,
        dpi=(96, 96),
    )
    preview_height = round(preview_width * CANVAS[1] / CANVAS[0])
    preview = canvas.resize((preview_width, preview_height), Image.Resampling.LANCZOS)
    preview.save(
        preview_path,
        format="JPEG",
        quality=90,
        subsampling=0,
        optimize=True,
        progressive=True,
        dpi=(96, 96),
    )
    preview.close()


def measure_interior_dark_leakage(
    canvas: Image.Image,
    coarse_mask: Image.Image,
) -> dict:
    """
    Measure ocean-colored pixels well inside reference land at mask resolution.

    Both a broad darkness metric and a stricter petrol-ocean color metric are
    reported. Terrain ink can legitimately contribute to the broad figure;
    the ocean-color figure is the better indicator of mask leakage.
    """
    clean, _cleanup = clean_coarse_landmask(coarse_mask)
    interior = clean.filter(ImageFilter.MinFilter(5))
    clean.close()
    sampled = canvas.resize(coarse_mask.size, Image.Resampling.BOX).convert("RGB")
    pixels = np.asarray(sampled, dtype=np.int16)
    inside = np.asarray(interior, dtype=np.uint8) >= 128
    interior_count = int(np.count_nonzero(inside))
    red = pixels[:, :, 0]
    green = pixels[:, :, 1]
    blue = pixels[:, :, 2]
    luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    dark = inside & (luma < 80)
    ocean_colored = (
        inside
        & (luma < 105)
        & ((green - red) > 9)
        & ((blue - red) > 13)
    )
    sampled.close()
    interior.close()
    return {
        "sample_grid": list(coarse_mask.size),
        "erode_filter": 5,
        "interior_samples": interior_count,
        "dark_luma_under_80_samples": int(np.count_nonzero(dark)),
        "dark_luma_under_80_percent": round(
            100.0 * np.count_nonzero(dark) / max(1, interior_count),
            5,
        ),
        "petrol_ocean_color_samples": int(np.count_nonzero(ocean_colored)),
        "petrol_ocean_color_percent": round(
            100.0 * np.count_nonzero(ocean_colored) / max(1, interior_count),
            5,
        ),
    }


def output_info(paths: Iterable[Path], root: Path) -> list[dict]:
    result = []
    for path in paths:
        with Image.open(path) as image:
            result.append(
                {
                    "path": relpath(path, root),
                    "bytes": path.stat().st_size,
                    "sha256": sha256(path),
                    "format": image.format,
                    "mode": image.mode,
                    "size": list(image.size),
                }
            )
    return result


def anchor_manifest(anchor: Anchor) -> dict:
    return {
        "name": anchor.name,
        "anchor": [anchor.x, anchor.y],
        "render_label": anchor.render_label,
        "render_dot": anchor.render_dot,
        "dot_center": [anchor.x, anchor.y - 3] if anchor.render_dot else None,
        "dot_radius": 4 if anchor.render_dot else 0,
        "halo_radius": 6 if anchor.render_dot else 0,
        "rank": anchor.rank,
        "types": sorted(anchor.types),
        "regions": sorted(anchor.regions),
        "sources": sorted(anchor.sources),
        "label": anchor.label,
    }


def build(args: argparse.Namespace) -> None:
    root = args.root.resolve()
    assets = root / "assets"
    redraw_dir = assets / "_sources" / "map-redraw"
    legacy_source_path = (
        redraw_dir / "legacy-reference" / "ASOIAF_map.original.png"
    )
    source_path = (
        legacy_source_path
        if legacy_source_path.exists()
        else assets / "ASOIAF_map.png"
    )
    coarse_mask_path = assets / "landmask.png"
    data_paths = [
        ("base", root / "js" / "data.js"),
        ("hotd", root / "hotd" / "js" / "data.js"),
        ("knight", root / "knight" / "js" / "data.js"),
    ]
    ocean_path = redraw_dir / "ocean-texture.png"
    land_path = redraw_dir / "land-texture.png"
    terrain_variant_path = (
        redraw_dir / "generated" / "terrain-symbols-v5.png"
    )
    major_font_path = root / "css" / "fonts" / "cinzel-500-latin.woff2"
    italic_font_path = (
        root / "css" / "fonts" / "ebgaramond-400-italic-latin.woff2"
    )
    regular_font_path = root / "css" / "fonts" / "ebgaramond-500-latin.woff2"
    bold_font_path = root / "css" / "fonts" / "ebgaramond-600-latin.woff2"

    required = [
        source_path,
        coarse_mask_path,
        ocean_path,
        land_path,
        terrain_variant_path,
        major_font_path,
        italic_font_path,
        regular_font_path,
        bold_font_path,
        *(path for _name, path in data_paths),
    ]
    missing = [path for path in required if not path.exists()]
    if missing:
        raise FileNotFoundError("Missing required inputs:\n" + "\n".join(map(str, missing)))

    generator_path = Path(__file__).resolve()
    generated_paths = sorted(path for path in redraw_dir.iterdir() if path.is_file())
    input_paths = sorted(
        set(required + generated_paths + [generator_path]),
        key=lambda path: path.as_posix(),
    )
    input_hashes = {
        relpath(path, root): {
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
        }
        for path in input_paths
    }

    anchors, source_counts = parse_locations(data_paths)
    log(
        f"parsed {len(anchors)} distinct anchors "
        f"(base={source_counts['base']}, hotd={source_counts['hotd']}, "
        f"knight={source_counts['knight']})"
    )

    source = load_rgb(source_path, CANVAS)
    coarse_mask = load_mask(coarse_mask_path)
    if coarse_mask.size != COARSE_MASK_SIZE:
        raise AssertionError(
            f"{coarse_mask_path} is {coarse_mask.size}, expected {COARSE_MASK_SIZE}"
        )

    log("deriving precise registered land mask")
    land_mask, mask_cleanup_qa = build_precise_land_mask(source, coarse_mask)
    land_histogram = land_mask.histogram()
    land_pixels = land_histogram[255]

    log("building mirrored Mineral Tidal Survey textures")
    ocean_source = load_rgb(ocean_path)
    ocean_graded = grade_texture(
        ocean_source,
        PALETTE["ocean_deep"],
        PALETTE["ocean_light"],
        0.78,
    )
    water_material = mirrored_tile(ocean_graded, CANVAS, offset=(211, 389))
    ocean_graded.close()
    log("building one color-normalized water material for sea, lakes, and rivers")
    shelf_qa = normalize_water_material(water_material, land_mask)
    canvas = water_material.copy()

    land_source = load_rgb(land_path)
    land_graded = grade_texture(
        land_source,
        "#89957A",
        PALETTE["land_light"],
        0.72,
    )
    land_canvas = mirrored_tile(land_graded, CANVAS, offset=(577, 143))
    land_graded.close()
    apply_biome_washes(land_canvas, land_mask)
    snow_qa = draw_far_north_snow(land_canvas, land_mask, args.seed)
    land_render_alpha = land_mask.filter(ImageFilter.GaussianBlur(0.65))
    canvas.paste(land_canvas, (0, 0), land_render_alpha)
    land_render_alpha.close()
    land_canvas.close()

    log("drawing registered coastline")
    coast_qa = {
        **shelf_qa,
        **draw_coastline(canvas, land_mask),
    }

    density = terrain_density_guide(source, coarse_mask)
    source.close()

    sheet, sheet_used = load_icon_sheet(redraw_dir)
    icons = crop_icon_grid(sheet)
    sheet.close()
    if len(icons) != 16:
        raise AssertionError(f"Expected 16 icon cells, got {len(icons)}")
    terrain_sheet, terrain_sheet_used = load_terrain_variant_sheet(redraw_dir)
    terrain_icons = crop_icon_grid(terrain_sheet, columns=5, rows=4)
    terrain_sheet.close()
    if len(terrain_icons) != 20:
        raise AssertionError(
            f"Expected 20 terrain variant cells, got {len(terrain_icons)}"
        )

    rng = random.Random(args.seed)
    terrain_clip_mask, terrain_clearance_qa = build_terrain_clearance_mask(
        land_mask
    )
    log("placing newly generated terrain symbols from source density guide")
    (
        terrain_counts,
        terrain_zone_counts,
        terrain_variant_counts,
        terrain_orientation_qa,
    ) = place_terrain(
        canvas,
        land_mask,
        terrain_clip_mask,
        density,
        terrain_icons,
        anchors,
        rng,
        args.terrain_step,
    )
    terrain_clip_mask.close()
    for terrain_icon in terrain_icons:
        terrain_icon.close()
    log(
        "terrain placed: "
        + ", ".join(f"{kind}={count}" for kind, count in terrain_counts.items())
    )

    log("drawing finished primary rivers and smaller tributaries")
    river_qa = draw_major_rivers(canvas, land_mask, water_material)
    water_material.close()

    log("drawing independently authored road network above river crossings")
    road_qa = draw_roads(canvas, land_mask)

    log("drawing the Wall as layered icework")
    wall_qa = draw_the_wall(canvas, land_mask)

    decoration_qa = place_decorations(canvas, land_mask, icons)
    for icon in icons:
        icon.close()

    occupied: list[tuple[int, int, int, int]] = []
    log("typesetting major region/sea labels")
    major_labels = draw_major_labels(canvas, major_font_path, occupied, anchors)

    log("typesetting fixed EB Garamond cartographic feature labels")
    cartographic_labels = draw_cartographic_labels(
        canvas,
        italic_font_path,
        occupied,
        anchors,
    )

    log("placing exact-coordinate coral dots and compact EB Garamond labels")
    draw_anchor_dots(canvas, anchors)
    label_qa = place_anchor_labels(
        canvas,
        anchors,
        coarse_mask,
        regular_font_path,
        bold_font_path,
        occupied,
    )
    png_path = assets / "ASOIAF_map_redrawn_v6.png"
    jpg_path = assets / "ASOIAF_map_redrawn_v6.jpg"
    preview_path = assets / "ASOIAF_map_redrawn_v6_preview.jpg"
    manifest_path = assets / "ASOIAF_map_redrawn_v6.manifest.json"

    leakage_qa = measure_interior_dark_leakage(canvas, coarse_mask)
    coarse_mask.close()
    log("saving non-destructive PNG, JPEG, and preview")
    save_outputs(
        canvas,
        png_path,
        jpg_path,
        preview_path,
        args.preview_width,
        args.jpeg_quality,
    )
    canvas.close()

    output_paths = [png_path, jpg_path, preview_path]
    outputs = output_info(output_paths, root)
    name_positions: dict[str, set[tuple[int, int]]] = {}
    for anchor in anchors:
        name_positions.setdefault(anchor.name, set()).add((anchor.x, anchor.y))
    conflicts = {
        name: [list(position) for position in sorted(positions)]
        for name, positions in sorted(name_positions.items())
        if len(positions) > 1
    }

    manifest = {
        "version": COMPOSITOR_VERSION,
        "generator": relpath(generator_path, root),
        "generator_sha256": sha256(generator_path),
        "seed": args.seed,
        "canvas": {
            "width": CANVAS[0],
            "height": CANVAS[1],
            "mode": "RGB",
            "coordinate_origin": "top-left",
            "x_direction": "right",
            "y_direction": "down",
        },
        "palette": PALETTE,
        "inputs": input_hashes,
        "generated_icon_sheet_used": {
            "decorations": sheet_used,
            "terrain": terrain_sheet_used,
        },
        "outputs": outputs,
        "manifest_path": relpath(manifest_path, root),
        "counts": {
            "location_rows_by_source": source_counts,
            "distinct_anchors": len(anchors),
            "distinct_names": len({anchor.name for anchor in anchors}),
            "anchors_by_rank": dict(
                sorted(Counter(anchor.rank for anchor in anchors).items())
            ),
            "terrain_symbols": terrain_counts,
            "terrain_symbols_by_zone": terrain_zone_counts,
            "terrain_symbol_variants": terrain_variant_counts,
            "major_labels": len(major_labels),
            "cartographic_labels": len(cartographic_labels),
            "cartographic_labels_by_kind": dict(
                sorted(
                    Counter(
                        placement["kind"]
                        for placement in cartographic_labels
                    ).items()
                )
            ),
            "ships": decoration_qa["ships"],
        },
        "land_mask": {
            "method": (
                "coarse mask topology with source-luminance boundary refinement "
                "inside a 31 px uncertainty band"
            ),
            "land_pixels": land_pixels,
            "land_percent": round(100.0 * land_pixels / (CANVAS[0] * CANVAS[1]), 5),
            "bbox": list(land_mask.getbbox() or (0, 0, 0, 0)),
            "coarse_cleanup": mask_cleanup_qa,
        },
        "coastline": coast_qa,
        "snow": snow_qa,
        "terrain_clearance": terrain_clearance_qa,
        "terrain_orientation": terrain_orientation_qa,
        "interior_dark_leakage": leakage_qa,
        "rivers": river_qa,
        "roads": road_qa,
        "wall": wall_qa,
        "decorations": decoration_qa["placements"],
        "major_labels": major_labels,
        "cartographic_labels": cartographic_labels,
        "label_qa": label_qa,
        "coordinate_conflicts": conflicts,
        "anchors": [anchor_manifest(anchor) for anchor in anchors],
        "software": {
            "python": sys.version.split()[0],
            "pillow": Image.__version__,
            "numpy": np.__version__,
            "freetype": features.version("freetype2"),
            "libjpeg_turbo": features.version("libjpeg_turbo"),
            "jpeg": features.version("jpg"),
            "zlib": features.version("zlib"),
        },
    }
    land_mask.close()
    manifest_path.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )

    log(
        f"QA canvas={CANVAS[0]}x{CANVAS[1]} RGB; "
        f"land={manifest['land_mask']['land_percent']}%; "
        f"anchors={len(anchors)}; labels={label_qa['rendered']}; "
        f"river_pixels={river_qa['rendered_nonzero_pixels']}; "
        f"interior_ocean={leakage_qa['petrol_ocean_color_percent']}%"
    )
    for output in outputs:
        log(
            f"wrote {output['path']} {output['size'][0]}x{output['size'][1]} "
            f"{output['mode']} {output['bytes']:,} bytes "
            f"sha256={output['sha256'][:16]}…"
        )
    log(f"wrote {relpath(manifest_path, root)}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="Repository root (default: inferred from this script)",
    )
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED)
    parser.add_argument("--terrain-step", type=int, default=20)
    parser.add_argument("--preview-width", type=int, default=1600)
    parser.add_argument("--jpeg-quality", type=int, default=94)
    return parser.parse_args()


if __name__ == "__main__":
    build(parse_args())
