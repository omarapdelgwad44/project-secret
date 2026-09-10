import { useEffect, useState } from "react";

function measureBook() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (vw < 860) {
    const width = Math.min(332, Math.max(268, vw - 40));
    const height = Math.min(width * 1.44, Math.max(400, vh * 0.56));
    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  const height = Math.min(620, Math.max(500, vh * 0.7));
  const width = Math.round(height / 1.42);
  return { width, height: Math.round(height) };
}

export function useBookSize() {
  const [size, setSize] = useState(measureBook);

  useEffect(() => {
    const onResize = () => setSize(measureBook());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
}
