"use client";
import Image from "next/image";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function LandingSpens() {
  const imgs = [
    "/assets/s1.jpg",
    "/assets/s2.jpg",
    "/assets/s3.jpg",
    "/assets/s4.jpg",
    "/assets/s5.jpg",
    "/assets/s6.jpg",
  ];
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);
  return (
    <section
      ref={ref}
      id="spendings"
      className="h-screen w-full flex items-center flowing-gradient rounded-tr-full transition-all duration-300"
    >
      <div className="grid grid-col-1 lg:grid-cols-2 p-20 gap-10">
        <div className="col-span-1">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-8xl font-semibold text-white"
          >
            Smarter Way to Manage Spendings
          </motion.div>
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-2xl font-semibold text-gray-400 mt-10"
          >
            Track, analyze, and manage your spendings in real time. Stay on top
            of your budget while making every transaction count toward your
            goals
          </motion.div>
        </div>
        <div className="md:col-span-1 hidden lg:flex">
          <div className="flex items-center justify-center relative px-40 rounded-full text-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-30"
            >
              <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
            </svg>

            {imgs.map((src, i) => {
              const angle = (i * 360) / imgs.length;
              const orbitStyle = {
                transform: ` rotate(${angle}deg) translate(12rem) rotate(-${angle}deg)`,
              };
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-30 h-30  "
                  style={orbitStyle}
                >
                  <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={controls}
                    variants={{
                      hidden: { opacity: 0, scale: 0 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    {" "}
                    <Image
                      src={src}
                      fill
                      className="object-center object-cover rounded-full shadow-2xl  "
                      alt={`spendingsImg-${i}`}
                    ></Image>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
