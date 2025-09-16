import Appbar from "../../components/Appbar";
import DashboardBtns from "../../components/DashboardBtns";

export default function dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-50 min-h-screen ">
      <div className="fixed top-0 left-0 right-0 bg-gray-50 z-40">
        <Appbar></Appbar>
      </div>
      <div className="flex pt-20">
        <div
          className={`
            fixed top-20 left-0 h-[calc(100vh-5rem)] 
            bg-gray-50 flex flex-col justify-between transition-all duration-300
             md:w-50 sm:w-0 lg:w-56 overflow-hidden w-0
          `}
        >
          <div className="pl-4 pr-2 mt-2">
            <DashboardBtns></DashboardBtns>
          </div>
        </div>
        <div
          className={`
            flex-1 p-4 overflow-y-auto h-[calc(100vh-5rem)]
             md:ml-56 sm:ml-0 ml-0 transition-all duration-300
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
