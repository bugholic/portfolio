import { createContext, useContext } from "react";
import { JumbleHeading, type HeadingLine } from "./JumbleHeading";

/** Position of the enclosing section in this visit's shuffled order (1-based). */
export const SectionNumber = createContext(0);

type SectionHeaderProps = {
  label: string;
  title: HeadingLine[];
  aside?: React.ReactNode;
  /** Less space under the title, for sections that should fit one screen */
  tight?: boolean;
};

export function SectionHeader({ label, title, aside, tight }: SectionHeaderProps) {
  const number = useContext(SectionNumber);
  return (
    <div className={tight ? "mb-8 md:mb-10" : "mb-14 md:mb-20"}>
      <div className="flex items-center justify-between border-t border-line pt-5">
        <span className="eyebrow">
          <span className="text-accent">({String(number).padStart(2, "0")})</span> {label}
        </span>
        {aside && <span className="eyebrow hidden sm:block">{aside}</span>}
      </div>
      <JumbleHeading
        lines={title}
        className={`${tight ? "mt-6" : "mt-8"} max-w-5xl font-display text-[clamp(2.5rem,6.5vw,6rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em]`}
      />
    </div>
  );
}
