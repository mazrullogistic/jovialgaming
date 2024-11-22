"use client";
import { useEffect, useState } from "react";
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
import { leaveRoomAction } from "@/redux/dashboard/action";
import { TOAST_TYPES } from "@/constants/keywords";
import { toast } from "react-toastify";

export default function SideMenu({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoader, setIsLoader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
  const [selectedItem, setSelectedItem] = useState("Home");
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);

  const userDataNew = useSelector((state) => state.userData.userData);

  useEffect(() => {
    const storedUser = getData("user");
    dispatch(userData(storedUser));
  }, [dispatch]);

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
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {isLoader ? (
        <Loader />
      ) : (
        <>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden bg-gray-800 text-white p-3"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Sidebar */}
          <div
            className={`fixed md:static top-0 left-0 bg-black06 transition-transform transform ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 z-50 w-3/4 md:w-[16%] h-screen overflow-y-auto border-b-2 md:border-b-0 md:border-r-2 border-[#474747]`}
          >
            <div className="flex items-center p-4">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={45}
                height={45}
                className="logo-img"
              />
              <button
                onClick={() => router.push("/profileCard")}
                className="ml-4 flex items-center"
              >
                <img
                  src={userDataNew?.data?.image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <p className="text-white font-semibold">
                    {userDataNew?.data?.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${userDataNew?.data?.balance}
                  </p>
                </div>
              </button>
            </div>
            <nav>
              <ul className="space-y-4 p-4">
                {menuItems.map(({ href, title, src }) => (
                  <li key={title}>
                    <Link href={href} passHref>
                      <div
                        className={`flex items-center space-x-3 ${
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
                <li
                  className="flex items-center space-x-3 text-white cursor-pointer"
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
                <li
                  className="flex items-center space-x-3 text-white cursor-pointer"
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
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 md:w-[84%] p-4">
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
