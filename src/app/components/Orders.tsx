import { client } from "@/sanity/lib/client";
import { useState, useEffect } from "react";

type CartItem = {
  productName: string;
  quantity: number;
  productPrice: number;
  serviceType: string;
  productDescription: string;
};

type Order = {
  orderId: string;
  orderDate: string;
  trackingNumber?: string;
  carrier?: string;
  cartItems: CartItem[];
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  // Fetch orders from Sanity
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order"]{
          orderId,
          orderDate,
          cartItems[]{productName, quantity, productPrice, serviceType, productDescription},
          trackingNumber,
          carrier
        }`;
        const data: Order[] = await client.fetch(query);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Delete order from Sanity
  const handleDelete = async (orderId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this order?");
    
    if (isConfirmed) {
      try {
        await client.delete(orderId);
        setOrders(orders.filter((order) => order.orderId !== orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  // Update order in Sanity
  const handleUpdate = async () => {
    if (!editOrder) return;

    try {
      await client.patch(editOrder.orderId)
        .set(editOrder)
        .commit();

      setOrders(orders.map((order) =>
        order.orderId === editOrder.orderId ? editOrder : order
      ));
      setEditOrder(null); // Close modal
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Filter orders by search term
  const filteredOrders = orders.filter((order: Order) =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Order ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredOrders.map((order: Order) => {
          const totalAmount = order.cartItems.reduce(
            (acc: number, item: CartItem) => acc + item.productPrice * item.quantity, 0
          );
          const tax = totalAmount * 0.05;
          const subTotal = totalAmount + tax;

          return (
            <div key={order.orderId} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
              <p className="text-gray-600">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Tracking: {order.trackingNumber || "N/A"}</p>
              <p className="text-gray-600">Carrier: {order.carrier || "N/A"}</p>

              <h4 className="mt-2 font-semibold">Items:</h4>
              <ul className="text-sm">
                {order.cartItems.map((item: CartItem, index: number) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold">{item.productName}</span> - {item.quantity} x ${item.productPrice}
                    <br />
                    <span className="font-semibold">Type:</span> {item.serviceType}
                    <br />
                    <span className="font-semibold">Description:</span> {item.productDescription}
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t pt-2 text-sm">
                <p>Subtotal: ${totalAmount.toFixed(2)}</p>
                <p>Tax (5%): ${tax.toFixed(2)}</p>
                <p className="font-bold">Total: ${subTotal.toFixed(2)}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setEditOrder(order)}
                  className="bg-blue-500 text-white px-3 py-1 rounded">
                  Update
                </button>
                <button
                  onClick={() => handleDelete(order.orderId)}
                  className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Update Order Modal */}
      {editOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Update Order #{editOrder.orderId}</h3>

            <label className="block mb-2">Tracking Number</label>
            <input
              type="text"
              value={editOrder.trackingNumber || ""}
              onChange={(e) =>
                setEditOrder({ ...editOrder, trackingNumber: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />

            <label className="block mb-2">Carrier</label>
            <input
              type="text"
              value={editOrder.carrier || ""}
              onChange={(e) =>
                setEditOrder({ ...editOrder, carrier: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setEditOrder(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
