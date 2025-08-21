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

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setPriority("");
    setSortCredits("");
    onFilterChange({ search: "", category: "", location: "", priority: "", sortCredits: ""})
  };

  const glassGreenStyle = {
    position: "relative",
    borderRadius: 10,
    width: 160,
    fontSize: 16,
    color: "#000000ff",
    background: "#d9f99d69",
    backdropFilter: "blur(8px) saturate(150%)",
    WebkitBackdropFilter: "blur(8px) saturate(150%)",
    border: "1px solid rgba(187, 255, 0, 0.4)",
    boxShadow: "4px 4px 5px rgba(71, 110, 0, 0.23)",
    padding: "8px",
    userSelect: "none",
    outline: "none",
    marginRight: "10px",
    transition: "all 0.5s ease",
  };

  const glassGreenFocus = {
    ...glassGreenStyle,
    boxShadow: "0 0 12px rgba(158, 250, 166, 0.47)",
    border: "1px solid rgba(19, 83, 0, 0.8)",
  };

  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownFocus, setDropdownFocus] = useState(null); // track focus per dropdown

  return (
    <div className="filter-section" style={{ marginBottom: "20px" }}>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by task name..."
        value={search}
        onChange={(e) => handleChange("search", e.target.value)}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        style={{
        ...(searchFocused ? glassGreenFocus : glassGreenStyle),
        display: "block",   
        width: "100%",       
        boxSizing: "border-box"   
      }}
      />

      <br/>

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => handleChange("category", e.target.value)}
        onFocus={() => setDropdownFocus("category")}
        onBlur={() => setDropdownFocus(null)}
        style={dropdownFocus === "category" ? glassGreenFocus : glassGreenStyle}
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
        onFocus={() => setDropdownFocus("location")}
        onBlur={() => setDropdownFocus(null)}
        style={dropdownFocus === "location" ? glassGreenFocus : glassGreenStyle}
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
        onFocus={() => setDropdownFocus("priority")}
        onBlur={() => setDropdownFocus(null)}
        style={dropdownFocus === "priority" ? glassGreenFocus : glassGreenStyle}
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
        onFocus={() => setDropdownFocus("credits")}
        onBlur={() => setDropdownFocus(null)}
        style={dropdownFocus === "credits" ? glassGreenFocus : glassGreenStyle}
      >
        <option value="desc">Credits: High to Low</option>
        <option value="asc">Credits: Low to High</option>
      </select>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="btn glossy primary"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default TaskFilters;