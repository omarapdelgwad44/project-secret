import { useStory } from "../../context/StoryContext";
import { RoseName } from "./RoseName";

export function ChapterOne() {
  const { name, rose, reduced } = useStory();

  return (
    <article className="sheet-page">
      <header className="sheet-top">
        <span>01 / 02</span>
        <span>chapter one · the day begins</span>
      </header>
      <div className="sheet-copy">
        <p className="note-kicker">A note for</p>
        <h2 className="note-title">Happy Birthday</h2>
      </div>
      <div className="sheet-art sheet-art--name">
        <RoseName name={name} revealed={rose} reduced={reduced} />
      </div>
      <p className="note-body">
        May today feel soft and golden,
        <br />
        like the first page of your story.
      </p>
    </article>
  );
}
