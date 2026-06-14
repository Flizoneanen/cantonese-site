import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="mb-4 text-5xl font-bold">
          Learn Cantonese
        </h1>

        <p className="mb-8 max-w-3xl text-lg text-gray-600">
          A structured Cantonese course featuring vocabulary, Jyutping,
          quizzes, lesson notes, and stroke order guides.
        </p>

        <div className="flex gap-4">
          <Link
            href="/units"
            className="rounded-xl bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Browse Units
          </Link>

          <Link
            href="/lessons/lesson-1"
            className="rounded-xl border px-6 py-3 hover:bg-gray-100"
          >
            Start Lesson 1
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">Vocabulary</h2>
          <p className="text-gray-600">
            Learn characters, Jyutping, and English meanings.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">Quizzes</h2>
          <p className="text-gray-600">
            Practice recognition, pronunciation, and translation.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">Lesson Notes</h2>
          <p className="text-gray-600">
            Read explanations, examples, and dialogues.
          </p>
        </div>
      </section>
    </main>
  );
}