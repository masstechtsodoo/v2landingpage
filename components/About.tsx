import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function About() {
  return (
    <section className="py-16 md:py-32 bg-gray-50" id="#about">
      <div className="mx-auto max-w-5xl px-6">
        
        <div className="text-center opacity-0 animate-fadeInUp animate-delay-300">
            
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4 transition-transform transform hover:-translate-y-1 duration-300 ease-in-out">
            ABOUT COMPANY
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto mb-8">
            “Mass Tech” LLC is a nuclear instruments distributor in Mongolia that was established in 2017 and provides radiation sources, radiation measurement instruments, and equipment for the fields of mining, industry, radioactive minerals, medical diagnosis and treatment, road and lodging research, environmental monitoring and border customs sectors that use ionizing radiation sources and is a company engaged in the supply and sale of protective clothing for radiation safety from the world’s leading manufacturers with official authorization.
Our company has professional and qualified personnel who have obtained bachelor’s and master’s degrees in nuclear technology, nuclear engineering, and electronics at home and abroad. In strengthening the material bas of the nuclear technology industry and localizing high technology in Mongolia, we work with public and private sector organizations to provide professional guidance and advice on the quality and safety of supplied goods, conduct training, and repair and maintain radiation measurement equipment and devices.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="transition transform hover:-translate-y-1 hover:ring-2 hover:ring-blue-500 duration-300 ease-in-out">
              <Link href="/">
                <span>Go Back Home</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="transition transform hover:-translate-y-1 hover:ring-2 hover:ring-gray-400 duration-300 ease-in-out"
            >
              <Link href="/">
                <span>Book Demo</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s forwards;
        }
        .animate-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </section>
  );
}
