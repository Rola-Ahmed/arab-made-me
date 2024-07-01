import React from "react";

export default function SearchSortFilter(props) {
  let { setFilter, filter } = props;
  // search filteration
  function filterSearchIcon(value) {
    setFilter((prevValue) => ({
      ...prevValue,
      filterBySearch: value,
    }));
  }

  // Sort filtration
  function filterBySort(e) {
    if (filter.filterBySector != e.target.value) {
      setFilter((prevValue) => ({
        ...prevValue,
        filterBySort: e.target.value,
      }));
    }
  }

  return (
    <div className=" filter-container ">
      <div className=" ">
        <div className="input-group search-input ">
          <input
            type="text"
            className="form-control rounded-0 border-left-0"
            placeholder="Search"
            id="searchTermSecotr"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                filterSearchIcon(e.target.value);
              }
            }}
          />
          <div className="input-group-append rounded-0  ">
            <button
              className="input-group-text h-100 bg-white border-radius"
              onClick={(e) => {
                filterSearchIcon(
                  document.getElementById("searchTermSecotr").value
                );
              }}
            >
              <i className="fa-solid fa-magnifying-glass "></i>
            </button>
          </div>
        </div>
      </div>

      <div className=" sort-filter m-0 p-0">
        <div>
          <p className=" sort-by p-0 m-0">sort by:</p>
        </div>

        <select
          name="sort"
          id="sort"
          onClick={(e) => filterBySort(e)}
          className="form-select rounded-0 small-size"
        >
          <option value="">Sort Item</option>
          <option value="price-DESC">Price - High to Low</option>
          <option value="price-DESC">Price - Low to High</option>
          <option value="rate">Rate</option>
        </select>
      </div>
    </div>
  );
}
