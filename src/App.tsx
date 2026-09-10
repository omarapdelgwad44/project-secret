import { useCallback, useState } from "react";
import { BookScene } from "./components/BookScene";
import { GiftScene } from "./components/GiftScene";
import { NightSky } from "./components/NightSky";
import { SoundToggle } from "./components/SoundToggle";
import { BIRTHDAY_NAME } from "./constants";
import { useAudio } from "./hooks/useAudio";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function App() {
  const [scene, setScene] = useState<"gift" | "book">("gift");
  const [opening, setOpening] = useState(false);
  const [name, setName] = useState(BIRTHDAY_NAME);
  const [storyKey, setStoryKey] = useState(0);
  const reduced = usePrefersReducedMotion();
  const audio = useAudio();

  const openGift = useCallback(() => {
    if (opening) return;
    setOpening(true);
    void audio.start();
    window.setTimeout(() => setScene("book"), reduced ? 160 : 1080);
  }, [audio, opening, reduced]);

  const replay = useCallback(() => {
    setScene("gift");
    setOpening(false);
    setStoryKey((key) => key + 1);
  }, []);

  return (
    <div className={`app app--${scene}`}>
      <NightSky />
      <div className="grain" aria-hidden="true" />
      {audio.started ? (
        <SoundToggle muted={audio.muted} onToggle={audio.toggle} />
      ) : null}
      {scene === "gift" ? (
        <GiftScene
          name={name}
          opening={opening}
          reduced={reduced}
          onOpen={openGift}
        />
      ) : (
        <BookScene
          key={storyKey}
          name={name}
          reduced={reduced}
          onNameChange={setName}
          onReplay={replay}
        />
      )}
    </div>
  );
}
