
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

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}) {
  const { unitSlug } = await params;

  const filePath = path.join(process.cwd(), "data", "lessons.csv");
  const file = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse<LessonRow>(file, {
    header: true,
    skipEmptyLines: true,
  });

  const allLessons = parsed.data.filter(
    (lesson) => lesson.unit && lesson.slug && lesson.title
  );
  const unitLessons = allLessons.filter(
    (lesson) => unitToSlug(lesson.unit) === unitSlug
  );

  if (unitLessons.length === 0) {
    return <main className="p-10">Unit not found.</main>;
  }

  const unitName = unitLessons[0].unit;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="mb-6 inline-block text-blue-600 hover:underline">
        ← Back to home
      </Link>

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-4xl font-bold">{unitName}</h1>
        <p className="mb-8 text-gray-600">Choose a lesson from this unit.</p>

        <div className="space-y-4">
          {unitLessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/lessons/${lesson.slug}`}
              className="block rounded-2xl border p-5 hover:bg-gray-50"
            >
              <h2 className="text-2xl font-semibold">{lesson.title}</h2>
              <p className="mt-1 text-gray-600">{lesson.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}