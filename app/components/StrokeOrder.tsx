"use client";

import { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";

type StrokeOrderProps = {
  character: string;
};

export default function StrokeOrder({ character }: StrokeOrderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<ReturnType<typeof HanziWriter.create> | null>(null);
  const shouldLoopRef = useRef(false);
  const [isLooping, setIsLooping] = useState(false);
  const [hasStrokeData, setHasStrokeData] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    shouldLoopRef.current = false;
    setIsLooping(false);
    setHasStrokeData(true);
    containerRef.current.innerHTML = "";

    try {
      writerRef.current = HanziWriter.create(containerRef.current, character, {
        width: 180,
        height: 180,
        padding: 5,
        showOutline: true,
        showCharacter: false,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 250,
        onLoadCharDataError: () => {
          setHasStrokeData(false);
        },
      });
    } catch {
      setHasStrokeData(false);
    }

    return () => {
      shouldLoopRef.current = false;
    };
  }, [character]);

  async function playAnimation() {
    if (!writerRef.current || !hasStrokeData) return;

    await writerRef.current.hideCharacter();
    await writerRef.current.animateCharacter();
  }

  async function playLoop() {
    if (!writerRef.current || !hasStrokeData) return;

    shouldLoopRef.current = true;
    setIsLooping(true);

    while (shouldLoopRef.current) {
      await writerRef.current.hideCharacter();
      await writerRef.current.animateCharacter();
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
  }

  function stopLoop() {
    shouldLoopRef.current = false;
    setIsLooping(false);
  }

  function toggleLoop() {
    if (isLooping) {
      stopLoop();
    } else {
      playLoop();
    }
  }

  if (!hasStrokeData) {
    return (
      <div className="rounded-xl border border-dashed bg-white p-4 text-center text-sm text-gray-500">
        Stroke data unavailable for{" "}
        <span className="font-bold text-gray-700">{character}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={containerRef} className="mx-auto" />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={playAnimation}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
        >
          Play
        </button>

        <button
          type="button"
          onClick={toggleLoop}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
        >
          {isLooping ? "Stop" : "Loop"}
        </button>
      </div>
    </div>
  );
}