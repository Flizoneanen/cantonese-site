"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import AudioButton from "@/app/components/AudioButton";

type LessonMarkdownProps = {
  lessonText: string;
  lessonSlug: string;
};

type LessonPart =
  | { type: "markdown"; content: string }
  | { type: "audio"; fileName: string; text: string };

const audioPattern = /\[audio:([^|\]]+)\|([^\]]+)\]/g;

function splitLessonText(lessonText: string): LessonPart[] {
  const parts: LessonPart[] = [];
  let lastIndex = 0;

  for (const match of lessonText.matchAll(audioPattern)) {
    const fullMatch = match[0];
    const fileName = match[1];
    const text = match[2];
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      parts.push({
        type: "markdown",
        content: lessonText.slice(lastIndex, matchIndex),
      });
    }

    parts.push({
      type: "audio",
      fileName,
      text,
    });

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < lessonText.length) {
    parts.push({
      type: "markdown",
      content: lessonText.slice(lastIndex),
    });
  }

  return parts;
}

export default function LessonMarkdown({
  lessonText,
  lessonSlug,
}: LessonMarkdownProps) {
  const [showJyutping, setShowJyutping] = useState(true);
  const lessonParts = splitLessonText(lessonText);

  const markdownComponents = {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="mb-6 text-4xl font-bold">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-10 mb-4 border-b pb-2 text-2xl font-bold">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-6 mb-3 text-xl font-semibold">{children}</h3>
    ),
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 text-lg leading-8 text-gray-700">{children}</p>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-6 list-disc space-y-2 pl-8 text-lg text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-8 text-lg text-gray-700">
        {children}
      </ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-black">{children}</strong>
    ),
    code: ({ children }: { children?: React.ReactNode }) =>
      showJyutping ? (
        <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">
          {children}
        </span>
      ) : null,
    hr: () => <hr className="my-8 border-gray-200" />,
  };

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

      {lessonParts.map((part, index) => {
        if (part.type === "audio") {
          return (
            <div key={`${part.fileName}-${index}`} className="mb-5">
              <AudioButton src={`/audio/${lessonSlug}/${part.fileName}.mp3`} />
            </div>
          );
        }

        return (
          <ReactMarkdown key={index} components={markdownComponents}>
            {part.content}
          </ReactMarkdown>
        );
      })}
    </article>
  );
}