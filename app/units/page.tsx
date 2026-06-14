import fs from "fs";
import path from "path";
import Papa from "papaparse";
import Link from "next/link";

type LessonRow = {
  unit: string;
  slug: string;
  title: string;
  description: string;
};

function unitToSlug(unit: string) {
  return unit.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function UnitsPage() {
  const filePath = path.join(process.cwd(), "data", "lessons.csv");
  const file = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse<LessonRow>(file, {
    header: true,
    skipEmptyLines: true,
  });

  const lessons = parsed.data.filter(
    (lesson) => lesson.unit && lesson.slug && lesson.title
  );

  const units = lessons.reduce<Record<string, LessonRow[]>>((acc, lesson) => {
    if (!acc[lesson.unit]) {
      acc[lesson.unit] = [];
    }

    acc[lesson.unit].push(lesson);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-4xl font-bold">Browse Units</h1>

        <p className="mb-8 text-gray-600">
          Choose a unit to begin learning.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(units).map(([unitName, unitLessons]) => (
            <Link
              key={unitName}
              href={`/units/${unitToSlug(unitName)}`}
              className="block rounded-2xl border p-6 hover:bg-gray-50"
            >
              <h2 className="text-2xl font-semibold">{unitName}</h2>

              <p className="mt-2 text-gray-600">
                {unitLessons.length} lessons
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}