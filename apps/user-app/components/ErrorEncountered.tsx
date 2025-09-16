export default function ErrorEncountered({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="bg-red-700 w-full p-5 text-white font-semibold my-2 rounded-xl flex">
      <div className="w-full"> {label}</div>
      <div className="">
        <button onClick={onClick} className=" cursor-pointer">
          {" "}
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
