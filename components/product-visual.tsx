import Image from "next/image";
import { ImageIcon, Radiation, Stethoscope, SunMedium } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "radiation" | "medical" | "energy";

const icons = { radiation: Radiation, medical: Stethoscope, energy: SunMedium } as const;
const tints: Record<Category, string> = {
  radiation: "from-[#e8edf3] to-[#d5dee9]",
  medical: "from-[#e5eff0] to-[#d0e2e4]",
  energy: "from-[#eef0e2] to-[#dde3c9]",
};

/**
 * Product image, or a clean branded placeholder (model code + category icon)
 * until a photo is dropped into /public/images/products/<slug>.webp
 */
export function ProductVisual({
  image,
  name,
  code,
  category,
  comingLabel,
  sizes,
  priority,
  large,
  className,
}: {
  image?: string | null;
  name: string;
  code: string | null;
  category: Category;
  comingLabel: string;
  sizes: string;
  priority?: boolean;
  large?: boolean;
  className?: string;
}) {
  const Icon = icons[category];
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-white", className)}>
        <Image src={image} alt={name} fill sizes={sizes} priority={priority} className="object-contain p-[8%]" />
      </div>
    );
  }
  return (
    <div className={cn("relative isolate overflow-hidden bg-gradient-to-br", tints[category], className)} aria-hidden>
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgb(11_24_40/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(11_24_40/0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
      <Icon
        strokeWidth={0.7}
        className={cn(
          "absolute text-navy/[0.09]",
          large ? "-right-[10%] -bottom-[12%] size-[75%]" : "-right-[12%] -bottom-[14%] size-[70%]",
        )}
      />
      <div className={cn("relative flex h-full flex-col justify-between", large ? "p-8 sm:p-10" : "p-5")}>
        <span
          className={cn(
            "grid place-items-center rounded-[0.55rem] bg-white/70 text-navy backdrop-blur",
            large ? "size-12" : "size-9",
          )}
        >
          <Icon className={large ? "size-6" : "size-[18px]"} strokeWidth={1.6} />
        </span>
        <div>
          {code && (
            <p
              className={cn(
                "font-medium tracking-[-0.04em] break-words text-navy",
                large ? "text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95]" : "text-[1.65rem] leading-none",
              )}
            >
              {code}
            </p>
          )}
          <p className={cn("flex items-center gap-1.5 text-navy/50", large ? "mt-4 text-sm" : "mt-2 text-xs")}>
            <ImageIcon className="size-3.5" />
            {comingLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
