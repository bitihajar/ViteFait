import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <input
        type="text"
        value={query}
        placeholder="Search for a product..."
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded p-2 flex-grow"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 rounded">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
