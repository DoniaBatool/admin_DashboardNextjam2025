// Function to fetch orders
export const getOrders = async () => {
  const query = `*[_type == "order" && status == "Pending"]{orderId, status, orderDate}`;
  return await fetchSanityData(query);
};

// Function to fetch feedback
export const getFeedback = async () => {
  const query = `*[_type == "feedback"]{_id, name, orderId, rating, comments}`;
  return await fetchSanityData(query);
};

// Function to fetch low stock products
export const getLowStockProducts = async () => {
  const query = `*[_type == "product" && quantity < 10]{_id, name, quantity}`;
  return await fetchSanityData(query);
};

// Helper function to fetch data from Sanity
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/sanity-fetch`
    : "http://localhost:3000/api/sanity-fetch";

const fetchSanityData = async (query: string) => {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data from Sanity");
  }

  const data = await res.json();
  return data.result;
};

