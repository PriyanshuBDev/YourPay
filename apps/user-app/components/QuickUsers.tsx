import { useEffect, useState } from "react";
import { QUser } from "./QuickTransfer";
import { getQuickUsers } from "../lib/actions/quickUsers";
import Image from "next/image";
import { UserProps } from "./PaymentPage";
import "./QuickTransfer.css";

interface Props {
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
}

// const Users: QUser[] = [
//   {
//     id: "1",
//     profileImg: "https://picsum.photos/id/1015/300/200",
//     username: "Alexkjk",
//     email: "12",
//     publicId: "fjj",
//   },
//   {
//     id: "2",
//     profileImg: "https://picsum.photos/id/1014/300/200",
//     username: "Alex",
//     email: "12",
//     publicId: "fjj",
//   },
//   {
//     id: "3",
//     profileImg: "https://picsum.photos/id/1013/300/200",
//     username: "Alex",
//     email: "12",
//     publicId: "fjj",
//   },
//   {
//     id: "4",
//     profileImg: "https://picsum.photos/id/1012/300/200",
//     username: "Alex",
//     email: "12",
//     publicId: "fjj",
//   },
//   {
//     id: "5",
//     profileImg: "https://picsum.photos/id/1011/300/200",
//     username: "Alex",
//     email: "12",
//     publicId: "fjj",
//   },
//   {
//     id: "6",
//     profileImg: "https://picsum.photos/id/1010/300/200",
//     username: "Alex",
//     email: "12",
//     publicId: "fjj",
//   },
//   {
//     id: "7",
//     profileImg: "https://picsum.photos/id/1016/300/200",
//     username: "Alex",
//     email: "12",
//     publicId: "fjj",
//   },
//   {
//     id: "8",
//     profileImg: "https://picsum.photos/id/1018/300/200",
//     username: "Alex",
//     email: "malenia2185@gmail.com",
//     publicId: "AB12CD34EF56GH78",
//   },
// ];

export default function QuickUsers({ setUser }: Props) {
  const [loading, setLoading] = useState(true);
  const [qUsers, setQUsers] = useState<QUser[]>([]);
  useEffect(() => {
    async function handleFetching() {
      const qUsers = await getQuickUsers();
      setQUsers(qUsers.map((q) => q.qUser));
      setLoading(false);
    }
    handleFetching();
  }, []);
  if (loading) {
    return (
      <div
        className="bg-white w-full rounded-2xl p-5 sm:p-6 lg:p-8 mt-5 max-w-xl"
        style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
      >
        <div className="text-gray-600 text-lg flex w-full justify-center h-32 items-center">
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white w-full rounded-2xl p-5 sm:p-3 lg:p-5 mt-8 sm:mt-10 max-w-xl "
      style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
    >
      <div className="text-lg font-semibold">Quick Users:</div>
      {qUsers.length === 0 && (
        <div className="flex w-full h-full justify-center items-center text-lg text-gray-700 py-10">
          No Quick Users Found
        </div>
      )}
      <div className="overflow-x-auto scrollbar-custom pb-4">
        <div
          className={`flex gap-3 mt-3 ${
            qUsers.length < 4 ? "justify-center" : "justify-start"
          }`}
        >
          {qUsers.map((q: QUser) => (
            <div key={q.id} className="flex-shrink-0">
              <div className="inline-flex justify-center w-full ">
                <div
                  className={` flex flex-col py-3 px-5 items-center rounded-lg overflow-hidden focus:outline-none  focus:ring-2 focus:ring-purple-400 hover:bg-purple-300`}
                  onClick={() => {
                    setUser(q);
                  }}
                >
                  <div>
                    <div className="relative md:w-15 md:h-15 w-10 h-10 rounded-xl overflow-hidden">
                      <Image
                        src={q.profileImg}
                        alt="Profile Pic"
                        className="object-center object-cover"
                        fill
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    </div>
                  </div>
                  <div className="text-wrap text-sm mt-2">{q.username}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
