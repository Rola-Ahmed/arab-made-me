import { useEffect, useState } from "react";

export default function SearchFilterSection(props) {
  let { setFilterData } = props;
  //   there is 2 filters (search filter, sort filter)
  const [filter, setFilter] = useState({
    formsFilter: "",
    sort: "date-DESC",
    sort_name: "",
  });

  function filtterData(value, keyword, name) {
    setFilter((prevValue) => ({
      ...prevValue,
      [keyword]: value,
      ...(name && { sort_name: name }),
    }));

    setFilterData(filter);
  }

  //   when it loaded for the first time
  useEffect(() => {
    setFilterData(filter);
  }, []);

  return (
    <div className=" search-container d-flex justify-content-between align-items-center p-3">
      <div className="input-group width-size">
        <div
          className="input-group-prepend cursor "
          onClick={(e) => {
            let value = document.getElementById("formsFilter").value;
            filtterData(value, "formsFilter");
          }}
        >
          <span
            className="input-group-text bg-white icon-search-container pe-0"
            id="inputGroup-sizing-default"
          >
            <i className="fa-solid fa-magnifying-glass icon-search"></i>
          </span>
        </div>
        <input
          type="text"
          className="form-control input-search "
          placeholder="Search by product name"
          id="formsFilter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              filtterData(e.target.value, "formsFilter");
            }
          }}
        />
      </div>

      <div className=" btn-container d-flex justify-content-between align-items-center">
        <div className=" dropdown">
          <button
            className=" dropdown-toggle order-toggle d-flex justify-content-center align-items-center"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-filter"></i>
            <p>{filter?.sort_name !== "" ? filter?.sort_name : "Sort By"}</p>
          </button>

          <ul className=" dropdown-menu">
            <li
              onClick={(e) => {
                filtterData("date-DESC", "sort", "Sort By");
              }}
              className=" cursor text-start"
            >
              <p className="dropdown-item">Sort By</p>
            </li>

            <li
              onClick={(e) => {
                filtterData("date-ASC", "sort", "Oldest");
              }}
              className=" cursor  text-start"
            >
              <p className="dropdown-item">Oldest</p>
            </li>
            <li
              onClick={(e) => {
                filtterData("date-DESC", "sort", "Newest");
              }}
              className=" cursor  text-start"
            >
              <p className="dropdown-item">Newest</p>
            </li>

            <li
              onClick={(e) => {
                filtterData("price-ASC", "sort", "Price :Low to High");
              }}
              className=" cursor  text-start"
            >
              <a className=" dropdown-item">Price :Low to High</a>
            </li>

            <li
              onClick={(e) => {
                filtterData("date-DESC", "sort", "Price :High to Low");
              }}
              className=" cursor  text-start"
            >
              <a className=" dropdown-item">Price :High to Low</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
