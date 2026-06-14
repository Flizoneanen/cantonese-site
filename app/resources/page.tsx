export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-4xl font-bold">Resources & Credits</h1>

        <div className="space-y-6 text-lg leading-8 text-gray-700">
          <p>
            This site is inspired by the structure of HowToStudyKorean.
          </p>

          <p>
            The lesson progression is loosely inspired by beginner Chinese textbook
            formats such as Integrated Chinese, but adapted for Cantonese with
            traditional characters, Jyutping, and Cantonese-focused vocabulary.
          </p>

          <p>
            Stroke order animations are rendered using Hanzi Writer. The stroke
            practice section is meant to help learners connect vocabulary with
            handwriting and character structure.
          </p>

          <p>
            For pronunciation, I recommend supplementing this site with Cantonese
            audio and YouTube pronunciation guides. A dedicated Jyutping and tone
            guide will be added here later.
          </p>

          <p>
            This project is still under development, so resources may change as I
            continue improving the lessons, pronunciation support, and study tools.
          </p>
        </div>
      </section>
    </main>
  );
}