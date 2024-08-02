import {
  ComposableMap,
  Annotation,
  Geographies,
  Geography,
} from "react-simple-maps";
import your_geography_data from "constants/json/features.json";

export default function ExportedCountries({ importingCountries,countriesMiddleEast }) {
  return (
    <div id="exportedCountries" className="fac-cert">
      <h3 className="text-fac-4">exported Countries</h3>
      <div className="">
        <ComposableMap
          className="md-d-none"
          viewBox="30 60 900 480" // Adjust the viewBox to fit your needs
        >
          <Geographies geography={your_geography_data}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <>
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    // onMouseEnter={(event) => handleMouseEnter(geo, event)}
                    // onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        // fill: {...geo?.properties?.name =="Egypt" ?"red" :"blue"},
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      hover: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      active: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                    }}
                  />
                </>
              ))
            }
          </Geographies>

          {ExportedCountries?.map((item, index) => {
            const country = countriesMiddleEast?.find(
              (item1) => item1.code === item
            );
            const coordinates = country?.coordinates || [0, 0]; // Default coordinates if not found

            return (
              <Annotation
                // subject={[30,30]}
                subject={coordinates}
                dx={2}
                dy={0}
                connectorProps={{
                  stroke: "#FF5533",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                }}
              >
                <line
                  x1={0}
                  y1={0}
                  // Adjust the y2 value to set the height of the line
                  stroke="#FF5533"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <text
                  className="fw-bolder country-annot"
                  x="-1"
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fill="black"
                >
                  {countriesMiddleEast.find((item1) => item1.code === item)?.id}
                </text>
              </Annotation>
            );
          })}
        </ComposableMap>

        <div className="row mx-1  ">
          {importingCountries?.map((item, index) => (
            <div className="col-6 country-border py-2">
              <div className="d-flex align-items-center">
                <img
                  className="flag-img me-2"
                  // src={`https://flagcdn.com/w80/eg.png`}
                  src={`https://flagcdn.com/w80/${
                    countriesMiddleEast?.find((item1) => item1.code === item)?.id
                  }.png`}
                />
                <p>{item} </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
