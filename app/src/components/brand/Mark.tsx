type Props = {
  size?: number;
  className?: string;
  /** Use the two-tone (Deep Blue + Borderless Blue) version */
  twoTone?: boolean;
  /** Render in solid white (for dark backgrounds) */
  knockout?: boolean;
};

export function Mark({
  size = 28,
  className,
  twoTone = true,
  knockout = false,
}: Props) {
  const a = knockout ? "#FFFFFF" : "#075ABD";
  const b = knockout ? "#FFFFFF" : twoTone ? "#054086" : "#075ABD";
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {/* Four-blade pinwheel — money moving across borders */}
      <path d="M50 50 L50 8 Q66 12 66 34 Q66 50 50 50Z" fill={a} />
      <path d="M50 50 L92 50 Q88 66 66 66 Q50 66 50 50Z" fill={b} />
      <path d="M50 50 L50 92 Q34 88 34 66 Q34 50 50 50Z" fill={a} />
      <path d="M50 50 L8 50 Q12 34 34 34 Q50 34 50 50Z" fill={b} />
    </svg>
  );
}
