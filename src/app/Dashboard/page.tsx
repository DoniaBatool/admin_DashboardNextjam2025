"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoMdAnalytics } from "react-icons/io";
import { FaBoxOpen, FaUsers, FaMailBulk, FaComments, FaStar, FaShippingFast, FaWarehouse, FaBoxes } from "react-icons/fa"; 
import Orders from "../components/Orders";
import Customers from "../components/Customer";
import Products from "../components/Product";
import MailingList from "../components/MailingList";
import FeedbackComponent from "../components/FeedbackComponent";
import Reviews from "../components/Reviews";
import Analytics from "../components/Analytics";
import CategoryList from "../components/Category";
import { User } from "@supabase/supabase-js"; // ✅ Import User type from Supabase

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null); // ✅ Properly typed
  const [activeTab, setActiveTab] = useState<string>("orders"); // ✅ Explicit string type
  const router = useRouter();

  useEffect(() => {
    const checkUser = async (): Promise<void> => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login"); // ✅ Redirect to login if not authenticated
      } else {
        setUser(data.user);
      }
    };

    checkUser();
  }, [router]);

  if (!user) return <p className="text-center text-xl font-semibold">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-[#2A254B] text-white flex-shrink-0">
        <div className="px-4 py-8 text-center">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-sm mt-2">Logged in as: {user.email}</p> {/* ✅ Show logged-in admin email */}
        </div>
        <nav className="flex flex-col space-y-4 px-4 py-6">
          {/* Sidebar links */}
          <Link href="#" onClick={() => setActiveTab("orders")} className={`flex items-center space-x-2 text-lg cursor-pointer ${activeTab === "orders" ? "text-blue-400" : ""}`}>
            <FaBoxOpen size={20} />
            <span>Orders</span>
          </Link>
          <Link href="#" onClick={() => setActiveTab("users")} className={`flex items-center space-x-2 text-lg cursor-pointer ${activeTab === "users" ? "text-blue-400" : ""}`}>
            <FaUsers size={20} />
            <span>Users</span>
          </Link>
          <Link href="#" onClick={() => setActiveTab("mailingList")} className={`flex items-center space-x-2 text-lg cursor-pointer ${activeTab === "mailingList" ? "text-blue-400" : ""}`}>
            <FaMailBulk size={20} />
            <span>Mailing List</span>
          </Link>
          <Link href="#" onClick={() => setActiveTab("feedbacks")} className={`flex items-center space-x-2 text-lg cursor-pointer ${activeTab === "feedbacks" ? "text-blue-400" : ""}`}>
            <FaComments size={20} />
            <span>Feedbacks</span>
          </Link>
          <Link href="#" onClick={() => setActiveTab("reviews")} className={`flex items-center space-x-2 text-lg cursor-pointer ${activeTab === "reviews" ? "text-blue-400" : ""}`}>
            <FaStar size={20} />
            <span>Reviews & Ratings</span>
          </Link>
          <Link href="#" onClick={() => setActiveTab("analytics")} className={`flex items-center space-x-2 text-lg cursor-pointer ${activeTab === "analytics" ? "text-blue-400" : ""}`}>
            <IoMdAnalytics size={20} />
            <span>Analytics</span>
          </Link>
          <Link href="#" onClick={() => setActiveTab("inventory")} className={`flex items-center space-x-2 text-lg cursor-pointer ${activeTab === "inventory" ? "text-blue-400" : ""}`}>
            <FaWarehouse size={20} />
            <span>Inventory</span>
          </Link>
          <Link href="#" onClick={() => setActiveTab("shipment")} className={`flex items-center space-x-2 text-lg cursor-pointer ${activeTab === "shipment" ? "text-blue-400" : ""}`}>
            <FaShippingFast size={20} />
            <span>Shipment</span>
          </Link>
          <Link href="#" onClick={() => setActiveTab("category")} className={`flex items-center space-x-2 text-lg cursor-pointer ${activeTab === "category" ? "text-blue-400" : ""}`}>
            <FaBoxes size={20} />
            <span>Category</span>
          </Link>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Dynamic content based on the selected tab */}
        {activeTab === "orders" && <Orders />}
        {activeTab === "users" && <Customers />}
        {activeTab === "inventory" && <Products />}
        {activeTab === "mailingList" && <MailingList />}
        {activeTab === "feedbacks" && <FeedbackComponent />}
        {activeTab === "reviews" && <Reviews />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "category" && <CategoryList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
