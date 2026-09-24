import { useCallback, useState } from "react";
import { BookScene } from "./components/BookScene";
import { GiftScene } from "./components/GiftScene";
import { NightSky } from "./components/NightSky";
import { BIRTHDAY_NAME } from "./constants";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function App() {
  const [scene, setScene] = useState<"gift" | "book">("gift");
  const [opening, setOpening] = useState(false);
  const [storyKey, setStoryKey] = useState(0);
  const reduced = usePrefersReducedMotion();

  const openGift = useCallback(() => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => setScene("book"), reduced ? 160 : 1080);
  }, [opening, reduced]);

  const replay = useCallback(() => {
    setScene("gift");
    setOpening(false);
    setStoryKey((key) => key + 1);
  }, []);

  return (
    <div className={`app app--${scene}`}>
      <NightSky />
      <div className="grain" aria-hidden="true" />
      {scene === "gift" ? (
        <GiftScene
          name={BIRTHDAY_NAME}
          opening={opening}
          reduced={reduced}
          onOpen={openGift}
        />
      ) : (
        <BookScene
          key={storyKey}
          name={BIRTHDAY_NAME}
          reduced={reduced}
          onReplay={replay}
        />
      )}
    </div>
  );
}
