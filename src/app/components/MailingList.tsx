"use client";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { AiOutlineMail, AiFillDelete } from "react-icons/ai";
import emailjs from "@emailjs/browser";

type Newsletter = {
  _id: string;
  email: string;
};

const MailingList = () => {
  const [subscribers, setSubscribers] = useState<Newsletter[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const query = `*[_type == "newsletter"]{ _id, email }`;
        const data: Newsletter[] = await client.fetch(query);
        setSubscribers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      }
    };

    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (subscribers.length > 0) {
      const latestSubscriber = subscribers[subscribers.length - 1];
      sendThankYouEmail(latestSubscriber.email);
    }
  }, [subscribers]);

  const sendThankYouEmail = async (email: string) => {
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        { email },
        process.env.NEXT_PUBLIC_API_PUBLIC_KEY!,
      );
      console.log("Thank-you email sent to:", email);
    } catch (error) {
      console.error("Error sending thank-you email:", error);
    }
  };

  const handleCheckboxChange = (email: string) => {
    setSelectedEmails((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((e) => e !== email)
        : [...prevSelected, email]
    );
  };

  const handleSendEmail = async () => {
    if (selectedEmails.length === 0) {
      alert("Please select at least one subscriber.");
      return;
    }

    try {
      await Promise.all(
        selectedEmails.map(async (email) => {
          await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        { email },
        process.env.NEXT_PUBLIC_API_PUBLIC_KEY!,
          );
        })
      );
      alert("Emails sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send emails.");
    }
  };

  const handleSendToAll = async () => {
    const allEmails = subscribers.map((subscriber) => subscriber.email);

    try {
      await Promise.all(
        allEmails.map(async (email) => {
          await emailjs.send(
            "service_51emjoc",
            "template_ux6te3d",
            { email },
            "cS1e2aMUu6oY5ll9a"
          );
        })
      );
      alert("Emails sent successfully to all!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send emails.");
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subscriber?");
    if (!confirmDelete) return;

    try {
      await client.delete(id);
      setSubscribers(subscribers.filter((subscriber) => subscriber._id !== id));
      alert("Subscriber deleted successfully!");
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    }
  };

  if (loading) return <p>Loading subscribers...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mailing List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2 border">Select</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber._id} className="border-b">
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(subscriber.email)}
                    onChange={() => handleCheckboxChange(subscriber.email)}
                  />
                </td>
                <td className="p-2 border">{subscriber.email}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDeleteSubscriber(subscriber._id)}
                    className="text-red-500"
                  >
                    <AiFillDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={handleSendEmail}
          className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
        >
          <AiOutlineMail size={20} className="mr-2" />
          Send Email
        </button>
        <button
          onClick={handleSendToAll}
          className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
        >
          <AiOutlineMail size={20} className="mr-2" />
          Send to All
        </button>
      </div>
    </div>
  );
};

export default MailingList;