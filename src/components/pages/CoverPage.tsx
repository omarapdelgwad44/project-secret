import { useStory } from "../../context/StoryContext";

export function CoverPage() {
  const { name } = useStory();

  return (
    <article className="cover-page">
      <div className="cover-frame">
        <div className="cover-frame-inner">
          <p className="cover-kicker">Once upon a birthday</p>
          <h2 className="cover-title">
            Story of
            <span>{name}</span>
          </h2>
          <p className="cover-wish">one little wish, a thousand beautiful moments</p>
          <p className="cover-footer">October 5 · 2026</p>
        </div>
      </div>
    </article>
  );
}
