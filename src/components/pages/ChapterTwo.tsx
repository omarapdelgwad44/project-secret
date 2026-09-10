import { FINAL_LINE } from "../../constants";
import { useStory } from "../../context/StoryContext";
import { CakeArt } from "./CakeArt";

export function ChapterTwo() {
  const { cake, reduced, wished, onWish } = useStory();

  return (
    <article className="sheet-page sheet-page--wish">
      <header className="sheet-top">
        <span>02 / 02</span>
        <span>chapter two · make it sparkle</span>
      </header>
      <div className="wish-cluster">
        <div className="sheet-copy">
          {wished ? (
            <p className="wish-arabic" lang="ar" dir="rtl">
              {FINAL_LINE}
            </p>
          ) : (
            <>
              <h2 className="wish-title">Make a wish</h2>
              <p className="wish-body">
                Close your eyes.
                <br />
                Think of something beautiful.
              </p>
            </>
          )}
        </div>
        <div className="sheet-art sheet-art--cake">
          <CakeArt revealed={cake} reduced={reduced} wished={wished} />
          {wished ? (
            <div className="wish-stars" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        className={`wish-btn ${wished ? "is-sent" : ""}`}
        onClick={onWish}
        disabled={wished}
        aria-label={wished ? "Wish sent into the stars" : "Make a wish"}
      >
        {wished ? "Wish sent into the stars" : "Make a wish"}
      </button>
    </article>
  );
}
