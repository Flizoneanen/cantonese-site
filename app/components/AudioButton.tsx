"use client";

type AudioButtonProps = {
  src: string;
};

export default function AudioButton({ src }: AudioButtonProps) {
  function playAudio() {
    const audio = new Audio(src);
    audio.play();
  }

  return (
    <button
      type="button"
      onClick={playAudio}
      className="mt-4 rounded-full border px-4 py-2 text-sm hover:bg-gray-100"
    >
      🔊 Play
    </button>
  );
}