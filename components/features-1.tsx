import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings2, Sparkles, Zap } from "lucide-react";
import { ReactNode } from "react";

export default function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Our Business Areas
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive solutions for radiation detection, security systems, and laboratory equipment
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <BusinessCard 
            icon={<Zap className="size-6" />}
            title="Radiation Detection"
            description="Complete solutions for radiation measurement, equipment supply, maintenance, and protection clothing."
          />
          
          <BusinessCard 
            icon={<Settings2 className="size-6" />}
            title="Security Equipment"
            description="Advanced X-ray scanners and metal detection systems for comprehensive security solutions."
          />
          
          <BusinessCard 
            icon={<Sparkles className="size-6" />}
            title="Laboratory Equipment"
            description="Specialized equipment for mining, analytical, and construction material testing laboratories."
          />
        </div>
      </div>
    </section>
  );
}

const BusinessCard = ({
  icon,
  title,
  description
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="group transition-all hover:shadow-lg hover:-translate-y-1">
    <CardHeader className="items-center pb-4">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
    </CardHeader>
    <CardContent className="text-center">
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
);