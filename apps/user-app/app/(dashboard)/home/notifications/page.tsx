import NotificationPage from "../../../../components/NotificationPage";
import RedirectString from "../../../../components/RedirectString";

export default function Notifications() {
  return (
    <div className="px-5 pb-5">
      <div className="flex  text-2xl">
        <RedirectString label="Home" to={"/home"} />
        <div>/</div>
        <div className="text-gray-700 font-semibold ">Notifications: </div>
      </div>
      <div className="w-full">
        <NotificationPage />
      </div>
    </div>
  );
}
