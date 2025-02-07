"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getFeedback, getLowStockProducts, getOrders } from "../../../utils/notificationsApi";

const Navbar = () => {
  const [notifications, setNotifications] = useState<{ message: string, id: string }[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Initially set to loading
        setLoading(true);

        // Fetch notifications data
        const [ordersData, feedbacksData, lowStockData] = await Promise.all([
          getOrders(),
          getFeedback(),
          getLowStockProducts(),
        ]);

        // Check localStorage for already read notifications
        const storedReadNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');

        const newNotifications = [];

        // Only push new notifications that have not been read yet
        if (ordersData.length > 0 && !storedReadNotifications.includes("orders")) {
          newNotifications.push({ message: `${ordersData.length} new orders pending.`, id: "orders" });
        }

        if (feedbacksData.length > 0 && !storedReadNotifications.includes("feedback")) {
          newNotifications.push({ message: `${feedbacksData.length} new feedback received.`, id: "feedback" });
        }

        if (lowStockData.length > 0 && !storedReadNotifications.includes("lowStock")) {
          newNotifications.push({ message: `${lowStockData.length} products are low on stock.`, id: "lowStock" });
        }

        // Set notifications that have not been marked as read
        setNotifications(newNotifications);

        // Show toasts only for unread notifications
        newNotifications.forEach((notif) => toast.success(notif.message));

      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        // Set loading to false once the data is fetched
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array ensures this effect runs only on mount

  // If loading, show loading spinner or fallback UI
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-[#2A254B] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">Avion Private Ltd</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/Dashboard" className="hover:text-gray-300">Dashboard</Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <Link href="/Notification" className="hover:text-gray-300">
              🔔 Notifications ({notifications.length})
            </Link>
            <Link href="/logout" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
