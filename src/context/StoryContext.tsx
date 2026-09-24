import { createContext, useContext } from "react";

export type StoryContextValue = {
  name: string;
  reduced: boolean;
  rose: boolean;
  sketch: boolean;
  words: boolean;
  cake: boolean;
  wished: boolean;
  onWish: () => void;
  onReplay: () => void;
};

export const StoryContext = createContext<StoryContextValue | null>(null);

export function useStory() {
  const value = useContext(StoryContext);
  if (!value) {
    throw new Error("useStory must be used within StoryContext");
  }
  return value;
}
