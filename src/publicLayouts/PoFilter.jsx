// import React, { useState } from "react";
// import { FaSearch, FaCube, FaFileAlt, FaFilter } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const POFilter = () => {
//   const [poNumber, setPONumber] = useState("");
//   const [referenceNumber, setReferenceNumber] = useState("");

//   const navigate = useNavigate();

//   const handleLoginClick = () => {
//     navigate("/login");
//   };

//   const handleReset = () => {
//     setPONumber("");
//     setReferenceNumber("");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
//       {/* Header */}
//       <header className="flex items-center justify-between bg-blue-700 text-white px-6 py-4 rounded-md shadow-md mb-6">
//         <div className="flex items-center gap-3">
//           <FaFilter className="text-2xl" />
//           <h1 className="text-xl md:text-2xl font-semibold">PO Filter Panel</h1>
//         </div>
//         <button
//           onClick={handleLoginClick}
//           className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition"
//         >
//           Admin Login
//         </button>
//       </header>

//       {/* Filter Card */}
//       <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto w-full">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* PO Number Input */}
//           <div>
//             <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
//               <FaCube className="mr-2" /> PO Number
//             </label>
//             <input
//               type="text"
//               value={poNumber}
//               onChange={(e) => setPONumber(e.target.value)}
//               placeholder="e.g., PO-2024-001"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Reference Number Input */}
//           <div>
//             <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
//               <FaFileAlt className="mr-2" /> Reference Number
//             </label>
//             <input
//               type="text"
//               value={referenceNumber}
//               onChange={(e) => setReferenceNumber(e.target.value)}
//               placeholder="e.g., REF-A001"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex flex-wrap justify-end gap-4 mt-6">
//           <button
//             className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             <FaSearch /> Search
//           </button>
//           <button
//             onClick={handleReset}
//             className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
//           >
//             Reset
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default POFilter;
// imports stay the same
// src/components/POFilter.jsx
import React, { useState } from "react";
import { FaSearch, FaCube } from "react-icons/fa";
import {
  format,
  eachDayOfInterval,
  differenceInCalendarDays,
  isToday,
  parseISO,
} from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/authSlice";
import timelineLogo from "../assets/timelineLogo.png"; // ✅ Added logo path

// Dummy PO data
const poList = [
  {
    poNumber: "PO123",
    referenceNumber: "REF123",
    customerName: "Customer A",
    processes: [
      { id: "p1", name: "Mixing Process" },
      { id: "p2", name: "Drying Process" },
    ],
    recipes: [
      {
        id: "r1",
        name: "Mixing",
        processId: "p1",
        startDate: "2025-07-12",
        endDate: "2025-07-15",
        status: "Completed",
      },
      {
        id: "r2",
        name: "Drying",
        processId: "p2",
        startDate: "2025-07-16",
        endDate: "2025-07-23",
        status: "In Progress",
      },
    ],
  },
];

const POFilter = () => {
  const [poNumber, setPONumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [filteredPOs, setFilteredPOs] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editedStartDate, setEditedStartDate] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");
  const [hoveredRecipe, setHoveredRecipe] = useState(null);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const handleSearch = () => {
    const result = poList.filter(
      (po) =>
        po.poNumber.toLowerCase() === poNumber.toLowerCase() &&
        po.referenceNumber.toLowerCase() === referenceNumber.toLowerCase()
    );
    setFilteredPOs(result);
  };

  const openEditModal = (recipe) => {
    setSelectedRecipe(recipe);
    setEditedStartDate(recipe.startDate);
    setEditedEndDate(recipe.endDate);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setEditedStartDate("");
    setEditedEndDate("");
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={timelineLogo} alt="Logo" className="w-8 h-8" /> {/* ✅ Logo */}
          <h1 className="text-xl font-bold text-blue-700">
            Production Order Timeline
          </h1>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={
            token ? handleLogout : () => (window.location.href = "/login")
          }
        >
          {token ? "Logout" : "Login"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full px-4 mt-6">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-6 border border-blue-100 mx-auto mt-6">
          <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-end">

            {/* Left: Input Fields */}
            <div className="flex flex-col sm:flex-row gap-6 w-full md:w-3/4">
              {/* PO Number */}
              <div className="w-full">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">PO Number</label>
                <div className="relative">
                  <FaSearch className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter PO Number"
                    value={poNumber}
                    onChange={(e) => setPONumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                  />
                </div>
              </div>

              {/* Reference Number */}
              <div className="w-full">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Reference Number</label>
                <div className="relative">
                  <FaCube className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter Reference Number"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex gap-4 w-full md:w-auto justify-end md:justify-start mt-4 md:mt-0">
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md text-sm shadow-md transition-all duration-200"
              >
                Search
              </button>
              <button
                onClick={() => {
                  setPONumber("");
                  setReferenceNumber("");
                  setFilteredPOs([]);
                }}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-100 shadow-sm transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v6h6M20 20v-6h-6M4 20l16-16"
                  />
                </svg>
                Reset
              </button>
            </div>
          </div>
        </div>
        {filteredPOs.length > 0 && (
          <div className="mt-10 px-4 mb-16"> {/* Added bottom margin */}

            {/* PO Summary Table */}
            <div className="overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4 text-blue-700">
                PO Summary Table
              </h2>
              <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                <thead>
                  <tr className="bg-blue-600 text-white text-sm font-semibold">
                    <th className="px-6 py-3 text-left">PO Number</th>
                    <th className="px-6 py-3 text-left">Reference Number</th>
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left">Process Name</th>
                    <th className="px-6 py-3 text-left">Recipe Name</th>
                    <th className="px-6 py-3 text-left">Start Date</th>
                    <th className="px-6 py-3 text-left">End Date</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {filteredPOs.map((po) =>
                    po.recipes.map((recipe, index) => {
                      const process = po.processes.find(p => p.id === recipe.processId);
                      return (
                        <tr key={recipe.id} className="border-t hover:bg-gray-100">
                          {index === 0 && (
                            <>
                              <td rowSpan={po.recipes.length} className="px-6 py-3 font-medium">
                                {po.poNumber}
                              </td>
                              <td rowSpan={po.recipes.length} className="px-6 py-3 font-medium">
                                {po.referenceNumber}
                              </td>
                              <td rowSpan={po.recipes.length} className="px-6 py-3 font-medium">
                                {po.customerName}
                              </td>
                            </>
                          )}
                          <td className="px-6 py-3">{process?.name || "-"}</td>
                          <td className="px-6 py-3">{recipe.name}</td>
                          <td className="px-6 py-3">{recipe.startDate}</td>
                          <td className="px-6 py-3">{recipe.endDate}</td>
                          <td className="px-6 py-3">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${recipe.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : recipe.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-200 text-gray-600"
                              }`}>
                              {recipe.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Gap Between Table and Chart */}
            <div className="my-12" />

            {/* Timeline Chart View */}
            {filteredPOs.map((po) => {
              const allDates = po.recipes.flatMap((r) => [
                parseISO(r.startDate),
                parseISO(r.endDate),
              ]);
              const minDate = new Date(Math.min(...allDates));
              const maxDate = new Date(Math.max(...allDates));
              const allDays = eachDayOfInterval({ start: minDate, end: maxDate });

              return (
                <div key={po.poNumber} className="mb-10 border rounded shadow">
                  <div className="bg-gray-100 p-3 flex justify-between items-center text-sm font-medium">
                    <div>Customer: {po.customerName}</div>
                    <div>Start: {format(minDate, "yyyy-MM-dd")}</div>
                    <div>Est. End: {format(maxDate, "yyyy-MM-dd")}</div>
                    <div>
                      Progress:{" "}
                      <span className="text-blue-600">
                        {Math.round(
                          (po.recipes.filter((r) => r.status === "Completed").length /
                            po.recipes.length) * 100
                        )}%
                      </span>
                    </div>
                  </div>

                  <div className="text-center bg-blue-100 font-semibold py-2 uppercase text-blue-800">
                    {format(minDate, "MMMM yyyy")}
                  </div>

                  <div className="flex border-b bg-gray-50 text-sm">
                    <div className="w-64 border-r bg-white p-2 font-semibold">
                      Task
                    </div>
                    <div className="flex">
                      {allDays.map((day, idx) => (
                        <div
                          key={idx}
                          className={`w-24 text-center p-2 ${isToday(day) ? "bg-yellow-200 font-bold" : ""
                            }`}
                        >
                          {format(day, "MMM d")}
                        </div>
                      ))}
                    </div>
                  </div>

                  {po.processes.map((process) => {
                    const relatedRecipes = po.recipes.filter(
                      (r) => r.processId === process.id
                    );

                    return (
                      <div
                        key={process.id}
                        className="flex items-center border-t hover:bg-gray-50"
                      >
                        <div
                          className="w-64 p-2 font-medium text-blue-700 cursor-pointer"
                          onClick={() => openEditModal(relatedRecipes[0])}
                        >
                          {process.name}
                        </div>
                        <div className="relative flex h-10">
                          {relatedRecipes.map((recipe) => {
                            const offset = differenceInCalendarDays(
                              parseISO(recipe.startDate),
                              minDate
                            );
                            const width =
                              differenceInCalendarDays(
                                parseISO(recipe.endDate),
                                parseISO(recipe.startDate)
                              ) + 1;

                            return (
                              <div
                                key={recipe.id}
                                style={{
                                  backgroundColor: getStatusColor(recipe.status),
                                  left: `${offset * 96}px`,
                                  width: `${width * 96}px`,
                                }}
                                className="absolute top-1 h-8 rounded text-white text-xs flex items-center justify-center shadow-md"
                                onMouseEnter={() => setHoveredRecipe(recipe)}
                                onMouseLeave={() => setHoveredRecipe(null)}
                              >
                                {recipe.name}
                                {hoveredRecipe?.id === recipe.id && (
                                  <div className="absolute top-10 left-0 bg-white text-black text-xs p-2 shadow-lg z-50 rounded border w-max">
                                    <div>Process: {process.name}</div>
                                    <div>Start: {recipe.startDate}</div>
                                    <div>End: {recipe.endDate}</div>
                                    <div>
                                      Days:{" "}
                                      {differenceInCalendarDays(
                                        parseISO(recipe.endDate),
                                        parseISO(recipe.startDate)
                                      ) + 1}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}


        {/* Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Recipe Dates</h2>
              <label className="block mb-2">
                Start Date:
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={editedStartDate}
                  onChange={(e) => setEditedStartDate(e.target.value)}
                />
              </label>
              <label className="block mb-4">
                End Date:
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={editedEndDate}
                  onChange={(e) => setEditedEndDate(e.target.value)}
                />
              </label>
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 px-4 py-2 rounded mr-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default POFilter;
