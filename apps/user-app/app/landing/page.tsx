"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import YourPayIcon from "../../components/Icon";
import LandingPay from "../../components/LandingPay";
import LandingSpens from "../../components/LandingSpens";
import LandingWallet from "../../components/LandingWallet";
import LandingSecurity from "../../components/LandingSecurity";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Landing() {
  const imgChange = useMemo(
    () => [
      "/assets/home.png",
      "/assets/payment.png",
      "/assets/trnxs.png",
      "/assets/wallet.png",
    ],
    []
  );
  const [showTitle, setShowTitle] = useState(false);
  const [webImg, setWebImg] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setShowTitle(true);
  }, []);
  useEffect(() => {
    const inter = setInterval(() => {
      setWebImg((prev) => (prev + 1) % imgChange.length);
    }, 3000);
    return () => clearInterval(inter);
  }, [imgChange]);

  return (
    <div className="">
      <nav className="fixed top-0 left-0 w-full bg-white z-50 flex justify-between items-center px-8 py-4 shadow-md">
        <div className=" text-purple-600 font-semibold text-3xl w-full flex gap-x-4">
          <div>
            <YourPayIcon size={40} />
          </div>{" "}
          YourPay
        </div>

        <div className="hidden lg:flex gap-10  w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent text-xl font-semibold">
          <a
            href="#payments"
            className=" hover:text-shadow-purple-500 hover:text-shadow-xs"
          >
            Payments
          </a>

          <a
            href="#spendings"
            className=" hover:text-shadow-purple-500 hover:text-shadow-xs"
          >
            Spendings
          </a>
          <a
            href="#wallet"
            className=" hover:text-shadow-purple-500 hover:text-shadow-xs"
          >
            Wallet
          </a>

          <a
            href="#security"
            className=" hover:text-shadow-purple-500 hover:text-shadow-xs"
          >
            Security
          </a>
          <a
            href="#contact"
            className=" hover:text-shadow-purple-500 hover:text-shadow-xs text-nowrap"
          >
            Contact Us
          </a>
        </div>

        <div className="flex gap-4 w-full justify-end">
          <a
            href="/signin"
            className=" text-purple-600 border-2 hover:bg-purple-600 hover:text-white border-purple-600 px-4 py-2 rounded-lg font-semibold"
          >
            Log In
          </a>
          <a
            href="/signin"
            className="flowing-gradient text-white px-4 py-2 rounded-lg "
          >
            Get Started
          </a>
        </div>
      </nav>
      <section
        id="main"
        className="relative flex items-center justify-center h-screen w-full flowing-gradient rounded-br-full transition-all duration-300 flex-col pt-20 "
      >
        <div
          className={` rounded-4xl flex items-center justify-center transition-all duration-1000  ${showTitle ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="text-6xl font-semibold lg:w-3xl text-center text-white mt-5">
            Your money, Your control, Your freedom in Your hand
          </div>
        </div>
        <div
          className={`w-[60vw] relative h-[60vh] my-10 transition-all duration-1000 ${showTitle ? "scale-100 opacity-100" : "scale-80 opacity-0"}`}
        >
          {imgChange.map((src, index) => (
            <Image
              key={index}
              src={src}
              fill
              alt={`landing-${index}`}
              className={`object-center object-cover rounded-4xl transition-opacity duration-1000 shadow-2xl
        ${index === webImg ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            />
          ))}
        </div>
      </section>
      <LandingPay />
      <LandingSpens />
      <LandingWallet />
      <LandingSecurity />
      <div
        id="contact"
        className="w-full h-[50vh] flowing-gradient p-10 flex flex-col relative "
      >
        <div className="flex justify-between">
          <div className="flex flex-col text-white w-full">
            <div className="text-5xl  font-semibold">Contact us</div>
            <div className="flex items-center gap-4 mt-10 text-xl font-semibold">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-7"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>+917050070859</div>
            </div>
            <div className="flex items-center gap-4 mt-10 text-xl font-semibold">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="M19.5 22.5a3 3 0 0 0 3-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 1 1-.712 1.321l-5.683-3.06a1.5 1.5 0 0 0-1.422 0l-5.683 3.06a.75.75 0 0 1-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 0 0 3 3h15Z" />
                  <path d="M1.5 9.589v-.745a3 3 0 0 1 1.578-2.642l7.5-4.038a3 3 0 0 1 2.844 0l7.5 4.038A3 3 0 0 1 22.5 8.844v.745l-8.426 4.926-.652-.351a3 3 0 0 0-2.844 0l-.652.351L1.5 9.589Z" />
                </svg>
              </div>
              <div>priyanshubharti2185@gmail.com</div>
            </div>
            <div className="flex items-center gap-4 mt-10 text-xl font-semibold">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>123 Maplewood Lane, Sunnyvale, CA 94086, USA</div>
            </div>
          </div>
          <div>
            <div className=" text-white font-semibold text-8xl w-full flex gap-x-4">
              <div>
                <YourPayIcon size={120} />
              </div>{" "}
              YourPay
            </div>
            <div className="flex items-center gap-5 justify-center">
              <div className="bg-white rounded-md p-1 w-fit">
                <FaFacebookF className="w-9 h-9 text-purple-600  cursor-pointer" />
              </div>
              <div className="bg-white rounded-md p-1 w-fit">
                <svg
                  className="w-9 h-9 text-purple-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                </svg>
              </div>
              <div className="bg-white rounded-md p-1 w-fit">
                <FaInstagram className="w-9 h-9 text-purple-600  cursor-pointer" />
              </div>
              <div className="bg-white rounded-md p-1 w-fit">
                <FaLinkedinIn className="w-9 h-9 text-purple-600  cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 not-only:text-white text-2xl mt-10 flex justify-center w-full font-semibold ">
          Copyright © 2025 all rights reserved
        </div>
      </div>
      <div
        className={`fixed bottom-20 right-20 rounded-2xl bg-gray-900  text-gray-300 p-3 transition-all duration-500 ${showButton ? " opacity-90 translate-y-0" : " opacity-0 translate-y-5 pointer-events-none"}`}
      >
        <a href="#main" className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-7"
          >
            <path
              fillRule="evenodd"
              d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
