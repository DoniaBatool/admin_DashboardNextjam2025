'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import emailjs from 'emailjs-com';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  orderId?: string;
  rating?: number;
  feedbackType: string;
  comments: string;
  date: string;
  image?: {
    asset: {
      url: string;
    };
  };
  reply?: string;
}

export default function FeedbackComponent() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 5;
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const query = `*[_type == "feedback"] | order(date ${sortOrder})`;
        const data: Feedback[] = await client.fetch(query);
        setFeedbacks(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [sortOrder]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);

  const handleReplyClick = (email: string) => {
    setSelectedEmail(email);
    setShowReplyModal(true);
  };
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredFeedbacks.length / feedbacksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  

  const sendReply = async () => {
    if (!replyMessage.trim()) return alert('Please enter a reply message');
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID_2!,
        {
          user_email: selectedEmail,
          reply_message: replyMessage,
        },
        process.env.NEXT_PUBLIC_API_PUBLIC_KEY!,
      );
      alert('Reply sent successfully!');
      setShowReplyModal(false);
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Customer Feedback</h2>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border rounded w-full"
      />
      <button onClick={handleSort} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Sort by Date ({sortOrder})
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Rating</th>
                <th className="p-2 border">Feedback Type</th>
                <th className="p-2 border">Comments</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Reply</th>
              </tr>
            </thead>
            <tbody>
              {currentFeedbacks.map((feedback) => (
                <tr key={feedback._id} className="border-b">
                  <td className="p-2 border">{feedback.name}</td>
                  <td className="p-2 border">{feedback.email}</td>
                  <td className="p-2 border">{feedback.orderId || 'N/A'}</td>
                  <td className="p-2 border">{feedback.rating ?? 'No Rating'}</td>
                  <td className="p-2 border">{feedback.feedbackType}</td>
                  <td className="p-2 border">{feedback.comments}</td>
                  <td className="p-2 border">{feedback.date || 'N/A'}</td>
                  <td className="p-2 border">
                    {feedback.image ? (
                      <Image src={feedback.image.asset.url} alt="Feedback Image" width={50} height={50} className="rounded" />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td className="p-2 border">
                    <button onClick={() => handleReplyClick(feedback.email)} className="p-1 bg-green-500 text-white rounded">Reply</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between mt-4">
  <button
    onClick={prevPage}
    disabled={currentPage === 1}
    className="p-2 bg-gray-300 rounded disabled:opacity-50"
  >
    Previous
  </button>
  <span>Page {currentPage}</span>
  <button
    onClick={nextPage}
    disabled={currentPage === Math.ceil(filteredFeedbacks.length / feedbacksPerPage)}
    className="p-2 bg-gray-300 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

      {showReplyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Reply to {selectedEmail}</h3>
            <textarea className="w-full p-2 border rounded mb-2" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Enter your reply" />
            <button onClick={sendReply} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Send</button>
            <button onClick={() => setShowReplyModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
