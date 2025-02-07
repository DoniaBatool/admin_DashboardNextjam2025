"use client";
import { client } from "@/sanity/lib/client";
import { useState, useEffect } from "react";

type Customer = {
  _id: string;
  fullName: string;
  email: string;
  deliveryAddress: string;
  contactNumber: string;
  orderReference?: { orderId: string };
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("fullName"); // Default: Name search

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const query = `*[_type == "customer"]{
          _id,
          fullName,
          email,
          deliveryAddress,
          contactNumber,
          orderReference->{
            orderId
          }
        }`;
        const data: Customer[] = await client.fetch(query);
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // ✅ Fixed search issue (Order ID support added)
  useEffect(() => {
    const filtered = customers.filter((customer) => {
      let value: string | undefined;

      if (searchField === "orderId") {
        value = customer.orderReference?.orderId; // ✅ Handle nested order ID
      } else {
        value = customer[searchField as keyof Customer] as string;
      }

      // 💡 Check if value exists & is a string before calling `toLowerCase()`
      return value?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    });

    setFilteredCustomers(filtered);
  }, [searchQuery, searchField, customers]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customers</h2>

      {/* Search Bar & Filter */}
      <div className="flex items-center mb-4">
        <select
          className="border p-2 rounded mr-2"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="fullName">Name</option>
          <option value="email">Email</option>
          <option value="contactNumber">Contact Number</option>
          <option value="orderId">Order ID</option> {/* ✅ Order ID added */}
        </select>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{customer.fullName}</h3>
            <p className="text-gray-600">Email: {customer.email}</p>
            <p className="text-gray-600">Contact: {customer.contactNumber}</p>
            <p className="text-gray-600">Address: {customer.deliveryAddress}</p>
            <p className="text-gray-600">
              Order ID: {customer.orderReference?.orderId || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
