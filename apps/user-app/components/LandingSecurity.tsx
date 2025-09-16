"use client";

import {
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function LandingSecurity() {
  const textControls = useAnimation();
  const [textRef, textInView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  useEffect(() => {
    if (textInView) {
      textControls.start("visible");
    } else {
      textControls.start("hidden");
    }
  }, [textControls, textInView]);
  const ref = useRef<HTMLDivElement>(null);

  const y = useMotionValue(0);
  const scale = useTransform(y, [0, 1], [1, 1.3]);

  const smoothScale = useSpring(scale, { stiffness: 100, damping: 20 });

  useEffect(() => {
    if (!ref.current) return;

    const top = ref.current.getBoundingClientRect().top + window.scrollY;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const relativeY = scrollPos + window.innerHeight - top;
      const progress = Math.min(relativeY / window.innerHeight, 1);
      y.set(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [y]);
  return (
    <section
      id="security"
      className="h-screen w-full flex items-center flex-col p-20"
    >
      <div
        ref={ref}
        className="w-[80vw] h-[45vh] flowing-gradient flex items-center justify-center rounded-full overflow-hidden"
      >
        <div className="rounded-full w-[70vw] h-[40vh] overflow-hidden ">
          <motion.img
            src={"/assets/thinker.jpg"}
            style={{ scale: smoothScale }}
            className=" w-full h-full object-cover object-top rounded-full shadow-xl "
            alt="securityImg"
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <motion.div
          ref={textRef}
          initial="hidden"
          animate={textControls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-8xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent text-center pb-5"
        >
          Stop overthinking, start trusting
        </motion.div>

        <motion.div
          initial="hidden"
          animate={textControls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
          className="text-2xl font-semibold text-gray-700 lg:w-3xl"
        >
          Don’t get stuck thinking about safety. YourPay handles your payments
          and banking, giving you peace of mind with every transaction.
        </motion.div>
      </div>
    </section>
  );
}
