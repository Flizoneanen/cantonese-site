import fs from "fs";
import path from "path";
import Papa from "papaparse";
import Link from "next/link";
import VocabQuiz from "@/app/components/VocabQuiz";
import LessonMarkdown from "@/app/components/LessonMarkdown";
import AudioButton from "@/app/components/AudioButton";


type VocabRow = {
  traditional: string;
  jyutping: string;
  english: string;
};

type LessonRow = {
  unit: string;
  slug: string;
  title: string;
  description: string;
};

function unitToSlug(unit: string) {
  return unit.trim().toLowerCase().replace(/\s+/g, "-");
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const lessonsFilePath = path.join(process.cwd(), "data", "lessons.csv");
  const lessonsFile = fs.readFileSync(lessonsFilePath, "utf8");

  const lessonsParsed = Papa.parse<LessonRow>(lessonsFile, {
    header: true,
    skipEmptyLines: true,
  });

  const lessonInfo = lessonsParsed.data.find((lesson) => lesson.slug === slug);
  const title = lessonInfo?.title ?? slug;
  const unitHref = lessonInfo ? `/units/${unitToSlug(lessonInfo.unit)}` : "/units";
  const unitLabel = lessonInfo?.unit ?? "Units";

  const filePath = path.join(process.cwd(), "data", "vocab", `${slug}.csv`);
  const lessonTextPath = path.join(
    process.cwd(),
    "data",
    "lesson-text",
    `${slug}.md`
  );

  if (!fs.existsSync(filePath)) {
    return <main className="p-10">Lesson not found.</main>;
  }

  const lessonText = fs.existsSync(lessonTextPath)
    ? fs.readFileSync(lessonTextPath, "utf8")
    : "";

  const file = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse<VocabRow>(file, {
    header: true,
    skipEmptyLines: true,
  });

  const vocab = parsed.data;

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <Link href={unitHref} className="mb-6 inline-block text-blue-600 hover:underline">
        ← Back to {unitLabel}
      </Link>

      <h1 className="mb-6 text-4xl font-bold">{title}</h1>

      <div className="grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vocab.map((word, index) => (
          <div
            key={`${word.traditional}-${word.jyutping}-${index}`}
            className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md"
          >
            <div className="mb-4 text-center text-5xl font-bold">
              {word.traditional}
            </div>

            <div className="mb-2 text-center text-xl text-gray-700">
              {word.jyutping}
            </div>

            <div className="text-center text-gray-500">{word.english}</div>

            <div className="mt-4 flex justify-center">
              <AudioButton src={`/audio/${slug}/${word.traditional}.mp3`} />
            </div>
          </div>
        ))}
      </div>

      <VocabQuiz vocab={vocab} />

      {lessonText && <LessonMarkdown lessonText={lessonText} lessonSlug={slug} />}
    </main>
  );
}