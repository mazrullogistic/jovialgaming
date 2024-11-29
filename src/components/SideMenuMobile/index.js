"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import NotificationDialog from "@/components/NotificationDialog";
import Loader from "@/components/Loader";
import {
  getData,
  removeData,
  setCreate,
  setRoomID,
  getRoomId,
} from "@/utils/storage";
import { userData } from "@/redux/Auth/AuthSlice";
import {
  getProfileDataAction,
  leaveRoomAction,
} from "@/redux/dashboard/action";
import { TOAST_TYPES } from "@/constants/keywords";
import { toast } from "react-toastify";

export default function SideMenu({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoader, setIsLoader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
  const [selectedItem, setSelectedItem] = useState("Home");
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [profileData, setProfileData] = useState(null); // Initialize with null or some default value

  const userDataNew = useSelector((state) => state.userData.userData);

  const menuRef = useRef(null); // Reference for the side menu
  useEffect(() => {
    // Only run this on the client side

    getProfile();
  }, []);
  useEffect(() => {
    const storedUser = getData("user");
    dispatch(userData(storedUser));
  }, [dispatch]);

  // Close menu on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); // Close menu if the click is outside
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
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
  const logOut = () => {
    removeData("user");
    router.replace("/login");
  };

  const leaveRoomApi = async () => {
    setIsLoader(true);
    try {
      const roomId = getRoomId("roomId");
      const payload = new FormData();
      payload.append("roomId", roomId);
      const res = await dispatch(leaveRoomAction(payload));

      if (res.payload.status) {
        setRoomID("roomId", "");
        router.replace("/chooseRoom");
        toast.success(res.payload.message);
      } else {
        toast.error(res.payload.message);
      }
    } catch (error) {
      toast.error("Error leaving room.");
    } finally {
      setIsLoader(false);
    }
  };

  const menuItems = [
    { href: "/home", title: "Home", src: "/images/home.svg" },
    { href: "/messages", title: "Messages", src: "/images/chat.svg" },
    { href: "", title: "Notification", src: "/images/notification.svg" },
    { href: "/createGame", title: "Create", src: "/images/add.svg" },
    { href: "/ranking", title: "Ranking", src: "/images/trophywhite.svg" },
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
    { href: "/about", title: "About", src: "/images/about.svg" },
  ];

  const handleMenuItemClick = (title) => {
    setSelectedItem(title);
    if (title === "Create") setCreate("create", "");
    if (title === "Notification") setOpenNotificationDialog(true);
    setMenuOpen(false); // Close menu after selecting an item
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {isLoader ? (
        <Loader />
      ) : (
        <>
          {/* Mobile menu toggle */}
          <div className="bg-black06">
            <button
              className="md:hidden bg-black06 text-white p-3 w-12"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Sidebar */}
          <div
            ref={menuRef} // Reference for the menu div
            className={`fixed md:static top-0 left-0 bg-black06 transition-transform transform ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 z-50 w-3/4 md:w-[16%] h-screen overflow-y-auto border-b-2 md:border-b-0 md:border-r-2 border-[#474747]`}
          >
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
            <nav>
              <ul className="space-y-4 p-4">
                {menuItems.map(({ href, title, src }) => (
                  <li key={title}>
                    <Link href={href} passHref>
                      <div
                        className={`flex items-center space-x-3 md:mt-12 ml-2 ${
                          selectedItem === title
                            ? "text-blue-500"
                            : "text-white"
                        }`}
                        onClick={() => handleMenuItemClick(title)}
                      >
                        <Image src={src} alt={title} width={24} height={24} />
                        <span>{title}</span>
                      </div>
                    </Link>
                  </li>
                ))}
                <div>
                  <li
                    className="flex items-center space-x-3 text-white cursor-pointer  ml-2 md:mt-10"
                    onClick={leaveRoomApi}
                  >
                    <Image
                      src="/images/leaveroom.svg"
                      alt="Leave Room"
                      width={24}
                      height={24}
                    />
                    <span>Leave Room</span>
                  </li>
                </div>
                <div>
                  <li
                    className="flex items-center space-x-3 text-white cursor-pointer md:mt-10 ml-2"
                    onClick={logOut}
                  >
                    <Image
                      src="/images/logout.svg"
                      alt="Logout"
                      width={24}
                      height={24}
                    />
                    <span>Logout</span>
                  </li>
                </div>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 md:w-[84%] h-screen overflow-y-auto">
            <main className="overflow-y-auto">{children}</main>
          </div>
        </>
      )}
      <NotificationDialog
        open={openNotificationDialog}
        onClose={() => setOpenNotificationDialog(false)}
      />
    </div>
  );
}
