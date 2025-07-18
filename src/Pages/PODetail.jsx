import React, { useState } from "react";
import { format, isToday } from "date-fns";
import { FiPackage } from "react-icons/fi";
import { FaCalendarAlt, FaRegClock, FaSearch, FaUser } from "react-icons/fa";
import { LuFactory } from "react-icons/lu";

const allPOs = [
  {
    id: "PO-001",
    customerName: "ABC Ltd",
    tasks: [
      {
        name: "Project Planning",
        start: "2025-07-01",
        end: "2025-07-05",
        progress: 50,
        status: "In Progress",
      },
      {
        name: "Requirements Gathering",
        start: "2025-07-02",
        end: "2025-07-08",
        progress: 25,
        status: "In Progress",
      },
      {
        name: "Design Phase",
        start: "2025-07-08",
        end: "2025-07-10",
        progress: 30,
        status: "In Progress",
      },
      {
        name: "Development - Frontend",
        start: "2025-07-09",
        end: "2025-07-18",
        progress: 20,
        status: "Pending",
      },
      {
        name: "Development - Backend",
        start: "2025-07-20",
        end: "2025-07-24",
        progress: 10,
        status: "Pending",
      },
      {
        name: "Client Feedback",
        start: "2025-07-11",
        end: "2025-07-14",
        progress: 90,
        status: "Completed",
      },
    ],
  },
  {
    id: "PO-002",
    customerName: "XYZ Corp",
    tasks: [
      {
        name: "Testing",
        start: "2025-07-10",
        end: "2025-07-14",
        progress: 20,
        status: "In Progress",
      },
      {
        name: "Deployment",
        start: "2025-07-15",
        end: "2025-07-18",
        progress: 0,
        status: "Pending",
      },
    ],
  },
];

const chartStartDate = new Date(2025, 6, 1); // July 1, 2025
// const today = new Date();
const dayWidth = 80;

export default function PODetail() {
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    startDate: "",
    endDate: "",
  });

  const [selectedPO, setSelectedPO] = useState(null);
  const [editTask, setEditTask] = useState(null);

  const filteredPOs = allPOs.filter((po) => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      po.id.toLowerCase().includes(searchLower) ||
      po.customerName.toLowerCase().includes(searchLower);

    const matchesStatus =
      filters.status === "All" ||
      po.tasks.some((task) => task.status === filters.status);

    const matchesDate =
      !filters.startDate ||
      !filters.endDate ||
      po.tasks.some((task) => {
        const taskStart = new Date(task.start);
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        return taskStart >= start && taskStart <= end;
      });

    return matchesSearch && matchesStatus && matchesDate;
  });

  const updateTask = (field, value) => {
    const updatedTasks = selectedPO.tasks.map((t) =>
      t.name === editTask.name ? { ...t, [field]: value } : t
    );
    setSelectedPO({ ...selectedPO, tasks: updatedTasks });
  };

  const statusDot = (status) => {
    if (status === "Completed") return "🟢";
    if (status === "In Progress") return "🟡";
    if (status === "Pending") return "⚪";
    return "";
  };

  return (
    <div className="p-4 space-y-6 max-w-screen">
      <div className="mb-6">
        <h1 className="font-bold text-3xl text-center text-gray-800">
          Production Order Tracker
        </h1>
        <p className="text-md text-center text-gray-600">
          Track your manufacturing progress in real-time
        </p>
      </div>
      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-md border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          <div className="col-span-1 sm:col-span-2">
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <span className="text-blue-500 text-base">
                <FaSearch />
              </span>
              <span className="font-semibold text-lg">
                Find Your Production Order
              </span>
            </label>
            <input
              type="text"
              placeholder="PO Number or Customer Name"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* PO List */}
        <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto border">
          <div className="space-y-2">
            {filteredPOs.map((po) => {
              const isActive = selectedPO?.id === po.id;
              return (
                <div
                  key={po.id}
                  onClick={() => setSelectedPO(po)}
                  className={`p-3 border rounded cursor-pointer transition 
          ${
            isActive
              ? "bg-blue-600 text-white"
              : "bg-white text-black hover:bg-blue-50"
          }`}
                >
                  <strong>{po.id}</strong> - {po.customerName}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gantt Chart */}

      {selectedPO && (
        <div className="bg-white p-4 rounded-md shadow-md border">
          <div>
            <h2 className="text-2xl font-bold mt-6 mb-2 flex items-center gap-2 ">
              <FiPackage className="w-5 h-5 text-blue-600" />
              Production Order: {selectedPO.id}
            </h2>
            <div className="flex flex-wrap justify-between w-full text-sm text-gray-600 mb-4">
              {/* Customer */}
              <div className="flex items-center text-sm gap-2">
                <FaUser />
                <span>
                  <strong>Customer:</strong> {selectedPO.customerName}
                </span>
              </div>

              {/* Start Date */}
              <div className="flex items-center text-sm gap-2">
                <FaCalendarAlt />
                <span>
                  <strong>Production Start:</strong>{" "}
                  {selectedPO.startDate
                    ? format(new Date(selectedPO.startDate), "dd MMM yyyy")
                    : "N/A"}
                </span>
              </div>

              {/* Estimated Date */}
              <div className="flex items-center text-sm gap-2">
                <FaRegClock />
                <span>
                  <strong>Estimated Delivery:</strong>{" "}
                  {selectedPO.endDate
                    ? format(new Date(selectedPO.endDate), "dd MMM yyyy")
                    : "N/A"}
                </span>
              </div>

              {/* Progress */}
              <div className="flex items-center text-sm gap-2">
                <LuFactory />
                <span>
                  <strong>Overall Progress:</strong> {selectedPO.progress}%
                </span>
              </div>
            </div>

            <div className="flex justify-around text-sm text-center gap-4 mb-4">
              {[
                { label: "Pending", icon: "⚪" },
                { label: "In Progress", icon: "🟡" },
                { label: "Completed", icon: "🟢" },
              ].map((s) => (
                <div
                  key={s.label}
                  onClick={() => setFilters({ ...filters, status: s.label })}
                  className={`cursor-pointer select-none ${
                    filters.status === s.label
                      ? "text-blue-600 font-semibold underline"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  <span className="mr-1">{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[2400px]">
                {/* Timeline Header: Start - End Date */}
                <div className="flex border-b text-sm font-semibold bg-gray-100 sticky top-0 z-10">
                  <div
                    className="text-center border-r"
                    style={{ width: `${30 * dayWidth}px` }}
                  >
                    {format(chartStartDate, "MMM dd")} -{" "}
                    {format(
                      new Date(chartStartDate.getTime() + 30 * 86400000),
                      "MMM dd, yyyy"
                    )}
                  </div>
                </div>

                {/* Daily Dates Row */}
                <div className="flex border-b text-xs bg-gray-50 ">
                  <div className="w-40 bg-gray-50 border-r px-2 py-1 font-medium sticky left-0 z-10">
                    Task Name
                  </div>
                  {Array.from({ length: 30 }).map((_, i) => {
                    const date = new Date(chartStartDate);
                    date.setDate(date.getDate() + i);
                    return (
                      <div
                        key={i}
                        className={`w-[80px] text-center border-r py-1 ${
                          isToday(date) ? "bg-yellow-200 font-semibold" : ""
                        }`}
                      >
                        {format(date, "MMM dd")}
                      </div>
                    );
                  })}
                </div>

                {/* Tasks */}
                {selectedPO.tasks
                  .filter(
                    (t) =>
                      filters.status === "All" || t.status === filters.status
                  )
                  .map((task, i) => {
                    const startIndex =
                      (new Date(task.start).getTime() -
                        chartStartDate.getTime()) /
                      (1000 * 60 * 60 * 24);
                    const duration =
                      (new Date(task.end).getTime() -
                        new Date(task.start).getTime()) /
                        (1000 * 60 * 60 * 24) +
                      1;

                    return (
                      <div
                        key={i}
                        className="flex items-center h-12 border-b relative"
                      >
                        <div className="absolute left-0 w-40 pl-2 text-sm font-medium text-gray-700">
                          <span className="mr-1">{statusDot(task.status)}</span>
                          {task.name}
                        </div>
                        <div className="flex-1 ml-40 flex relative">
                          <div
                            className="relative group"
                            style={{ marginLeft: `${startIndex * dayWidth}px` }}
                          >
                            <div
                              className="h-6 bg-gray-300 rounded overflow-hidden cursor-pointer relative hover:opacity-90"
                              style={{ width: `${duration * dayWidth}px` }}
                              onClick={() => setEditTask(task)}
                            >
                              {/* Progress Bar Fill */}
                              <div
                                className={`h-full text-white text-xs flex items-center justify-center transition ${
                                  task.status === "Completed"
                                    ? "bg-green-600"
                                    : task.status === "In Progress"
                                    ? "bg-yellow-500"
                                    : "bg-gray-400"
                                }`}
                                style={{ width: `${task.progress}%` }}
                              >
                                {task.progress}%
                              </div>

                              {/* Tooltip */}
                              <div className="absolute opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 group-hover:flex flex-col bg-black text-white text-xs px-3 py-2 rounded shadow-lg z-50 whitespace-nowrap top-full mt-1 left-1/2 -translate-x-1/2 transition-all duration-200">
                                <div className="font-semibold">{task.name}</div>
                                <div>
                                  {duration} day{duration > 1 ? "s" : ""}
                                </div>
                                <div>
                                  {format(new Date(task.start), "MMM dd")} -{" "}
                                  {format(new Date(task.end), "MMM dd")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Edit Modal */}
            {editTask && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300 ease-out animate-fade-in">
                <div className="bg-white rounded-lg shadow-md p-6 w-[90%] max-w-md transform transition-all duration-300 ease-out scale-95 animate-modal-in">
                  <h3 className="font-semibold text-lg mb-2">Edit Task</h3>
                  <p className="text-md font-bold mb-4 p-4 border rounded bg-blue-100">
                    {editTask.name}
                  </p>

                  <label className="block text-xs mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editTask.start}
                    onChange={(e) => updateTask("start", e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                  />

                  <label className="block text-xs mb-1">End Date</label>
                  <input
                    type="date"
                    value={editTask.end}
                    onChange={(e) => updateTask("end", e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditTask(null)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
