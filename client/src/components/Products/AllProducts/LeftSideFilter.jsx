import { useFetchSectors } from "hooks/useFetchSectors";
import useCountries from "hooks/useCountries";
import { useAppTranslation } from "config.js";

export default function LeftSideFilter(props) {
  const countriesMiddleEast = useCountries();
  const { trans: t, currentLang } = useAppTranslation();

  let { setFilter, filter } = props;
  const { allSectors, errormsg } = useFetchSectors();
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

          {countriesMiddleEast?.map((item) => (
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
          {allSectors?.map((sectorItem) => (
            <div className="form-check ">
              <input
                className="form-check-input"
                type="checkbox"
                name="sector"
                id="sector"
                value={sectorItem.id}
                onClick={(e) => filterSection(e)}
                defaultChecked={filter?.filterBySector?.includes(
                  sectorItem?.id
                )}
              />
              <label className="form-check-label w-100">
                {t(`sectors:sectors.${sectorItem?.name}`)}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="h-line"></div>
    </div>
  );
}
