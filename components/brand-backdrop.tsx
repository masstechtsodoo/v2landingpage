import { cn } from "@/lib/utils";

/**
 * Branded dark background used until real photography is supplied.
 * Layered glows + slowly rotating orbit rings echo the atom in the Mass Tech logo.
 */
export function BrandBackdrop({ className, rings = true }: { className?: string; rings?: boolean }) {
  return (
    <div aria-hidden className={cn("grain absolute inset-0 overflow-hidden bg-ink", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_10%,#1f3a5f_0%,transparent_55%),radial-gradient(90%_70%_at_0%_100%,#12304d_0%,transparent_60%)]" />
      <div className="absolute top-[12%] right-[8%] size-[38rem] rounded-full bg-accent/[0.10] blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[30%] size-[30rem] rounded-full bg-coral/[0.08] blur-[120px]" />
      {/* fine grid */}
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]" />
      {rings && (
        <svg
          viewBox="0 0 800 800"
          className="absolute top-[38%] right-[-18rem] h-[140%] max-h-[64rem] -translate-y-1/2 text-white sm:right-[-10rem] lg:right-[-4rem]"
          fill="none"
        >
          <g className="origin-center animate-[spin_120s_linear_infinite] motion-reduce:animate-none" style={{ transformBox: "fill-box" }}>
            {[0, 60, 120].map((r) => (
              <ellipse
                key={r}
                cx="400"
                cy="400"
                rx="360"
                ry="128"
                transform={`rotate(${r} 400 400)`}
                stroke="currentColor"
                strokeOpacity="0.14"
                strokeWidth="1.2"
              />
            ))}
            <circle cx="88" cy="220" r="7" fill="#ef5a55" fillOpacity="0.85" />
            <circle cx="712" cy="220" r="5" fill="#ef5a55" fillOpacity="0.6" />
            <circle cx="400" cy="760" r="6" fill="#ef5a55" fillOpacity="0.7" />
          </g>
          {/* nucleus – hidden on phones so it never sits behind body text */}
          <g className="hidden sm:block">
            <circle cx="400" cy="400" r="26" fill="#f3df6c" fillOpacity="0.85" />
            <circle cx="400" cy="400" r="70" fill="#f3df6c" fillOpacity="0.06" />
          </g>
          <circle cx="400" cy="400" r="150" stroke="currentColor" strokeOpacity="0.06" />
        </svg>
      )}
    </div>
  );
}
