"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="relative py-24 md:py-40 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-blue-500 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-t from-emerald-500 to-transparent"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 opacity-0 animate-fadeInUp animation-delay-200">
        <div className="text-center">
          <span className="inline-block px-4 py-1.5 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-6">
            Our responsibility
          </span>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 hover:scale-105 transform transition-transform duration-300">
            OUR MISSION
          </h2>

          <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We aim to access cutting-edge technology and deliver quality products with reliable services to Mongolia, while honoring human health and environmental sustainability.
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
      </div>
      </section>
  );
}