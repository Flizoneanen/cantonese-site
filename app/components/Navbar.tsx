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

export default function Navbar() {
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
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          Cantonese Project
        </Link>

        <div className="flex items-center gap-6">
          <div className="group relative">
            <button className="rounded-lg px-3 py-2 hover:bg-gray-100">
              Courses ▾
            </button>

            <div className="absolute right-0 z-10 hidden w-80 rounded-xl border bg-white p-2 shadow-lg group-hover:block">
              {Object.entries(units).map(([unitName, unitLessons]) => (
                <Link
                  key={unitName}
                  href={`/units/${unitToSlug(unitName)}`}
                  className="block rounded-lg px-4 py-3 hover:bg-gray-100"
                >
                  <div className="font-semibold">{unitName}</div>
                  <div className="text-sm text-gray-500">
                    {unitLessons.length} lessons
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/strokes" className="rounded-lg px-3 py-2 hover:bg-gray-100">
            Stroke Practice
          </Link>

          <Link href="/resources" className="rounded-lg px-3 py-2 hover:bg-gray-100">
            Resources
          </Link>

          <Link href="/about" className="rounded-lg px-3 py-2 hover:bg-gray-100">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}