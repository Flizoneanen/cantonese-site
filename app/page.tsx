import fs from "fs";
import path from "path";
import Papa from "papaparse";
import Link from "next/link";

type LessonRow = {
  slug: string;
  title: string;
  description: string;
};

export default function Home() {
  const filePath = path.join(process.cwd(), "data", "lessons.csv");
  const file = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse<LessonRow>(file, {
    header: true,
    skipEmptyLines: true,
  });

  const lessons = parsed.data;

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <h1 className="mb-6 text-5xl font-bold">
        Cantonese Learning Project
      </h1>

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <Link
            key={lesson.slug}
            href={`/lessons/${lesson.slug}`}
            className="block rounded-lg border p-4 hover:bg-gray-100"
          >
            <h2 className="text-2xl font-semibold">
              {lesson.title}
            </h2>

            <p className="text-gray-600">
              {lesson.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}