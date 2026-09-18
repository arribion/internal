import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaSpinner, FaFilePdf, FaSyncAlt, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Subscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed" | "pending";
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

export default function NewsLetters() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filtered, setFiltered] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "unsubscribed"
  >("all");

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const url = `${BASE_URL}/api/v1/newsletter/cms/all`;
      console.log("📡 Fetching subscribers from:", url);

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      console.log("📦 API Response:", response.data);

      // Handle different response structures
      const data = response.data;
      let list: Subscriber[] = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (data.data && Array.isArray(data.data)) {
        list = data.data;
      } else if (data.data && data.data.rows && Array.isArray(data.data.rows)) {
        list = data.data.rows;
      } else if (data.rows && Array.isArray(data.rows)) {
        list = data.rows;
      } else {
        console.warn("Unexpected response structure:", data);
        list = [];
      }

      setSubscribers(list);
      setFiltered(list);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Failed to load subscribers";
        setError(msg);
        toast.error(msg);
        console.error("❌ Subscriber fetch error:", err.response || err);
      } else {
        setError("An unexpected error occurred");
        toast.error("Failed to load subscribers");
        console.error("❌ Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Filtering logic
  useEffect(() => {
    let result = subscribers;
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((s) => s.email.toLowerCase().includes(term));
    }
    setFiltered(result);
  }, [searchTerm, statusFilter, subscribers]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      unsubscribed:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
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

  // Export to PDF
  const exportToPDF = () => {
    if (filtered.length === 0) {
      toast.error("No subscribers to export");
      return;
    }

    const doc = new jsPDF("landscape", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(18);
    doc.text("Newsletter Subscribers", pageWidth / 2, 15, { align: "center" });

    // Subtitle with date
    doc.setFontSize(10);
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Generated: ${dateStr}`, pageWidth / 2, 23, { align: "center" });

    // Table
    const tableColumn = ["Email", "Status", "Subscribed At"];
    const tableRows = filtered.map((sub) => [
      sub.email,
      sub.status.toUpperCase(),
      formatDate(sub.createdAt),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 10, right: 10 },
      didDrawPage: () => {
        // Footer
        doc.setFontSize(8);
        doc.text(
          `Total: ${filtered.length} subscribers`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 5,
          { align: "center" },
        );
      },
    });

    // Save PDF
    doc.save(
      `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.pdf`,
    );
    toast.success("PDF exported successfully");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Newsletter Subscribers
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your email subscribers. Total: {subscribers.length}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <button
            onClick={fetchSubscribers}
            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <FaSyncAlt className="mr-2" /> Refresh
          </button>
          <button
            onClick={exportToPDF}
            className="inline-flex items-center px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md shadow-sm text-sm font-medium transition">
            <FaFilePdf className="mr-2" /> Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by email..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-sky-500 text-3xl" />
          <span className="ml-3 text-slate-600 dark:text-slate-400">
            Loading subscribers...
          </span>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto bg-white dark:bg-slate-900 shadow ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Subscribed At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                      {sub.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(sub.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
