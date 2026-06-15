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

  const lessons = lessonsParsed.data.filter(
    (lesson) => lesson.unit && lesson.slug && lesson.title
  );

  const lessonInfo = lessons.find((lesson) => lesson.slug === slug);
  const lessonIndex = lessons.findIndex((lesson) => lesson.slug === slug);

  const previousLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex >= 0 && lessonIndex < lessons.length - 1
      ? lessons[lessonIndex + 1]
      : null;

  const title = lessonInfo?.title ?? slug;
  const unitHref = lessonInfo ? `/units/${unitToSlug(lessonInfo.unit)}` : "/units";
  const unitLabel = lessonInfo?.unit ?? "Units";

  const unitLessons = lessonInfo
    ? lessons.filter((lesson) => lesson.unit === lessonInfo.unit)
    : [];

  const unitLessonIndex = unitLessons.findIndex(
    (lesson) => lesson.slug === slug
  );

  const lessonNumberInUnit = unitLessonIndex >= 0 ? unitLessonIndex + 1 : 1;
  const totalLessonsInUnit = unitLessons.length || 1;
  const progressPercentage = Math.round(
    (lessonNumberInUnit / totalLessonsInUnit) * 100
  );

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

      <section className="mb-8 max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {unitLabel}
            </p>
            <h1 className="mt-1 text-4xl font-bold">{title}</h1>
          </div>

          <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
            Lesson {lessonNumberInUnit} of {totalLessonsInUnit}
          </div>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-black"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </section>

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

      <VocabQuiz vocab={vocab} lessonSlug={slug} />

      {lessonText && <LessonMarkdown lessonText={lessonText} lessonSlug={slug} />}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
        {previousLesson ? (
          <Link
            href={`/lessons/${previousLesson.slug}`}
            className="rounded-2xl border bg-white p-5 shadow-sm hover:bg-gray-50"
          >
            <div className="text-sm text-gray-500">Previous Lesson</div>
            <div className="font-semibold">← {previousLesson.title}</div>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className="rounded-2xl border bg-white p-5 text-right shadow-sm hover:bg-gray-50"
          >
            <div className="text-sm text-gray-500">Next Lesson</div>
            <div className="font-semibold">{nextLesson.title} →</div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </main>
  );
}