import type { CSSProperties } from "react";
import { MAGIC_WORDS } from "../../constants";
import { useStory } from "../../context/StoryContext";

const TILTS = [-1.6, 1.2, -0.7, 1.5, -1.1, 0.8, -0.5];

function InkText({ text }: { text: string }) {
  const split = text.match(/^(.*?)(\s(?:❤️|🌚)+)$/u);
  if (!split) return text;
  return (
    <>
      {split[1]}
      <span className="magic-emoji">{split[2]}</span>
    </>
  );
}

export function ChapterWords() {
  const { words, reduced } = useStory();
  const open = words || reduced;

  return (
    <article className={`sheet-page sheet-page--words ${open ? "is-open" : ""}`}>
      <header className="sheet-top">
        <span>03 / 04</span>
        <span>chapter three · a few words</span>
      </header>
      <div className="sheet-copy">
        <p className="note-kicker">Written in ink</p>
        <h2 className="words-heading">our magic words</h2>
      </div>
      <ul className="magic-words">
        {MAGIC_WORDS.map((line, index) => (
          <li
            key={line.text}
            className={`magic-line magic-line--${line.lang}`}
            lang={line.lang}
            dir={line.lang === "ar" ? "rtl" : "ltr"}
            style={{
              "--i": index,
              "--tilt": `${TILTS[index]}deg`,
            } as CSSProperties}
          >
            <InkText text={line.text} />
          </li>
        ))}
      </ul>
      <p className="words-blessing" lang="ar" dir="rtl">
        كل سنه وانت طيبه يا احلى عروسة
      </p>
    </article>
  );
}
