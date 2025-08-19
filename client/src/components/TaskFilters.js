// client/src/components/TaskFilters.js
import React, { useState } from "react";

const TaskFilters = ({ onFilterChange, categories, locations, priorities }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("");
  const [sortCredits, setSortCredits] = useState("desc"); // ✅ default to descending

  const handleChange = (key, value) => {
    const newFilters = {
      search,
      category,
      location,
      priority,
      sortCredits,
      [key]: value,
    };

    setSearch(newFilters.search);
    setCategory(newFilters.category);
    setLocation(newFilters.location);
    setPriority(newFilters.priority);
    setSortCredits(newFilters.sortCredits);

    onFilterChange(newFilters); // update parent
  };

  return (
    <div className="filter-section" style={{ marginBottom: "20px" }}>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by task name..."
        value={search}
        onChange={(e) => handleChange("search", e.target.value)}
        style={{
          padding: "8px",
          width: "250px",
          marginRight: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => handleChange("category", e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Location Filter */}
      <select
        value={location}
        onChange={(e) => handleChange("location", e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }}
      >
        <option value="">All Locations</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      {/* Priority Filter */}
      <select
        value={priority}
        onChange={(e) => handleChange("priority", e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }}
      >
        <option value="">All Priorities</option>
        {priorities.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* ✅ Sort by Credits */}
      <select
        value={sortCredits}
        onChange={(e) => handleChange("sortCredits", e.target.value)}
        style={{ padding: "8px" }}
      >
        <option value="desc">Credits: High → Low</option>
        <option value="asc">Credits: Low → High</option>
      </select>
    </div>
  );
};

export default TaskFilters;
