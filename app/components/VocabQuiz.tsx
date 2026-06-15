"use client";

import { useMemo, useState } from "react";
import AudioButton from "@/app/components/AudioButton";

type VocabRow = {
  traditional: string;
  jyutping: string;
  english: string;
};

type VocabQuizProps = {
  vocab: VocabRow[];
  lessonSlug: string;
};

type QuizMode =
  | "character-to-english"
  | "character-to-jyutping"
  | "english-to-character"
  | "audio-to-character";

function shuffleArray<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function getCorrectAnswer(word: VocabRow, mode: QuizMode): string {
  if (mode === "character-to-jyutping") return word.jyutping;
  if (mode === "english-to-character") return word.traditional;
  if (mode === "audio-to-character") return word.traditional;
  return word.english;
}

function getPromptLabel(mode: QuizMode): string {
  if (mode === "character-to-jyutping") return "What is the Jyutping?";
  if (mode === "english-to-character") return "Which character/word matches this English?";
  if (mode === "audio-to-character") return "Listen and choose the correct character/word";
  return "What does this mean?";
}

export default function VocabQuiz({ vocab, lessonSlug }: VocabQuizProps) {
  const [questionOrder, setQuestionOrder] = useState<number[]>(() =>
    shuffleArray(vocab.map((_word, index) => index))
  );
  const [questionPosition, setQuestionPosition] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizMode, setQuizMode] = useState<QuizMode>("character-to-english");
  const [showJyutping, setShowJyutping] = useState(true);

  const currentWord = vocab[questionOrder[questionPosition]];

  const answerChoices = useMemo(() => {
    if (!currentWord) return [];

    const correctAnswer = getCorrectAnswer(currentWord, quizMode);

    const wrongAnswers = vocab
      .filter((word) => getCorrectAnswer(word, quizMode) !== correctAnswer)
      .map((word) => getCorrectAnswer(word, quizMode));

    return shuffleArray([
      correctAnswer,
      ...shuffleArray(wrongAnswers).slice(0, 3),
    ]);
  }, [currentWord, quizMode, vocab]);

  if (vocab.length === 0 || !currentWord) {
    return null;
  }

  const correctAnswer = getCorrectAnswer(currentWord, quizMode);
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === correctAnswer;

  function handleAnswer(choice: string) {
    if (isAnswered) return;

    setSelectedAnswer(choice);

    if (choice === correctAnswer) {
      setScore((previousScore) => previousScore + 1);
    }
  }

  function handleNextQuestion() {
    setSelectedAnswer(null);

    if (questionPosition + 1 >= questionOrder.length) {
      setQuestionOrder(
        shuffleArray(vocab.map((_word, index) => index))
      );
      setQuestionPosition(0);
    } else {
      setQuestionPosition((previousPosition) => previousPosition + 1);
    }
  }

  function handleModeChange(mode: QuizMode) {
    setQuizMode(mode);
    setQuestionOrder(
      shuffleArray(vocab.map((_word, index) => index))
    );
    setQuestionPosition(0);
    setSelectedAnswer(null);
    setScore(0);
  }

  return (
    <section className="mt-12 max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Quiz Mode</h2>
          <p className="text-gray-600">Score: {score} / {vocab.length}</p>
        </div>

        {quizMode !== "character-to-jyutping" &&
          quizMode !== "audio-to-character" && (
          <button
            type="button"
            onClick={() => setShowJyutping((currentValue) => !currentValue)}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100"
          >
            {showJyutping ? "Hide Jyutping" : "Show Jyutping"}
          </button>
        )}
      </div>

      <div className="mb-6 grid gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => handleModeChange("character-to-english")}
          className={`rounded-xl border p-3 text-sm hover:bg-gray-100 ${
            quizMode === "character-to-english" ? "bg-black text-white hover:bg-black" : ""
          }`}
        >
          Character → English
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("character-to-jyutping")}
          className={`rounded-xl border p-3 text-sm hover:bg-gray-100 ${
            quizMode === "character-to-jyutping" ? "bg-black text-white hover:bg-black" : ""
          }`}
        >
          Character → Jyutping
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("english-to-character")}
          className={`rounded-xl border p-3 text-sm hover:bg-gray-100 ${
            quizMode === "english-to-character" ? "bg-black text-white hover:bg-black" : ""
          }`}
        >
          English → Character
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("audio-to-character")}
          className={`rounded-xl border p-3 text-sm hover:bg-gray-100 ${
            quizMode === "audio-to-character"
              ? "bg-black text-white hover:bg-black"
              : ""
          }`}
        >
          Audio → Character
        </button>
      </div>

      <div className="mb-6 rounded-xl bg-gray-50 p-6 text-center">
        <p className="mb-2 text-gray-500">{getPromptLabel(quizMode)}</p>

        {quizMode === "english-to-character" ? (
          <p className="mb-2 text-4xl font-bold">{currentWord.english}</p>
        ) : quizMode === "audio-to-character" ? (
          <div className="flex justify-center">
            <AudioButton
              src={`/audio/${lessonSlug}/${currentWord.traditional}.mp3`}
            />
          </div>
        ) : (
          <>
            <p className="mb-2 text-6xl font-bold">{currentWord.traditional}</p>
            {quizMode !== "character-to-jyutping" && showJyutping && (
              <p className="text-xl text-gray-600">{currentWord.jyutping}</p>
            )}
          </>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {answerChoices.map((choice) => {
          const isSelectedChoice = choice === selectedAnswer;
          const isCorrectChoice = choice === correctAnswer;

          let buttonClass = "rounded-xl border p-4 text-left hover:bg-gray-100";

          if (isAnswered && isCorrectChoice) {
            buttonClass = "rounded-xl border border-green-500 bg-green-100 p-4 text-left";
          } else if (isAnswered && isSelectedChoice && !isCorrectChoice) {
            buttonClass = "rounded-xl border border-red-500 bg-red-100 p-4 text-left";
          }

          return (
            <button
              key={choice}
              type="button"
              onClick={() => handleAnswer(choice)}
              className={buttonClass}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6">
          <p className="mb-4 font-medium">
            {isCorrect ? "Correct!" : `Not quite. Answer: ${correctAnswer}`}
          </p>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="rounded-xl bg-black px-5 py-3 text-white hover:bg-gray-800"
          >
            Next question
          </button>
        </div>
      )}
    </section>
  );
}