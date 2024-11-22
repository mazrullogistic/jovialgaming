import { getNotificationListAction } from "@/redux/dashboard/action";
import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import React from "react";
import { useDispatch } from "react-redux";

const NotificationDialog = ({ open, onClose }) => {
  if (!open) return null; // Don't render if the modal is not open
  // const notifications = [
  //   {
  //     message: "Juswoo is ready to rumble. Get ready before you DQ",
  //     time: "34m",
  //     isNew: false,
  //   },
  //   { message: "Juswoo accepted your match", time: "1h", isNew: false },
  //   { message: "Match has been found !", time: "2h", isNew: false },
  //   { message: "Guti sent you a message", time: "4h", isNew: true },
  //   { message: "Guti sent you a message", time: "4h", isNew: true },
  //   { message: "Guti sent you a message", time: "4h", isNew: true },
  //   { message: "Guti sent you a message", time: "4h", isNew: true },
  //   { message: "Guti sent you a message", time: "4h", isNew: true },
  //   { message: "Guti sent you a message", time: "4h", isNew: true },
  //   { message: "Guti sent you a message", time: "4h", isNew: true },
  //   { message: "Guti sent you a message", time: "4h", isNew: true },
  //   { message: "Guti sent you a message", time: "4h", isNew: true },
  //   { message: "Guti sent you a message", time: "4h", isNew: true },
  // ];
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const [notificationTimes, setNotificationTimes] = useState({});

  var time = "";
  useEffect(() => {
    getNotificationList();
    console.log("res--> 43");

    return () => {};
  }, []);

  useEffect(() => {
    const calculateTimes = async () => {
      const times = {};
      for (let notification of notifications) {
        const timeAgo = await getTime(notification.createdAt);
        times[notification.createdAt] = timeAgo;
      }
      setNotificationTimes(times); // Store calculated times in state
    };

    calculateTimes(); // Run the async calculation when the component mounts or notifications change
  }, [notifications]);

  const getTime = async (pastTimestamp) => {
    const now = moment(); // current time
    const past = moment(pastTimestamp); // moment instance of your timestamp

    const diffInMinutes = now.diff(past, "minutes");
    let finalTime = "";

    if (diffInMinutes < 60) {
      finalTime = `${diffInMinutes} minutes ago`;
    } else {
      const diffInHours = now.diff(past, "hours");
      if (diffInHours < 24) {
        finalTime = `${diffInHours} hours ago`;
      } else {
        const diffInDays = now.diff(past, "days");
        finalTime = `${diffInDays} days ago`;
      }
    }

    return finalTime;
  };

  const getNotificationList = async () => {
    console.log("res--> 43");

    try {
      const object = {
        page: 1,
        limit: 10,
      };

      const res = await dispatch(getNotificationListAction(object));

      console.log("res--> 43", res.payload.data);

      if (res) {
        setNotifications(res.payload.data.data);
        // setRoomID("roomId", "");
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
      }
    } catch (error) {}
  };
  return (
    <div
      className="fixed left-0 top-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-start z-50 md:w-[30%]"
      onMouseLeave={() => onClose()}
    >
      <div className="bg-black26 text-white rounded-lg w-full h-full overflow-y-auto p-4">
        <div>
          <button
            className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 block md:hidden"
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="text-[20px] sm:text-[20px] lg:text-[28px] font-bold mb-2 sm:mb-4 text-center sm:text-left mt-4">
            Notifications
          </h2>
        </div>
        {notifications.map((notification, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex items-start">
              {/* {notification.isNew && (
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-2" />
              )} */}
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <span className="text-xs text-gray82">
                  {notificationTimes[notification.createdAt]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDialog;
