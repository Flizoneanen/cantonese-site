import csv
import re
import subprocess
from pathlib import Path

DEFAULT_VOICE = "zh-HK-HiuMaanNeural"
SPEAKER_VOICES = {
    "A": "zh-HK-WanLungNeural",
    "B": "zh-HK-HiuMaanNeural",
}

PROJECT_ROOT = Path(__file__).resolve().parents[1]
VOCAB_DIR = PROJECT_ROOT / "data" / "vocab"
AUDIO_DIR = PROJECT_ROOT / "public" / "audio"
LESSON_TEXT_DIR = PROJECT_ROOT / "data" / "lesson-text"
AUDIO_PATTERN = re.compile(r"\[audio:([^|\]]+)\|([^\]]+)\]")
DIALOGUE_PATTERN = re.compile(r"\[dialogue:([^|\]]+)\|([^|\]]+)\|([^|\]]+)\|([^\]]+)\]")


def generate_audio(text: str, output_path: Path, voice: str = DEFAULT_VOICE) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if output_path.exists():
        print(f"Skipping existing: {output_path.relative_to(PROJECT_ROOT)}")
        return

    print(f"Generating: {text} -> {output_path.relative_to(PROJECT_ROOT)}")

    subprocess.run(
        [
            "edge-tts",
            "--voice",
            voice,
            "--text",
            text,
            "--write-media",
            str(output_path),
        ],
        check=True,
    )


def generate_audio_for_lesson(csv_path: Path) -> None:
    lesson_slug = csv_path.stem
    output_dir = AUDIO_DIR / lesson_slug

    with csv_path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)

        if "traditional" not in (reader.fieldnames or []):
            print(f"Skipping {csv_path.name}: missing traditional column")
            return

        for row in reader:
            text = row["traditional"].strip()

            if not text:
                continue

            output_path = output_dir / f"{text}.mp3"
            generate_audio(text, output_path)


def generate_audio_from_markdown(md_path: Path) -> None:
    lesson_slug = md_path.stem

    content = md_path.read_text(encoding="utf-8")

    matches = AUDIO_PATTERN.findall(content)

    for file_name, text in matches:
        output_path = AUDIO_DIR / lesson_slug / f"{file_name}.mp3"
        generate_audio(text.strip(), output_path)

    dialogue_matches = DIALOGUE_PATTERN.findall(content)

    for speaker, file_name, _jyutping, text in dialogue_matches:
        output_path = AUDIO_DIR / lesson_slug / f"{file_name}.mp3"
        voice = SPEAKER_VOICES.get(speaker.strip().upper(), DEFAULT_VOICE)
        generate_audio(text.strip(), output_path, voice)


def main() -> None:
    csv_files = sorted(VOCAB_DIR.glob("*.csv"))

    if not csv_files:
        print(f"No vocab CSV files found in {VOCAB_DIR}")
        return

    for csv_path in csv_files:
        print(f"\n=== {csv_path.name} ===")
        generate_audio_for_lesson(csv_path)

    md_files = sorted(LESSON_TEXT_DIR.glob("*.md"))

    for md_path in md_files:
        print(f"\n=== {md_path.name} audio tags ===")
        generate_audio_from_markdown(md_path)


if __name__ == "__main__":
    main()