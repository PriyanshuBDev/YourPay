"use client";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function LandingWallet() {
  // controls for top image
  const topControls = useAnimation();
  const [topRef, topInView] = useInView({ threshold: 0.2, triggerOnce: false });

  // controls for bottom image
  const bottomControls = useAnimation();
  const [bottomRef, bottomInView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  // controls for text
  const textControls = useAnimation();
  const [textRef, textInView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  useEffect(() => {
    if (topInView) topControls.start("visible");
    else topControls.start("hidden");
  }, [topInView, topControls]);

  useEffect(() => {
    if (bottomInView) bottomControls.start("visible");
    else bottomControls.start("hidden");
  }, [bottomInView, bottomControls]);

  useEffect(() => {
    if (textInView) textControls.start("visible");
    else textControls.start("hidden");
  }, [textInView, textControls]);

  return (
    <section id="wallet" className="h-screen w-full flex items-center">
      <div className="grid grid-col-1 lg:grid-cols-2 p-20">
        {/* LEFT SIDE */}
        <div className="md:col-span-1 hidden lg:flex relative">
          <div className="flex items-center justify-center w-full relative">
            {/* static svg */}
            <div className="p-8 border-4 border-purple-600 text-purple-600 rounded-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                />
              </svg>
            </div>

            {/* top image */}
            <motion.div
              ref={topRef}
              initial="hidden"
              animate={topControls}
              variants={{
                hidden: { opacity: 0, x: 100, y: 100 },
                visible: { opacity: 1, x: 0, y: 0 },
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute -top-20 left-20 w-40 h-40"
            >
              <Image
                src="/assets/w1.jpg"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                alt="paymentImg"
              />
            </motion.div>
            <motion.div
              ref={topRef}
              initial="hidden"
              animate={topControls}
              variants={{
                hidden: { opacity: 0, x: -100, y: 100 },
                visible: { opacity: 1, x: 0, y: 0 },
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute -top-20 right-20 w-40 h-40"
            >
              <Image
                src="/assets/w2.jpg"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                alt="paymentImg"
              />
            </motion.div>
            <motion.div
              ref={bottomRef}
              initial="hidden"
              animate={bottomControls}
              variants={{
                hidden: { opacity: 0, x: 100, y: -100 },
                visible: { opacity: 1, x: 0, y: 0 },
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute -bottom-20 left-20 w-40 h-40"
            >
              <Image
                src="/assets/w3.jpg"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                alt="paymentImg"
              />
            </motion.div>

            <motion.div
              ref={bottomRef}
              initial="hidden"
              animate={bottomControls}
              variants={{
                hidden: { opacity: 0, x: -100, y: -100 },
                visible: { opacity: 1, x: 0, y: 0 },
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute -bottom-20 right-20  w-40 h-40"
            >
              <Image
                src="/assets/w4.jpg"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                alt="paymentImg"
              />
            </motion.div>
          </div>
        </div>

        <div className="col-span-1">
          <motion.div
            ref={textRef}
            initial="hidden"
            animate={textControls}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-8xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent"
          >
            Your Money, Your Way
          </motion.div>

          <motion.div
            initial="hidden"
            animate={textControls}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
            className="text-2xl font-semibold text-gray-700 mt-10"
          >
            YourPay keeps your finances secure while making it easy to recharge,
            transfer, and track your money. Simple, safe, and always at your
            fingertips.
          </motion.div>
        </div>
      </div>
    </section>
  );
}
