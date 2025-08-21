// client/src/components/UserFilters.js
import React, { useState } from "react";

const UserFilters = ({ onFilterChange, roles }) => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [accountStatus, setAccountStatus] = useState(""); 
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownFocus, setDropdownFocus] = useState(null);

  const handleChange = (key, value) => {
    const newFilters = {
      search,
      role,
      accountStatus,
      [key]: value,
    };

    setSearch(newFilters.search);
    setRole(newFilters.role);
    setAccountStatus(newFilters.accountStatus);

    onFilterChange(newFilters); // notify parent
  };

  const handleReset = () => {
    setSearch("");
    setRole("");
    setAccountStatus("");
    onFilterChange({ search: "", role: "", status: "" });
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
    boxShadow: "0 0 10px rgba(158, 250, 166, 0.47)",
    border: "1px solid rgba(0, 73, 16, 0.8)",
  };

  return (
    <div className="filter-section" style={{ marginBottom: "20px" }}>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => handleChange("search", e.target.value)}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        style={{
          ...(searchFocused ? glassGreenFocus : glassGreenStyle),
          display: "block",
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      <br />

      {/* Role Filter */}
      <select
        value={role}
        onChange={(e) => handleChange("role", e.target.value)}
        onFocus={() => setDropdownFocus("role")}
        onBlur={() => setDropdownFocus(null)}
        style={dropdownFocus === "role" ? glassGreenFocus : glassGreenStyle}
      >
        <option value="">All Roles</option>
        {(roles || []).map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      {/* Account Status Filter */}
      <select
        value={accountStatus}
        onChange={(e) => handleChange("accountStatus", e.target.value)}
        onFocus={() => setDropdownFocus("accountStatus")}
        onBlur={() => setDropdownFocus(null)}
        style={
          dropdownFocus === "accountStatus"
            ? glassGreenFocus
            : glassGreenStyle
        }
      >
        <option value="">Account Status</option>
        <option value="active">Active Users</option>
        <option value="inactive">Deactivated Users</option>
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

export default UserFilters;