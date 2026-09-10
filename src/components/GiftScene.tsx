import { ArrowRight, Gift } from "lucide-react";
import { BIRTHDAY_DATE } from "../constants";

type GiftSceneProps = {
  name: string;
  opening: boolean;
  reduced: boolean;
  onOpen: () => void;
};

export function GiftScene({ name, opening, reduced, onOpen }: GiftSceneProps) {
  return (
    <section className={`gift-scene ${opening ? "is-opening" : ""}`} aria-busy={opening}>
      <div className="gift-copy rise">
        <p className="hero-kicker">A little something, just for you</p>
        <h1 className="hero-title">
          <span>Happy Birthday</span>
          <em>{name}</em>
        </h1>
      </div>

      <div className={`gift-orbit ${reduced ? "is-still" : ""}`}>
        <div className="gift-glow" aria-hidden="true" />
        <div className={`gift ${opening ? "is-opening" : ""}`} aria-hidden="true">
          <div className="gift-lid">
            <div className="bow">
              <span className="bow-loop bow-loop--l" />
              <span className="bow-loop bow-loop--r" />
              <span className="bow-knot" />
              <span className="bow-tail bow-tail--l" />
              <span className="bow-tail bow-tail--r" />
            </div>
            <div className="lid-ribbon lid-ribbon--v" />
            <div className="lid-face" />
          </div>
          <div className="gift-body">
            <div className="body-ribbon body-ribbon--v" />
            <div className="body-ribbon body-ribbon--h" />
          </div>
          <div className="gift-tag">{BIRTHDAY_DATE}</div>
          <div className="gift-plinth" />
        </div>
      </div>

      <button
        type="button"
        className="open-gift"
        onClick={onOpen}
        disabled={opening}
        aria-label="Open your gift"
      >
        <Gift size={18} strokeWidth={1.7} />
        <span>Open your gift</span>
        <ArrowRight size={18} strokeWidth={1.7} />
      </button>
    </section>
  );
}
