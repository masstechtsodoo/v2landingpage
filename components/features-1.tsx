import { Settings2, Sparkles, Zap } from "lucide-react";

export default function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="features">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    {/* Section Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 transition-transform duration-500 hover:scale-105 cursor-pointer">
        Our Business Areas
      </h2>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Comprehensive solutions for radiation detection, security systems, and laboratory equipment
      </p>
    </div>

    {/* Business Cards */}
    <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
      {[
        {
          icon: <Zap className="size-8 text-red-400 dark:text-red-400 transition-transform group-hover:rotate-6" />,
          title: "Radiation Detection",
          description: "Complete solutions for radiation measurement, equipment supply, maintenance, and protection clothing.",
        },
        {
          icon: <Settings2 className="size-8 text-red-400 dark:text-red-400 transition-transform group-hover:rotate-6" />,
          title: "Security Equipment",
          description: "Advanced X-ray scanners and metal detection systems for comprehensive security solutions.",
        },
        {
          icon: <Sparkles className="size-8 text-red-400 dark:text-red-400 transition-transform group-hover:rotate-6" />,
          title: "Laboratory Equipment",
          description: "Specialized equipment for mining, analytical, and construction material testing laboratories.",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
        >
          <div className="mb-4">{item.icon}</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

  );
}
