import { forwardRef, PropsWithChildren } from "react";

type BookPageProps = PropsWithChildren<{
  className?: string;
  density?: "hard" | "soft";
}>;

export const BookPage = forwardRef<HTMLDivElement, BookPageProps>(function BookPage(
  { children, className = "", density = "soft" },
  ref
) {
  return (
    <div ref={ref} className={`book-page ${className}`} data-density={density}>
      {children}
    </div>
  );
});
