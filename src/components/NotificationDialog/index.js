import { getNotificationListAction } from "@/redux/dashboard/action";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const NotificationDialog = ({ open, onClose }) => {
  if (!open) return null; // Don't render if the modal is not open

  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const [notificationTimes, setNotificationTimes] = useState({});

  useEffect(() => {
    getNotificationList();
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
    const now = moment();
    const past = moment(pastTimestamp);

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
    try {
      const object = {
        page: 1,
        limit: 10,
      };

      const res = await dispatch(getNotificationListAction(object));

      if (res) {
        setNotifications(res.payload.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      onClick={onClose} // Close modal on overlay click
    >
      <div
        className="bg-black26 text-white rounded-lg w-full md:w-[30%] max-w-md h-full md:h-auto overflow-y-auto p-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-lg font-bold mb-4">Notifications</h2>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <span className="text-xs text-gray82">
                    {notificationTimes[notification.createdAt]}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-center">No notifications available</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDialog;
