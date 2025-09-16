import { redirect } from "next/navigation";
import RedirectString from "../../../../components/RedirectString";
import UserCard from "../../../../components/UserCard";
import { searchUsers } from "../../../../lib/actions/searchUsers";

// const users = [
//   {
//     id: "1",
//     username: "alex",
//     number: "12344556667",
//     publicId: "3892fkjri34kl23",
//     profileImg: "https://picsum.photos/id/1015/300/200",
//     isQUser: true,
//   },
//   {
//     id: "2",
//     username: "alex",
//     number: "12344556667",
//     publicId: "3892fkjri34kl23",
//     profileImg: "https://picsum.photos/id/1015/300/200",
//     isQUser: false,
//   },
// ];
export default async function SearchUser({
  searchParams,
}: {
  searchParams: { input: string };
}) {
  const { input } = searchParams;
  if (!input || input.trim().length === 0) {
    redirect("/home");
  }

  const res = await searchUsers(input);
  if (res.status !== 200) {
    alert(res.msg);
    redirect("/home");
  }
  const users = res.users;

  return (
    <div className="px-5 pb-5">
      <div className="flex  text-2xl">
        <RedirectString label="Home" to={"/home"} />
        <div>/</div>
        <div className="text-gray-700 font-semibold ">Search: {input}</div>
      </div>
      {users.length === 0 ? (
        <div className="flex justify-center items-center md:text-4xl sm:text-2xl text-xl text-gray-600 h-[calc(100vh-15rem)] w-full">
          No Users Found
        </div>
      ) : (
        <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 lg:gap-5 md:gap-3 gap-1">
          {users.map((u) => (
            <UserCard
              key={u.id}
              id={u.id}
              profileImg={u.profileImg}
              username={u.username}
              email={u.email}
              publicId={u.publicId}
              isQUser={u.isAQUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}
