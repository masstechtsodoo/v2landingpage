import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroHeader } from "@/components/hero8-header";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section className="relative bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
  <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
    <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:flex-row lg:items-center">
      <div className="mx-auto max-w-xl text-center lg:mx-0 lg:w-1/2 lg:text-left">
        <h1
          className="mt-8 text-balance text-5xl font-bold tracking-tight transition-transform duration-700 hover:scale-105 md:text-6xl lg:mt-0 xl:text-7xl cursor-pointer"
        >
          MASSTECH LLC
        </h1>
        <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
          We will localize the world’s best technologies in our country and meet the demands of customers.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
          <Button asChild size="lg" className="px-6 text-base">
            <Link href="/">
              <span className="whitespace-nowrap">Start Building</span>
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="px-6 text-base">
            <Link href="/">
              <span className="whitespace-nowrap">Request a demo</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative mt-12 lg:mt-0 lg:ml-auto lg:w-1/2">
        <Image
          src="/images/bg.jpg"
          alt="Abstract Object"
          width={450}
          height={450}
          className="mx-auto w-full max-w-sm lg:max-w-md lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>
    </div>
  </div>
</section>


        <section className="bg-background pb-16 md:pb-32 dark:bg-gray-950">
  <div className="group relative m-auto max-w-6xl px-6">
    <div className="flex flex-col items-center md:flex-row">
      
      <div className="md:max-w-44 md:border-r md:pr-6 mb-4 md:mb-0">
        <p className="text-end text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">
          Our Partners
        </p>
      </div>

      <div className="relative py-2 md:w-[calc(100%-11rem)] ">
        <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
          {[
            { src: "nvidia.svg", alt: "Nvidia", w: 20, h: 5 },
            { src: "column.svg", alt: "Column", w: 16, h: 4 },
            { src: "github.svg", alt: "GitHub", w: 16, h: 4 },
            { src: "nike.svg", alt: "Nike", w: 20, h: 5 },
            { src: "lemonsqueezy.svg", alt: "Lemon Squeezy", w: 20, h: 5 },
            { src: "laravel.svg", alt: "Laravel", w: 16, h: 4 },
            { src: "lilly.svg", alt: "Lilly", w: 28, h: 7 },
            { src: "openai.svg", alt: "OpenAI", w: 24, h: 6 },
          ].map((logo, index) => (
            <div key={index} className="flex px-6">
              <Image
                className="h-auto max-h-6 w-auto dark:invert transition-opacity duration-300 hover:opacity-80 "
                src={`https://html.tailus.io/blocks/customers/${logo.src}`}
                alt={`${logo.alt} Logo`}
                width={logo.w}
                height={logo.h}
              />
            </div>
          ))}
        </InfiniteSlider>

        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <ProgressiveBlur
          className="pointer-events-none absolute left-0 top-0 h-full w-20 dark:bg-gray-950"
          direction="left"
          blurIntensity={1}
        />
        <ProgressiveBlur
          className="pointer-events-none absolute right-0 top-0 h-full w-20 dark:bg-gray-950"
          direction="right"
          blurIntensity={1}
        />
      </div>
    </div>
  </div>
</section>

      </main>
    </>
  );
}
