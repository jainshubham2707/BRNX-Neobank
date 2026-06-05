import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  action?: ReactNode;
};

export function Section({ title, action, className, children, ...rest }: Props) {
  return (
    <section className={cn("px-4", className)} {...rest}>
      {(title || action) && (
        <header className="flex items-center justify-between mb-2.5 mt-1">
          <h2 className="font-display font-semibold text-[15px] text-ink tracking-tight">
            {title}
          </h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
