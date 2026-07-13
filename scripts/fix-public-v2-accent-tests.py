#!/usr/bin/env python3
"""Align legacy source assertions with the final accented fr-CA V2 copy."""

from pathlib import Path


def replace(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    if old in text:
        file.write_text(text.replace(old, new), encoding="utf-8")
        return
    if new not in text:
        raise SystemExit(f"Neither legacy nor final assertion exists in {path}: {old!r}")


replace(
    "tests/unit/marketing-header-source.test.mts",
    "/Lead recovery for cleaning businesses/",
    "/Smart customer intake and reply workspace/",
)
replace(
    "tests/unit/public-growth-copy-source.test.mts",
    "/proprietaire garde la decision/i",
    "/propriétaire garde la décision/i",
)
replace(
    "tests/unit/public-growth-copy-source.test.mts",
    "/Porte d'approbation/i",
    "/Porte d’approbation/i",
)
replace(
    "tests/unit/i18n-copy.test.mts",
    "/Porte d'approbation/i",
    "/Porte d’approbation/i",
)
replace(
    "tests/unit/public-v2-positioning.test.mts",
    "/entreprises d'entretien/i",
    "/entreprises d’entretien/i",
)
replace(
    "tests/unit/public-v2-positioning.test.mts",
    "/n'invente pas de prix/i",
    "/n’invente pas de prix/i",
)

print("Accented fr-CA V2 test contracts aligned.")
