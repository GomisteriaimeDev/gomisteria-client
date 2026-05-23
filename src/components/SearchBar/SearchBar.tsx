import { useNavigate } from "react-router-dom";
import "./SearchBar.scss";

const SearchBar = (props: any) => {
  const navigate = useNavigate();
  const handleSearch = (event: any) => {
    const searchTerm = event.target.value.trim(); // Ensure to trim any extra spaces
    if (searchTerm) {
      navigate(`/search?searchTerm=${searchTerm}`);
    }
  };

  return (
    <input
      className="searchBar"
      type="search"
      placeholder={props?.placeHolder || "Enter your search terms..."}
      onChange={handleSearch}
    />
  );
};

export default SearchBar;
