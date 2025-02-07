"use client";
import { client } from "@/sanity/lib/client";
import { useState, useEffect } from "react";

type Review = {
  _id: string;
  rating: number;
  review: string;
  reviewer: string;
  productId: string;
};

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("reviewer"); // Default: Reviewer search

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const query = `*[_type == "review"]{
          _id,
          rating,
          review,
          reviewer,
          productId
        }`;
        const data: Review[] = await client.fetch(query);
        setReviews(data);
        setFilteredReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // ✅ Fixed search issue (Reviewer, Product ID, etc. support added)
  useEffect(() => {
    const filtered = reviews.filter((review) => {
      let value: string | undefined;

      if (searchField === "productId") {
        value = review.productId;
      } else {
        value = review[searchField as keyof Review] as string;
      }

      return value?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    });

    setFilteredReviews(filtered);
  }, [searchQuery, searchField, reviews]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {/* Search Bar & Filter */}
      <div className="flex items-center mb-4">
        <select
          className="border p-2 rounded mr-2"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="reviewer">Reviewer</option>
          <option value="productId">Product ID</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Review List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredReviews.map((review) => (
          <div key={review._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Rating: {review.rating}</h3>
            <p className="text-gray-600">Review: {review.review}</p>
            <p className="text-gray-600">Reviewer: {review.reviewer}</p>
            <p className="text-gray-600">Product ID: {review.productId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
