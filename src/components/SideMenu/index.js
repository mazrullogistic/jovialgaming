"use client";
import {
  getProfileDataAction,
  leaveRoomAction,
} from "@/redux/dashboard/action";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useToaster from "@/hooks/useToaster";
import { EmitterKey, TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";
import EventEmitter from "@/components/EventEmitter";

import Loader from "@/components/Loader";
import { PATH_AUTH, PATH_DASHBOARD } from "@/routes/paths";
import {
  getData,
  getRoomId,
  removeData,
  setCreate,
  setRoomID,
} from "@/utils/storage";
import { userData } from "@/redux/Auth/AuthSlice";
import NotificationDialog from "@/components/NotificationDialog";
export default function SideMenu({ children }) {
  const [editMode, setEditMode] = useState(false);

  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("Home"); // Initialize with null or some default value
  const [profileData, setProfileData] = useState(null); // Initialize with null or some default value

  const dispatch = useDispatch();
  const { toaster } = useToaster();
  const [user, setUser] = useState(null);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);

  useEffect(() => {
    // Only run this on the client side
    const storedUser = getData("user");
    dispatch(userData(storedUser));
    getProfile();
    setUser(storedUser);
  }, []);
  // const isLoader = useSelector((state) => state.dashboardReducer.isLoading);
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  // Function to handle menu item click
  const handleMenuItemClick = (title) => {
    console.log("title", title);
    setSelectedItem(title); // Update selected item state
    if (title === "Create") {
      setCreate("create", "");
    }
    if (title === "Notification") {
      setOpenNotificationDialog(true);
    }
    if (title === "Leave Room") {
      leaveRoomApi();
      // Perform the specific action for "Leave Room" click here
      console.log("Leave Room clicked");
      // You can add your custom logic here, such as navigating to a different page or showing a confirmation dialog
    }
  };
  useEffect(() => {
    EventEmitter.on(EmitterKey.profile, (res) => {
      getProfile();
    });
  }, []);
  const logOut = async () => {
    removeData("user");
    router.replace(PATH_AUTH.login);
  };
  const getProfile = async () => {
    try {
      const storedUser = getData("user");

      //const res = await dispatch(getGameByConsoleAction(param));
      const res = await dispatch(getProfileDataAction(storedUser?.data?.id));
      console.log("res.payload.data 72", res.payload.data);
      if (res.payload.status) {
        setProfileData(res.payload.data);
      } else {
        console.log("res--> 133");
        setIsLoader(false);
      }
    } catch (error) {
      console.log("Error", error);
    }
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
      src: "/images/home.svg",
    },
    {
      href: "/messages",
      title: "Messages",
      src: "/images/chat.svg",
    },
    {
      href: "",
      title: "Notification",
      src: "/images/notification.svg",
    },
    {
      href: "/createGame",
      title: "Create",
      src: "/images/add.svg",
    },
    {
      href: "/ranking",
      title: "Ranking",
      src: "/images/trophywhite.svg",
    },
    {
      href: "/tracker",
      title: "Tracker", 
      src: "/images/agenda.svg",
    },
    {
      href: "/subscription",
      title: "Subscriptions",
      src: "/images/payment.svg",
    },
    {
      href: "/disputeCenter",
      title: "Dispute center",
      src: "/images/dispute.svg",
    },
    {
      href: "/about",
      title: "About",
      src: "/images/about.svg",
    },
  ];

  const userDataNew = useSelector((state) => state.userData.userData);
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
              className="flex flex-col md:flex-row items-center p-4 space-y-4 md:space-y-0 md:space-x-4"
            >
              <div className="flex-shrink-0">
                <img
                  src={userDataNew?.data?.image}
                  alt="Profile"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover max-w-full"
                />
              </div>
              <div className="text-white text-center md:text-left">
                <p className="text-base md:text-lg font-semibold">
                  {userDataNew?.data?.username}
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  ${profileData?.data?.balance}
                </p>
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
                    className="drawer-txt-container flex items-center  "
                    onClick={leaveRoomApi}
                  >
                    <Image
                      src="/images/leaveroom.svg"
                      className="h-6 w-6 md:h-[12%] md:w-[12%]"
                      width={100}
                      height={100}
                      alt="Leave Room"
                    />
                    <p className="drawer-txt">{"Leave Room"}</p>
                  </li>
                  <li
                    className="drawer-txt-container flex items-center   mb-8  "
                    onClick={logOut}
                  >
                    <Image
                      src="/images/logout.svg"
                      className="h-6 w-6 md:h-[12%] md:w-[12%] "
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
      {/* Render the notification modal */}
      <NotificationDialog
        open={openNotificationDialog}
        onClose={() => setOpenNotificationDialog(false)}
      />
    </div>
  );
}
