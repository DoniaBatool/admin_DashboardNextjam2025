'use client';
import { useState } from "react";
import Link from "next/link";
import { IoMdAnalytics } from "react-icons/io";
import {
  FaBoxOpen,
  FaUsers,
  FaMailBulk,
  FaComments,
  FaStar,
  FaShippingFast,
  FaWarehouse,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("orders");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-[#2A254B] text-white flex-shrink-0">
        <div className="px-4 py-8 text-center">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex flex-col space-y-4 px-4 py-6">
          <Link
            href="#"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center space-x-2 text-lg cursor-pointer ${
              activeTab === "orders" ? "text-blue-400" : ""
            }`}
          >
            <FaBoxOpen size={20} />
            <span>Orders</span>
          </Link>
          <Link
            href="#"
            onClick={() => setActiveTab("users")}
            className={`flex items-center space-x-2 text-lg cursor-pointer ${
              activeTab === "users" ? "text-blue-400" : ""
            }`}
          >
            <FaUsers size={20} />
            <span>Users</span>
          </Link>
          <Link
            href="#"
            onClick={() => setActiveTab("mailingList")}
            className={`flex items-center space-x-2 text-lg cursor-pointer ${
              activeTab === "mailingList" ? "text-blue-400" : ""
            }`}
          >
            <FaMailBulk size={20} />
            <span>Mailing List</span>
          </Link>
          <Link
            href="#"
            onClick={() => setActiveTab("feedbacks")}
            className={`flex items-center space-x-2 text-lg cursor-pointer ${
              activeTab === "feedbacks" ? "text-blue-400" : ""
            }`}
          >
            <FaComments size={20} />
            <span>Feedbacks</span>
          </Link>
          <Link
            href="#"
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center space-x-2 text-lg cursor-pointer ${
              activeTab === "reviews" ? "text-blue-400" : ""
            }`}
          >
            <FaStar size={20} />
            <span>Reviews & Ratings</span>
          </Link>
          <Link
            href="#"
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center space-x-2 text-lg cursor-pointer ${
              activeTab === "analytics" ? "text-blue-400" : ""
            }`}
          >
            <IoMdAnalytics size={20} />
            <span>Analytics</span>
          </Link>
          <Link
            href="#"
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center space-x-2 text-lg cursor-pointer ${
              activeTab === "inventory" ? "text-blue-400" : ""
            }`}
          >
            <FaWarehouse size={20} />
            <span>Inventory</span>
          </Link>
          <Link
            href="#"
            onClick={() => setActiveTab("shipment")}
            className={`flex items-center space-x-2 text-lg cursor-pointer ${
              activeTab === "shipment" ? "text-blue-400" : ""
            }`}
          >
            <FaShippingFast size={20} />
            <span>Shipment</span>
          </Link>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Dynamic content based on the selected tab */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Orders</h2>
              <p>Total Orders: 150</p>
              <p>Pending: 10</p>
              <p>Shipped: 100</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">New Orders</h2>
              <p>5 new orders to review</p>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Users</h2>
              <p>Total Users: 2000</p>
              <p>Active: 1800</p>
              <p>Inactive: 200</p>
            </div>
          </div>
        )}

        {activeTab === "mailingList" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Mailing List</h2>
            <p>Total Subscribers: 1200</p>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
              Send Newsletter
            </button>
          </div>
        )}

        {activeTab === "feedbacks" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Feedbacks</h2>
            <p>Latest Feedback: &quot;Great product, very satisfied!&quot;</p>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
              View All Feedbacks
            </button>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Reviews & Ratings</h2>
            <p>Average Rating: 4.7/5</p>
            <p>Top Review: &quot;Excellent customer service!&quot;</p>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
              View All Reviews
            </button>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p>Monthly Revenue: $10,000</p>
            <p>Total Visitors: 5000</p>
            <p>Conversion Rate: 2.5%</p>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
              View Analytics
            </button>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Inventory</h2>
            <p>Products in Stock: 500</p>
            <p>Low Stock: 20</p>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
              Manage Inventory
            </button>
          </div>
        )}

        {activeTab === "shipment" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Shipment</h2>
            <p>Pending Shipments: 15</p>
            <p>Shipped: 50</p>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
              View Shipments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
