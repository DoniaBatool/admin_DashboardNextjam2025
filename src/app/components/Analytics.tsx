"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

// Register the necessary components of Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

// Define TypeScript interfaces for analytics data
interface ProductAnalytics {
  [productName: string]: {
    quantitySold: number;
    revenue: number;
  };
}

interface OrderAnalytics {
  totalSales: number;
  orderStatusCount: {
    completed: number;
    pending: number;
    canceled: number;
  };
  salesPerDay: {
    [day: string]: number;
  };
}

interface CustomerAnalytics {
  newCustomers: number;
  repeatCustomers: number;
  customerOrdersCount: {
    [customerName: string]: number;
  };
}

// Fetch Product Analytics
const fetchProductAnalytics = async (): Promise<ProductAnalytics> => {
  const query = `*[_type == "order"]{
    cartItems[] {
      productPrice,
      quantity,
      productName
    }
  }`;
  const orders = await client.fetch(query);

  const productSales: ProductAnalytics = {};

  orders.forEach((order: { cartItems: { productPrice: number; quantity: number; productName: string }[] }) => {
    order.cartItems.forEach((item) => {
      if (!productSales[item.productName]) {
        productSales[item.productName] = { quantitySold: 0, revenue: 0 };
      }
      productSales[item.productName].quantitySold += item.quantity;
      productSales[item.productName].revenue += item.productPrice * item.quantity;
    });
  });

  return productSales;
};

// Fetch Order Analytics
const fetchOrderAnalytics = async (): Promise<OrderAnalytics> => {
  const query = `*[_type == "order"]{
    orderId,
    orderDate,
    orderStatus,
    cartItems[] {
      productPrice,
      quantity
    }
  }`;
  const orders = await client.fetch(query);

  let totalSales = 0;
  const orderStatusCount = { completed: 0, pending: 0, canceled: 0 };
  const salesPerDay: { [day: string]: number } = {};

  orders.forEach((order: { orderDate: string; orderStatus: string; cartItems: { productPrice: number; quantity: number }[] }) => {
    totalSales += order.cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

    orderStatusCount[order.orderStatus as keyof typeof orderStatusCount] =
      (orderStatusCount[order.orderStatus as keyof typeof orderStatusCount] || 0) + 1;

    const orderDate = new Date(order.orderDate);
    const day = orderDate.toISOString().split("T")[0];
    salesPerDay[day] = (salesPerDay[day] || 0) + order.cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
  });

  return { totalSales, orderStatusCount, salesPerDay };
};

// Fetch Customer Analytics
const fetchCustomerAnalytics = async (): Promise<CustomerAnalytics> => {
  const query = `*[_type == "customer"]{
    fullName,
    orderReference-> {
      orderId
    }
  }`;
  const customers = await client.fetch(query);

  let newCustomers = 0;
  let repeatCustomers = 0;
  const customerOrdersCount: { [customerName: string]: number } = {};

  customers.forEach((customer: { fullName: string; orderReference?: { orderId: string }[] }) => {
    const totalOrders = customer.orderReference ? customer.orderReference.length : 0;

    if (totalOrders > 0) {
      customerOrdersCount[customer.fullName] = totalOrders;
      if (totalOrders === 1) {
        newCustomers++;
      } else {
        repeatCustomers++;
      }
    }
  });

  return { newCustomers, repeatCustomers, customerOrdersCount };
};

// Main Analytics Component
const Analytics = () => {
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics>({});
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalytics | null>(null);
  const [customerAnalytics, setCustomerAnalytics] = useState<CustomerAnalytics | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setProductAnalytics(await fetchProductAnalytics());
      setOrderAnalytics(await fetchOrderAnalytics());
      setCustomerAnalytics(await fetchCustomerAnalytics());
    };

    loadAnalytics();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      {/* Product Analytics */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Product Analytics</h3>
        {Object.keys(productAnalytics).length > 0 ? (
          <Bar
            data={{
              labels: Object.keys(productAnalytics),
              datasets: [
                {
                  label: "Revenue by Product",
                  data: Object.values(productAnalytics).map((data) => data.revenue),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
            options={{ responsive: true }}
          />
        ) : (
          <p>No product analytics data available</p>
        )}
      </div>

      {/* Order Analytics */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Order Analytics</h3>
        {orderAnalytics ? (
          <>
            <p><strong>Total Sales:</strong> ${orderAnalytics.totalSales?.toFixed(2) || 0}</p>
            <Bar
              data={{
                labels: ["Completed", "Pending", "Canceled"],
                datasets: [
                  {
                    label: "Order Status Breakdown",
                    data: [
                      orderAnalytics.orderStatusCount.completed || 0,
                      orderAnalytics.orderStatusCount.pending || 0,
                      orderAnalytics.orderStatusCount.canceled || 0,
                    ],
                    backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </>
        ) : (
          <p>Loading order analytics...</p>
        )}
      </div>

      {/* Customer Analytics */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Customer Analytics</h3>
        {customerAnalytics ? (
          <Bar
            data={{
              labels: ["New Customers", "Repeat Customers"],
              datasets: [
                {
                  data: [customerAnalytics.newCustomers || 0, customerAnalytics.repeatCustomers || 0],
                  backgroundColor: ["#4CAF50", "#FF9800"],
                },
              ],
            }}
            options={{ responsive: true }}
          />
        ) : (
          <p>Loading customer analytics...</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
