import { Mark } from "./Mark";

type Props = {
  knockout?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { mark: 22, text: "text-base" },
  md: { mark: 28, text: "text-lg" },
  lg: { mark: 36, text: "text-2xl" },
} as const;

export function Logo({ knockout = false, size = "md" }: Props) {
  const s = sizes[size];
  return (
    <div className="inline-flex items-center gap-2">
      <Mark size={s.mark} knockout={knockout} />
      <span
        className={`font-display font-bold tracking-tight ${s.text} ${
          knockout ? "text-white" : "text-brand-700"
        }`}
      >
        brnx
      </span>
    </div>
  );
}
