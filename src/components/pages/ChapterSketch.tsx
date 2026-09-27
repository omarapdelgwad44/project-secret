import { useStory } from "../../context/StoryContext";
import { DragonSketch } from "./DragonSketch";

export function ChapterSketch() {
  const { name, sketch, reduced } = useStory();

  return (
    <article className={`sheet-page sheet-page--sketch ${sketch || reduced ? "is-open" : ""}`}>
      <header className="sheet-top">
        <span>02 / 04</span>
        <span>chapter two · a quiet sketch</span>
      </header>
      <div className="sheet-copy">
        <p className="note-kicker">Drawn by hand</p>
        <h2 className="note-title">A little watch</h2>
      </div>
      <div className="sheet-art sheet-art--sketch">
        <DragonSketch name={name} revealed={sketch} reduced={reduced} />
      </div>
      <p className="sketch-note">
        We met just a few <span className="sketch-emoji">days ago ✨</span>, but they
        already feel like the best of my <span className="sketch-emoji">life 🌙</span>.
        I'm willing to make beautiful memories with you ❤️🌚
      </p>
    </article>
  );
}
