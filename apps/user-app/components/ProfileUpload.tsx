"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { handleProfileUpload } from "../lib/actions/profileUpload";
import { getUserDetails } from "../lib/actions/userDetails";

export default function ProfileUpload() {
  const [url, setUrl] = useState(
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  );

  useEffect(() => {
    const fetchProfileImg = async () => {
      const { img } = await getUserDetails();
      if (img) {
        setUrl(img);
      } else {
        setUrl(
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        );
      }
    };
    fetchProfileImg();
  }, []);

  return (
    <div className="space-y-4 relative w-fit h-fit">
      <CldUploadWidget
        uploadPreset="yourPay"
        options={{ folder: "profile_imgs" }}
        onSuccess={async (result) => {
          const info = result.info as CloudinaryUploadWidgetInfo;
          setUrl(info.secure_url);
          try {
            await handleProfileUpload(info.secure_url);
          } catch (e) {
            console.error(
              "Error encountered:",
              e instanceof Error ? e.message : e
            );
            alert("Error encountered");
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="cursor-pointer z-1 absolute bottom-0 right-[-2] button text-white bg-purple-500 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full px-2 py-2 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        )}
      </CldUploadWidget>

      {url && (
        <div className=" relative w-35 h-35 mt-5 ">
          <Image
            src={url}
            alt="upload"
            className=" rounded-full object-center object-cover "
            fill
          />
        </div>
      )}
    </div>
  );
}
