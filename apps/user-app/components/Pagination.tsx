"use client";

interface PaginationProps {
  page: number;
  totalPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total: number;
}

export default function Pagination({
  page,
  totalPage,
  setPage,
  total,
}: PaginationProps) {
  return (
    <div className="my-5 flex w-full justify-between items-center">
      <div className="font-semibold text-xl">
        Showing {total > page * 10 ? page * 10 : total} from {total}{" "}
      </div>
      <div className="flex justify-between items-center bg-gray-100 rounded-full px-2 py-1.5 gap-3">
        <div>
          <button
            className={` cursor-pointer rounded-full flex items-center justify-center shadow-md bg-white w-9 h-9 font-semibold  ${page > 1 ? "text-purple-500 hover:text-white hover:bg-purple-500" : "text-gray-500"}`}
            disabled={page === 1}
            onClick={() => {
              if (page != 1) {
                setPage((prev) => prev - 1);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
              />
            </svg>
          </button>
        </div>
        {Array.from({ length: totalPage }, (_, i) => (
          <PageButton
            key={i}
            onClick={() => setPage(i + 1)}
            label={i + 1}
            isActive={page === i + 1}
          />
        ))}
        <div>
          <button
            className={` cursor-pointer rounded-full flex items-center justify-center shadow-md bg-white w-9 h-9 font-semibold  ${page < totalPage ? "text-purple-500 hover:text-white hover:bg-purple-500 " : "text-gray-500"}`}
            disabled={page === totalPage}
            onClick={() => {
              if (page != totalPage) {
                setPage((prev) => prev + 1);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

interface PageButtonProps {
  label: number;
  onClick: () => void;
  isActive: boolean;
}

function PageButton({ label, onClick, isActive }: PageButtonProps) {
  return (
    <div>
      <button
        className={` cursor-pointer rounded-full  w-9 h-9 font-bold hover:text-white hover:bg-purple-500 shadow-md ${isActive ? " bg-purple-500 text-white" : "bg-white text-gray-500"}`}
        onClick={() => onClick()}
      >
        {label}
      </button>
    </div>
  );
}
