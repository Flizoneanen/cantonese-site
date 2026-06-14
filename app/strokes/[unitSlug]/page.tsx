import fs from "fs";
import path from "path";
import Papa from "papaparse";
import Link from "next/link";
import StrokeOrder from "@/app/components/StrokeOrder";
import AudioButton from "@/app/components/AudioButton";

type LessonRow = {
  unit: string;
  slug: string;
  title: string;
  description: string;
};

type VocabRow = {
  traditional: string;
  jyutping: string;
  english: string;
};

type VocabWithLesson = VocabRow & {
  lessonTitle: string;
  lessonSlug: string;
};

function unitToSlug(unit: string) {
  return unit.trim().toLowerCase().replace(/\s+/g, "-");
}

function getUniqueCharacters(text: string) {
  return Array.from(text).filter((character) => character.trim() !== "");
}

export default async function StrokeUnitPage({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}) {
  const { unitSlug } = await params;

  const lessonsFilePath = path.join(process.cwd(), "data", "lessons.csv");
  const lessonsFile = fs.readFileSync(lessonsFilePath, "utf8");

  const lessonsParsed = Papa.parse<LessonRow>(lessonsFile, {
    header: true,
    skipEmptyLines: true,
  });

  const lessons = lessonsParsed.data.filter(
    (lesson) => lesson.unit && lesson.slug && lesson.title
  );

  const unitLessons = lessons.filter(
    (lesson) => unitToSlug(lesson.unit) === unitSlug
  );

  if (unitLessons.length === 0) {
    return <main className="p-10">Unit not found.</main>;
  }

  const unitName = unitLessons[0].unit;

  const vocab: VocabWithLesson[] = unitLessons.flatMap((lesson) => {
    const vocabFilePath = path.join(
      process.cwd(),
      "data",
      "vocab",
      `${lesson.slug}.csv`
    );

    if (!fs.existsSync(vocabFilePath)) {
      return [];
    }

    const vocabFile = fs.readFileSync(vocabFilePath, "utf8");

    const vocabParsed = Papa.parse<VocabRow>(vocabFile, {
      header: true,
      skipEmptyLines: true,
    });

    return vocabParsed.data
      .filter((word) => word.traditional && word.jyutping && word.english)
      .map((word) => ({
        ...word,
        lessonTitle: lesson.title,
        lessonSlug: lesson.slug,
      }));
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/strokes"
        className="mb-6 inline-block text-blue-600 hover:underline"
      >
        ← Back to stroke units
      </Link>

      <section className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-4xl font-bold">Stroke Practice: {unitName}</h1>
        <p className="text-gray-600">
          Practice stroke order for vocabulary from this unit. Multi-character
          words are shown as full words, but practiced one character at a time.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {vocab.map((word, index) => (
          <div
            key={`${word.traditional}-${word.jyutping}-${index}`}
            className="rounded-3xl border bg-white p-6 shadow-sm"
          >
            <div className="mb-4 border-b pb-4">
              <p className="mb-1 text-sm text-gray-500">{word.lessonTitle}</p>
              <h2 className="text-5xl font-bold">{word.traditional}</h2>
              <p className="mt-2 text-xl text-gray-700">{word.jyutping}</p>
              <p className="mt-1 text-gray-500">{word.english}</p>

              <div className="mt-4">
                <AudioButton src={`/audio/${word.lessonSlug}/${word.traditional}.mp3`} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {getUniqueCharacters(word.traditional).map(
                (character, characterIndex) => (
                  <div
                    key={`${word.traditional}-${character}-${characterIndex}`}
                    className="rounded-2xl bg-gray-50 p-4 text-center"
                  >
                    <div className="mb-3 text-3xl font-bold">{character}</div>
                    <StrokeOrder character={character} />
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}