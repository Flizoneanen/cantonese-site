"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

type LessonMarkdownProps = {
  lessonText: string;
};

export default function LessonMarkdown({ lessonText }: LessonMarkdownProps) {
  const [showJyutping, setShowJyutping] = useState(true);

  return (
    <article className="mt-12 max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Lesson Notes</h2>
          <p className="mt-2 text-gray-500">
            Explanations, examples, and grammar notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowJyutping((currentValue) => !currentValue)}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100"
        >
          {showJyutping ? "Hide Jyutping" : "Show Jyutping"}
        </button>
      </div>

      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 text-4xl font-bold">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 mb-4 border-b pb-2 text-2xl font-bold">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-3 text-xl font-semibold">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-5 text-lg leading-8 text-gray-700">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-6 list-disc space-y-2 pl-8 text-lg text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 list-decimal space-y-2 pl-8 text-lg text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-black">{children}</strong>
          ),
          code: ({ children }) =>
            showJyutping ? (
              <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">
                {children}
              </span>
            ) : null,
          hr: () => <hr className="my-8 border-gray-200" />,
        }}
      >
        {lessonText}
      </ReactMarkdown>
    </article>
  );
}