import { useCallback, useRef, useState } from "react";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  const start = useCallback(async () => {
    if (!audioRef.current) {
      const audio = new Audio(`${import.meta.env.BASE_URL}audio/bg.mp3`);
      audio.loop = true;
      audio.volume = 0.38;
      audioRef.current = audio;
    }

    setStarted(true);

    try {
      await audioRef.current.play();
    } catch {
      /* Autoplay can still fail; the mute control remains available. */
    }
  }, []);

  const toggle = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  return { start, toggle, muted, started };
}
