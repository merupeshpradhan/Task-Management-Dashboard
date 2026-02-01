import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    navigate("/taskmanagement");
  };

  return (
    <div>
      <div className="border border-[#85ac85] flex items-center rounded-full">
        <div className="pl-2 text-gray-400">
          <FaSearch size={15} />
        </div>
        <input
          onChange={handleSearch}
          type="text"
          placeholder="Search image..."
          className="w-[350px]  pl-1.5 md:py-1 lg:py-1 font-normal text-md tracking-widest outline-none"
        />
      </div>
    </div>
  );
}

export default SearchBar;
