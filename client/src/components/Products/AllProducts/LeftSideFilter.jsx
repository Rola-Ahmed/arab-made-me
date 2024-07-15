import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "config.js";

import { countriesMiddleEast } from "constants/countries";
export default function LeftSideFilter(props) {
  let { setFilter, filter } = props;
  // filter by country or sector
  function filterSection(e) {
    if (e.target.name == "sector") {
      let x = filter.filterBySector;
      if (e.target.checked) {
        x.push(e.target.value);

        setFilter((prevValue) => ({
          ...prevValue,
          filterBySector: x,
        }));
      }
      if (!e.target.checked) {
        x = x.filter((item) => item !== e.target.value);

        setFilter((prevValue) => ({
          ...prevValue,
          filterBySector: x,
        }));
      }
    } else {
      setFilter((prevValue) => ({
        ...prevValue,
        filterByCountry: e.target.getAttribute("value"),
      }));
    }
  }

  const [allsSectors, setAllSectors] = useState([]);
  async function fetchSectors() {
    try {
      const response = await axios.get(`${baseUrl}/sectors?size=10`);

      if (response.data.message === "done") {
        setAllSectors(response.data.sectors);
      }
    } catch (error) {}
  }
  useEffect(() => {
    fetchSectors();
  }, []);
  return (
    <div className="filters">
      <div className="filter-country">
        <p className="filter-text">Country</p>
        <div className="country-filters countries scroll">
          <div className="form-check">
            <input
              onClick={(e) => filterSection(e)}
              className="form-check-input "
              type="radio"
              name="country"
              id="country"
              value=""
              defaultChecked
            />
            <label className="form-check-label">{`All`}</label>
          </div>

          {countriesMiddleEast.map((item) => (
            <div className="form-check">
              <input
                onClick={(e) => filterSection(e)}
                className="form-check-input cursor"
                type="radio"
                name="country"
                id="country"
                value={item.code}
              />
              <label className="form-check-label">{item.name}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-line"></div>

      <div className="filter-country scroll">
        <p className="filter-text">Sector</p>
        <div className="country-filters sectors ">
          {allsSectors.map((sectorItem) => (
            <div className="form-check ">
              <input
                className="form-check-input"
                type="checkbox"
                name="sector"
                id="sector"
                value={sectorItem.id}
                onClick={(e) => filterSection(e)}
              />
              <label className="form-check-label w-100">
                {sectorItem.name.replace(/\bIndustry\b/gi, "")}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-line"></div>
    </div>
  );
}
