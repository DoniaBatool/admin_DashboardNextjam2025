"use client";

import { useEffect, useState } from "react";
import { getFeedback, getLowStockProducts, getOrders } from "../../../utils/notificationsApi";

// Define types for Orders, Feedback, and Low Stock Products
interface Order {
  orderId: string;
  status: string;
  orderDate: string;
}

interface Feedback {
  _id: string;
  name: string;
  orderId: string;
  rating: number;
  comments: string;
}

interface Product {
  _id: string;
  name: string;
  quantity: number;
}

const NotificationsPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readOrders, setReadOrders] = useState<string[]>([]);  
  const [readFeedbacks, setReadFeedbacks] = useState<string[]>([]);
  const [readLowStockProducts, setReadLowStockProducts] = useState<string[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const [ordersData, feedbacksData, lowStockData] = await Promise.all([
          getOrders(),
          getFeedback(),
          getLowStockProducts(),
        ]);

        setOrders(ordersData);
        setFeedbacks(feedbacksData);
        setLowStockProducts(lowStockData);
      } catch (err) {
        setError("Failed to load notifications.");
        console.error("Notification Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initial data
    fetchNotifications();

    // Check localStorage for read notifications
    const storedReadOrders = JSON.parse(localStorage.getItem('readOrders') || '[]');
    const storedReadFeedbacks = JSON.parse(localStorage.getItem('readFeedbacks') || '[]');
    const storedReadLowStock = JSON.parse(localStorage.getItem('readLowStockProducts') || '[]');
    
    setReadOrders(storedReadOrders);
    setReadFeedbacks(storedReadFeedbacks);
    setReadLowStockProducts(storedReadLowStock);
  }, []);

  // Mark as Read functionality for orders
  const handleMarkAsReadOrder = (orderId: string) => {
    setReadOrders((prev) => {
      const updatedReadOrders = [...prev, orderId];
      localStorage.setItem('readOrders', JSON.stringify(updatedReadOrders));  // Save to localStorage
      return updatedReadOrders;
    });
  };

  // Mark as Read functionality for feedback
  const handleMarkAsReadFeedback = (feedbackId: string) => {
    setReadFeedbacks((prev) => {
      const updatedReadFeedbacks = [...prev, feedbackId];
      localStorage.setItem('readFeedbacks', JSON.stringify(updatedReadFeedbacks));  // Save to localStorage
      return updatedReadFeedbacks;
    });
  };

  // Mark as Read functionality for low stock products
  const handleMarkAsReadProduct = (productId: string) => {
    setReadLowStockProducts((prev) => {
      const updatedReadLowStock = [...prev, productId];
      localStorage.setItem('readLowStockProducts', JSON.stringify(updatedReadLowStock));  // Save to localStorage
      return updatedReadLowStock;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* New Orders Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">New Orders</h2>
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              !readOrders.includes(order.orderId) ? (  // Only show unread orders
                <div key={order.orderId} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                    <p>Status: {order.status}</p>
                    <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-nowrap"
                    onClick={() => handleMarkAsReadOrder(order.orderId)}  // Mark as read
                  >
                    {readOrders.includes(order.orderId) ? "Read" : "Mark as Read"}
                  </button>
                </div>
              ) : (
                <div key={order.orderId} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                    <p>Status: {order.status}</p>
                    <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg text-nowrap"
                    disabled
                  >
                    Read
                  </button>
                </div>
              )
            ))
          ) : (
            <p>No new orders.</p>
          )}
        </div>
      </div>

      {/* New Feedback Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">New Feedback</h2>
        <div className="space-y-4">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              !readFeedbacks.includes(feedback._id) ? (  // Only show unread feedbacks
                <div key={feedback._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Feedback from {feedback.name}</h3>
                    <p>Order ID: {feedback.orderId}</p>
                    <p>Rating: {feedback.rating} stars</p>
                    <p>Comments: {feedback.comments}</p>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-nowrap"
                    onClick={() => handleMarkAsReadFeedback(feedback._id)}  // Mark as read
                  >
                    {readFeedbacks.includes(feedback._id) ? "Read" : "Mark as Read"}
                  </button>
                </div>
              ) : (
                <div key={feedback._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Feedback from {feedback.name}</h3>
                    <p>Order ID: {feedback.orderId}</p>
                    <p>Rating: {feedback.rating} stars</p>
                    <p>Comments: {feedback.comments}</p>
                  </div>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg text-nowrap"
                    disabled
                  >
                    Read
                  </button>
                </div>
              )
            ))
          ) : (
            <p>No new feedback.</p>
          )}
        </div>
      </div>

      {/* Low Stock Alerts Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Low Stock Alerts</h2>
        <div className="space-y-4">
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map((product) => (
              !readLowStockProducts.includes(product._id) ? (  // Only show unread low stock alerts
                <div key={product._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p>Stock Quantity: {product.quantity}</p>
                    <p>Low Stock Alert: Please restock.</p>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-nowrap"
                    onClick={() => handleMarkAsReadProduct(product._id)}  // Mark as read
                  >
                    {readLowStockProducts.includes(product._id) ? "Read" : "Mark as Read"}
                  </button>
                </div>
              ) : (
                <div key={product._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p>Stock Quantity: {product.quantity}</p>
                    <p>Low Stock Alert: Please restock.</p>
                  </div>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg text-nowrap"
                    disabled
                  >
                    Read
                  </button>
                </div>
              )
            ))
          ) : (
            <p>No low stock alerts.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

