import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaSpinner,
  FaTrash,
  FaEye,
  FaTimes,
  FaFileAlt,
  FaSyncAlt,
} from "react-icons/fa";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  companyName: string | null;
  message: string;
  supportFile: string | null;
  status: "pending" | "resolved" | "archived" | "spam";
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = (import.meta as any).env.VITE_BASE_URL ?? "";

export default function Contact() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination (optional)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); // adjust as needed
      const url = `${BASE_URL}/api/v1/contact/cms/all?limit=20&offset=${
        (page - 1) * 20
      }`;
      console.log("📡 Fetching messages from:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("📦 API Response:", response.data);

      // Handle different response structures
      let data = response.data;
      let messagesArray: ContactMessage[] = [];

      if (Array.isArray(data)) {
        messagesArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        messagesArray = data.data;
      } else if (data.data && data.data.rows && Array.isArray(data.data.rows)) {
        messagesArray = data.data.rows;
        setTotalCount(data.data.count || 0);
        setTotalPages(Math.ceil((data.data.count || 0) / 20));
      } else if (data.rows && Array.isArray(data.rows)) {
        messagesArray = data.rows;
        setTotalCount(data.count || 0);
        setTotalPages(Math.ceil((data.count || 0) / 20));
      } else {
        console.warn("Unexpected response structure:", data);
        messagesArray = [];
      }

      setMessages(messagesArray);
      if (messagesArray.length === 0) {
        toast("No messages found", { icon: "📭" });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Failed to load messages";
        setError(msg);
        toast.error(msg);
        console.error("❌ Contact fetch error:", err.response || err);
      } else {
        setError("An unexpected error occurred");
        toast.error("Failed to load messages");
        console.error("❌ Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const token = localStorage.getItem("token");
      const url = `${BASE_URL}/api/v1/contact/${id}`;
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      toast.error("Failed to delete message");
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      resolved:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      spam: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    const classes = styles[status] || styles.pending;
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Client Messages
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and manage all contact form submissions.
            {totalCount > 0 && ` (${totalCount} total)`}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
          <FaSyncAlt className="mr-2" /> Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300 text-sm">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-sky-500 text-3xl" />
          <span className="ml-3 text-slate-600 dark:text-slate-400">
            Loading messages...
          </span>
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto bg-white dark:bg-slate-900 shadow ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Attachment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {messages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                        {msg.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        <a
                          href={`mailto:${msg.email}`}
                          className="hover:text-sky-500">
                          {msg.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {msg.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {msg.supportFile ? (
                          <a
                            href={msg.supportFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-500 hover:underline inline-flex items-center gap-1">
                            <FaFileAlt size={14} /> View
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(msg.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedMessage(msg);
                              setShowDetailModal(true);
                            }}
                            className="text-slate-400 hover:text-sky-500 transition"
                            title="View details">
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="text-slate-400 hover:text-rose-500 transition"
                            title="Delete">
                            <FaTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-md text-sm disabled:opacity-50">
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-md text-sm disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Message Details
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <FaTimes size={20} />
                </button>
              </div>
              <dl className="mt-4 space-y-3 divide-y divide-slate-200 dark:divide-slate-700">
                <div className="py-2">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Name
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                    {selectedMessage.name}
                  </dd>
                </div>
                <div className="py-2">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-sky-500 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </dd>
                </div>
                <div className="py-2">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Subject
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                    {selectedMessage.subject}
                  </dd>
                </div>
                <div className="py-2">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Company
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                    {selectedMessage.companyName || "—"}
                  </dd>
                </div>
                <div className="py-2">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Status
                  </dt>
                  <dd className="mt-1">
                    {getStatusBadge(selectedMessage.status)}
                  </dd>
                </div>
                <div className="py-2">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Message
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </dd>
                </div>
                {selectedMessage.supportFile && (
                  <div className="py-2">
                    <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                      Attachment
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={selectedMessage.supportFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 hover:underline inline-flex items-center gap-1">
                        <FaFileAlt size={14} /> View File
                      </a>
                    </dd>
                  </div>
                )}
                <div className="py-2">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Submitted At
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                    {formatDate(selectedMessage.createdAt)}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
