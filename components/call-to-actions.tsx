"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToActions() {
  return (
    <section className="py-16 md:py-32 bg-gray-50">
      <div className="mx-auto max-w-5xl px-6">
        
        <div className="text-center opacity-0 animate-fadeInUp animate-delay-300">
            <span className="inline-block px-4 py-1.5 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-6">
            Our Commitment
          </span>
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4 transition-transform transform hover:-translate-y-1 duration-300 ease-in-out">
            OUR VISION
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto mb-8">
            We will localize the world’s best technologies in our country and to meet the demands of customers.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="transition transform hover:-translate-y-1 hover:ring-2 hover:ring-blue-500 duration-300 ease-in-out">
              <Link href="/">
                <span>Gets Started</span>
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
