import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TypographyProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

function Typography<T extends ElementType>({
  as,
  children,
  className,
  baseClassName,
  ...props
}: TypographyProps<T> & { baseClassName: string }) {
  const Component = as ?? "p";

  return (
    <Component className={cn(baseClassName, className)} {...props}>
      {children}
    </Component>
  );
}

export function PageTitle<T extends ElementType = "h1">(props: TypographyProps<T>) {
  return (
    <Typography
      as="h1"
      baseClassName="text-[28px] font-bold leading-tight tracking-normal text-white"
      {...props}
    />
  );
}

export function PageSubtitle<T extends ElementType = "p">(props: TypographyProps<T>) {
  return (
    <Typography
      as="p"
      baseClassName="text-sm font-normal leading-5 text-zinc-400"
      {...props}
    />
  );
}

export function SectionTitle<T extends ElementType = "h2">(props: TypographyProps<T>) {
  return (
    <Typography
      as="h2"
      baseClassName="text-[18px] font-semibold leading-6 text-white"
      {...props}
    />
  );
}

export function CardTitle<T extends ElementType = "h3">(props: TypographyProps<T>) {
  return (
    <Typography
      as="h3"
      baseClassName="text-base font-semibold leading-snug text-white"
      {...props}
    />
  );
}

export function BodyText<T extends ElementType = "p">(props: TypographyProps<T>) {
  return (
    <Typography
      as="p"
      baseClassName="text-[15px] font-normal leading-6 text-white"
      {...props}
    />
  );
}

export function SupportingText<T extends ElementType = "p">(props: TypographyProps<T>) {
  return (
    <Typography
      as="p"
      baseClassName="text-sm font-normal leading-5 text-zinc-400"
      {...props}
    />
  );
}

export function Caption<T extends ElementType = "p">(props: TypographyProps<T>) {
  return (
    <Typography
      as="p"
      baseClassName="text-xs font-normal leading-4 text-zinc-500"
      {...props}
    />
  );
}

export function MetricValue<T extends ElementType = "p">(props: TypographyProps<T>) {
  return (
    <Typography
      as="p"
      baseClassName="text-[22px] font-bold leading-tight tabular-nums text-white"
      {...props}
    />
  );
}

export function LabelText<T extends ElementType = "span">(props: TypographyProps<T>) {
  return (
    <Typography
      as="span"
      baseClassName="text-sm font-medium leading-5 text-zinc-300"
      {...props}
    />
  );
}
