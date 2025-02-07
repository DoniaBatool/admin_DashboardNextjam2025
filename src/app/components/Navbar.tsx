"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getFeedback, getLowStockProducts, getOrders } from "../../../utils/notificationsApi";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js"; // Import User type

// Define Notification type
type Notification = {
  message: string;
  id: string;
};

const Navbar = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [user, setUser] = useState<User | null>(null); // Supabase User type
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        const [ordersData, feedbacksData, lowStockData] = await Promise.all([
          getOrders(),
          getFeedback(),
          getLowStockProducts(),
        ]);

        const storedReadNotifications: string[] = JSON.parse(localStorage.getItem("readNotifications") || "[]");

        const newNotifications: Notification[] = [];

        if (ordersData.length > 0 && !storedReadNotifications.includes("orders")) {
          newNotifications.push({ message: `${ordersData.length} new orders pending.`, id: "orders" });
        }

        if (feedbacksData.length > 0 && !storedReadNotifications.includes("feedback")) {
          newNotifications.push({ message: `${feedbacksData.length} new feedback received.`, id: "feedback" });
        }

        if (lowStockData.length > 0 && !storedReadNotifications.includes("lowStock")) {
          newNotifications.push({ message: `${lowStockData.length} products are low on stock.`, id: "lowStock" });
        }

        setNotifications(newNotifications);

        newNotifications.forEach((notif) => toast.success(notif.message));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

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
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="/Dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <Link href="/Notification" className="hover:text-gray-300">
              🔔 Notifications ({notifications.length})
            </Link>
            <div>
              {user ? (
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
                  Logout
                </button>
              ) : (
                <button onClick={() => router.push("/login")} className="bg-blue-500 px-4 py-2 rounded">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
