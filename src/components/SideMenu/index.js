"use client";
import { leaveRoomAction } from "@/redux/dashboard/action";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useToaster from "@/hooks/useToaster";
import { TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";

import Loader from "@/components/Loader";
import { PATH_AUTH, PATH_DASHBOARD } from "@/routes/paths";
import { getData, getRoomId, removeData, setRoomID } from "@/utils/storage";
export default function SideMenu({ children }) {
  const user = getData("user");
  const [editMode, setEditMode] = useState(false);

  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("Home"); // Initialize with null or some default value

  const dispatch = useDispatch();
  const { toaster } = useToaster();
  // const isLoader = useSelector((state) => state.dashboardReducer.isLoading);
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  // Function to handle menu item click
  const handleMenuItemClick = (title) => {
    console.log("title", title);
    setSelectedItem(title); // Update selected item state
    if (title === "Leave Room") {
      leaveRoomApi();
      // Perform the specific action for "Leave Room" click here
      console.log("Leave Room clicked");
      // You can add your custom logic here, such as navigating to a different page or showing a confirmation dialog
    }
  };

  const logOut = async () => {
    removeData("user");
    router.replace(PATH_AUTH.login);
  };
  const leaveRoomApi = async () => {
    setIsLoader(true);
    try {
      const roomId = getRoomId("roomId");

      const payload = new FormData();
      payload.append("roomId", roomId);
      const res = await dispatch(leaveRoomAction(payload));

      console.log("res--> 96", res);

      if (res.payload.status) {
        setRoomID("roomId", "");
        router.replace(PATH_DASHBOARD.chooseRoom);

        // setIsLoading(false);
        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoader(false);
        console.log("res--> 133");

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  const menuItems = [
    {
      href: "/home",
      title: "Home",
      src: "/images/home.png",
    },
    {
      href: "/messages",
      title: "Messages",
      src: "/images/msg.png",
    },
    {
      href: "/createGame",
      title: "Create",
      src: "/images/create.png",
    },
    {
      href: "/ranking",
      title: "Ranking",
      src: "/images/create.png",
    },
    {
      href: "/historyBook",
      title: "History Book",
      src: "/images/create.png",
    },
    {
      href: "/Subscriptions",
      title: "Subscriptions",
      src: "/images/subscription.png",
    },
    {
      href: "/disputeCenter",
      title: "Dispute center",
      src: "/images/subscription.png",
    },
    {
      href: "/about",
      title: "About",
      src: "/images/create.png",
    },
  ];

  return (
    <div>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex flex-col md:flex-row">
          <div className="bg-black06 w-full md:w-[16%] border-b-2 md:border-b-0 md:border-r-2 border-[#474747] flex flex-row md:flex-col md:sticky top-0 md:h-screen overflow-y-auto">
            <Image
              src="/images/logo.png"
              className="logo-img ml-12"
              width={45}
              height={45}
              alt="Logo"
            />
            <button
              onClick={() => router.push("/profileCard")}
              className="flex items-center ml-6"
            >
              <Image
                src={user?.data?.image}
                className="h-[70px] w-[70px] md:h-[80px] md:w-[80px] rounded-full mt-[5%] md:mt-[15%]"
                width={50}
                height={50}
                alt="Profile"
              />
              <div className="ml-6 text-white mt-8">
                <p className="text-lg font-semibold">{user?.data?.username}</p>
                <p className="text-sm text-gray-500">${user?.data?.balance}</p>
              </div>
            </button>
            <aside className="bg-fuchsia-100 w-full md:w-60">
              <nav>
                <ul className="flex md:flex-col justify-between w-full">
                  {menuItems.map(({ href, title, src }) => (
                    <li key={title} className="flex items-center">
                      <Link href={href} passHref>
                        <div
                          className="drawer-txt-container flex items-center space-x-2"
                          onClick={() => handleMenuItemClick(title)}
                        >
                          <Image
                            src={src}
                            className="h-6 w-6 md:h-[12%] md:w-[12%]"
                            width={100}
                            height={100}
                            alt={title}
                          />
                          <p
                            className={
                              selectedItem === title
                                ? "drawer-txt-blue"
                                : "drawer-txt"
                            }
                          >
                            {title}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}

                  <li
                    className="drawer-txt-container flex items-center space-x-2"
                    onClick={leaveRoomApi}
                  >
                    <Image
                      src="/images/leaveroom.png"
                      className="h-6 w-6 md:h-[12%] md:w-[12%]"
                      width={100}
                      height={100}
                      alt="Leave Room"
                    />
                    <p className="drawer-txt">{"Leave Room"}</p>
                  </li>
                  <li
                    className="drawer-txt-container flex items-center space-x-2 mb-8"
                    onClick={logOut}
                  >
                    <Image
                      src="/images/leaveroom.png"
                      className="h-6 w-6 md:h-[12%] md:w-[12%]"
                      width={100}
                      height={100}
                      alt="Logout"
                    />
                    <p className="drawer-txt">{"Logout"}</p>
                  </li>
                </ul>
              </nav>
            </aside>
          </div>
          <div className="w-full md:w-[84%] flex flex-col">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      )}
    </div>
  );
}
