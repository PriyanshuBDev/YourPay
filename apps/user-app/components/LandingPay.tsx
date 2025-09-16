"use client";
import Image from "next/image";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function LandingPay() {
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
    <section id="payments" className="h-screen w-full flex items-center ">
      <div className="grid grid-col-1 lg:grid-cols-2 p-20 ">
        {" "}
        <div className="md:col-span-1 hidden lg:flex">
          <div className="grid grid-cols-2 grid-rows-2 gap-x-5 ">
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-50 relative h-50 col-span-1"
            >
              <Image
                src="/assets/p1.jpg"
                fill
                className="object-center object-cover rounded-2xl shadow-2xl "
                alt="paymentImg"
              ></Image>
            </motion.div>
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-60 h-60 flex justify-center items-center"
            >
              <div className="border-4 border-purple-600 rounded-full flex justify-center items-center p-2 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-15"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                  />
                </svg>
              </div>
            </motion.div>
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-60 h-60 flex justify-center items-center"
            >
              <div className="border-4 border-purple-600 rounded-full flex justify-center items-center px-6 py-2 text-6xl text-purple-600">
                ₹
              </div>
            </motion.div>
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, x: -100 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-50 relative h-50  col-span-1"
            >
              <Image
                src="/assets/p2.jpg"
                fill
                className="object-cover object-left rounded-2xl shadow-2xl "
                alt="paymentImg"
              ></Image>
            </motion.div>
          </div>
        </div>
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
            className="text-8xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent"
          >
            Pay anyone, anytime, instantly
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
            className="text-2xl font-semibold text-gray-700 mt-10"
          >
            Send money to friends or pay merchants in seconds. Secure, simple,
            and reliable,YourPay keeps your transactions effortless
          </motion.div>
        </div>
      </div>
    </section>
  );
}
