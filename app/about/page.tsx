export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-4xl font-bold">About</h1>

        <div className="space-y-6 text-lg leading-8 text-gray-700">
          <p>
            The Cantonese Learning Project is a structured Cantonese course
            featuring vocabulary, quizzes, grammar notes, and interactive
            learning tools.
          </p>

          <p>
            This project was created by Ethan Chang, a UCLA student with an
            interest in languages, education, and technology.
          </p>

          <p>
            I am not a fluent Cantonese speaker. Like many heritage learners,
            I started this project because I wanted a better way to improve my
            own Cantonese skills and found it difficult to locate learning
            resources that were both structured and beginner-friendly.
          </p>

          <p>
            For now I am trying to essentaially create a Cantonese version of HowToStudyKorean,
            simply because I like the layout of it.
          </p>

          <p>
            The site is still under active development, with additional lessons,
            pronunciation guides, stroke order references, audio support, and
            study tools planned for future updates.
          </p>
        </div>
      </section>
    </main>
  );
}