import Image from "next/image";

export default function ContentSection() {
  const services = [
    {
      title: "Radiation Measurement",
      description: "Sales and maintenance of instruments for measuring all types of radiation (alpha, beta, gamma, neutron).",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Geophysical Surveys",
      description: "Borehole geophysical surveys for coal, water, uranium, and other exploratory research wells.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Radiation Protection",
      description: "Sales of protection equipment, lead shields fabrication, and professional training services.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Environmental Analysis",
      description: "Professional radiation measurement and consulting services for environmental protection.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    },
    {
      title: "Laboratory Research",
      description: "Comprehensive analysis of air, water, soil, building materials, and food samples.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
            Our Services
          </span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Professional Radiation Solutions
          </h2>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Trusted services for accurate measurement and comprehensive protection
          </p>
        </div>

        <div className="grid gap-16 md:grid-cols-2 items-center">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
            <Image
              src="/payments.png"
              className="hidden object-cover w-full h-full dark:block"
              alt="Radiation measurement equipment"
              width={1207}
              height={929}
              priority
            />
            <Image
              src="/payments-light.png"
              className="object-cover w-full h-full dark:hidden"
              alt="Radiation measurement equipment"
              width={1207}
              height={929}
              priority
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              {services.map((service, index) => (
                <div key={index} className="group relative pl-9">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{service.description}</p>
                </div>
              ))}
            </div>

            {/* <div className="pt-4">
              <button className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Contact Our Experts
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}