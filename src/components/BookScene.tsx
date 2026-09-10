import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Star,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import HTMLFlipBook, { type FlipBookApi } from "react-pageflip";
import { StoryContext } from "../context/StoryContext";
import { useBookSize } from "../hooks/useBookSize";
import { BookPage } from "./BookPage";
import { NameEditor } from "./NameEditor";
import { CoverPage } from "./pages/CoverPage";
import { ChapterOne } from "./pages/ChapterOne";
import { ChapterTwo } from "./pages/ChapterTwo";

type BookSceneProps = {
  name: string;
  reduced: boolean;
  onNameChange: (name: string) => void;
  onReplay: () => void;
};

const STAGES = ["cover", "note", "wish"] as const;

export function BookScene({
  name,
  reduced,
  onNameChange,
  onReplay,
}: BookSceneProps) {
  const bookRef = useRef<HTMLFlipBook>(null);
  const flippingRef = useRef(false);
  const size = useBookSize();
  const [page, setPage] = useState(0);
  const [wished, setWished] = useState(false);
  const [rose, setRose] = useState(false);
  const [cake, setCake] = useState(false);

  const atCover = page === 0;
  const atWish = page === 2;
  const atEnd = page === 2 && wished;
  const canAdvance = !atWish || wished;

  const nextLabel = useMemo(() => {
    if (atEnd) return "Restart";
    if (atCover) return "Open the book";
    if (atWish && !wished) return "Wish first";
    return "Turn the page";
  }, [atCover, atEnd, atWish, wished]);

  const story = useMemo(
    () => ({
      name,
      reduced,
      rose,
      cake,
      wished,
      onWish: () => setWished(true),
      onReplay,
    }),
    [cake, name, onReplay, reduced, rose, wished]
  );

  const getApi = (): FlipBookApi | null => {
    const book = bookRef.current;
    if (!book || typeof book.pageFlip !== "function") return null;
    return book.pageFlip();
  };

  const flipTo = (index: number) => {
    const api = getApi();
    if (!api) return;
    const current = api.getCurrentPageIndex();
    const target = Math.max(0, Math.min(index, api.getPageCount() - 1));
    if (target === current) return;
    if (target > current) {
      api.flipNext("bottom");
      return;
    }
    if (current === api.getPageCount() - 1) {
      api.turnToPage(target);
      setPage(target);
      return;
    }
    api.flipPrev("bottom");
    window.setTimeout(() => {
      if (flippingRef.current) return;
      if (api.getCurrentPageIndex() === current && current > 0) {
        api.turnToPage(target);
        setPage(target);
      }
    }, 50);
  };

  const onFlip = (event: { data: number }) => {
    setPage(event.data);
    if (event.data >= 1) setRose(true);
    if (event.data >= 2) setCake(true);
  };

  const onNext = () => {
    if (atEnd) {
      onReplay();
      return;
    }
    if (!canAdvance) return;
    flipTo(page + 1);
  };

  const bookPages = useMemo(
    () => [
      <BookPage key="cover" className="page-cover" density="hard">
        <CoverPage />
      </BookPage>,
      <BookPage key="one" className="page-sheet">
        <ChapterOne />
      </BookPage>,
      <BookPage key="two" className="page-sheet">
        <ChapterTwo />
      </BookPage>,
    ],
    []
  );

  return (
    <StoryContext.Provider value={story}>
      <section className="book-scene">
        <header className="book-header">
          <div className="brand">
            <p className="brand-mark">
              storybook
              <Star size={13} strokeWidth={1.6} aria-hidden="true" />
            </p>
            <p className="brand-sub">birthday edition · vol. 01</p>
          </div>
          <NameEditor name={name} onChange={onNameChange} />
        </header>

        <div className="book-layout">
          <aside className="book-copy">
            <p className="copy-label">a little something</p>
            <h1 className="copy-title">
              For {name},
              <em>make a wish.</em>
            </h1>
            <p className="copy-body">
              A small story for a very special day.
            </p>
            <ol className="progress" aria-label="Story progress">
              {STAGES.map((stage, index) => (
                <li key={stage} className={index <= page ? "is-on" : ""}>
                  <span className="progress-dot" />
                  <span className="sr-only">{stage}</span>
                </li>
              ))}
            </ol>
            <p className="page-readout" aria-live="polite">
              {atCover ? "the cover" : `page 0${page} / 02`}
            </p>
          </aside>

          <div className="book-stage">
            <div
              className="book-frame"
              style={{ width: size.width, height: size.height }}
            >
              <div className="book-thickness" aria-hidden="true" />
              <HTMLFlipBook
                key={`${size.width}x${size.height}`}
                ref={bookRef}
                className="flipbook"
                style={{ width: "100%", height: "100%" }}
                width={size.width}
                height={size.height}
                size="fixed"
                minWidth={size.width}
                maxWidth={size.width}
                minHeight={size.height}
                maxHeight={size.height}
                startPage={0}
                drawShadow
                flippingTime={reduced ? 200 : 900}
                usePortrait
                showCover
                autoSize={false}
                maxShadowOpacity={0.55}
                mobileScrollSupport
                clickEventForward
                useMouseEvents={false}
                disableFlipByClick={false}
                showPageCorners={false}
                swipeDistance={4000}
                startZIndex={1}
                renderOnlyPageLengthChange
                onFlip={onFlip}
                onChangeState={(event) => {
                  flippingRef.current =
                    event.data === "flipping" || event.data === "user_fold";
                }}
              >
                {bookPages}
              </HTMLFlipBook>
            </div>

            <div className="book-nav">
              <button
                type="button"
                className="nav-action"
                onClick={() => flipTo(page - 1)}
                disabled={atCover}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} strokeWidth={1.8} />
                Previous
              </button>
              <button
                type="button"
                className="nav-action nav-action--primary"
                onClick={onNext}
                disabled={!atEnd && !canAdvance}
                aria-label={nextLabel}
              >
                {atEnd ? (
                  <RotateCcw size={16} strokeWidth={1.8} />
                ) : atCover ? (
                  <BookOpen size={16} strokeWidth={1.8} />
                ) : atWish && !wished ? (
                  <Sparkles size={16} strokeWidth={1.8} />
                ) : (
                  <ArrowRight size={16} strokeWidth={1.8} />
                )}
                {nextLabel}
              </button>
            </div>
          </div>
        </div>
      </section>
    </StoryContext.Provider>
  );
}
