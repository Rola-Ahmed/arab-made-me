import PageUtility from "components/Shared/Dashboards/PageUtility";

// Container Components
import QuotationsNotification from "containers/Factorydashboard/Notifcations/QuotationsNotification";

export default function HeaderSection(props) {
  let { requestedData } = props;

  //  these are functions that creates the columns name and filtters out the data that is not needed in csv
  //  also the data returns as an object so i convert this data from obj to row and colums

  // These functions handle the creation of column names and the filtering of unnecessary data in the CSV. The data is initially returned as an object, so the functions also handle the conversion of this data from an object format to rows and columns.

  const downloadCsv = () => {
    const attributesToFilter = [
      "productId",
      "factoryId",
      "importerId",
      "quotationId",
      "sourcingOfferId",
      "updatedAt",
      "docs",
      "",

      //   new
      "quotationRequestId",
      "sourcingRequestId",
      "specialManufacturingRequestId",
      "privateLabelingId",

      "factory",
    ];
    // ,"contactData"
    const newArray = filterAttributes(requestedData, attributesToFilter);

    // const csvData = convertToCsv(requestedData);

    const csvData = convertToCsv(newArray);

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotations.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const convertToCsv = (data) => {
    // Assuming data is an array of objects with similar structure
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    return `${header}\n${rows}`;
  };

  const filterAttributes = (dataArray, attributesToFilter) => {
    return dataArray.map((originalObject) => {
      const filteredObject = Object.keys(originalObject)
        .filter((key) => !attributesToFilter.includes(key))
        .reduce((acc, key) => {
          acc[key] = originalObject[key];

          return acc;
        }, {});

      return filteredObject;
    });
  };
  return (
    <>
      <PageUtility currentPage="Quotations" />
      <div>
        <div className=" d-flex justify-content-between align-items-center ">
          <h2> Quotations</h2>

          <div className="btn-container">
            <div>
              <button
                className="notific-btn dropdown-toggle fa-solid fa-bell btn-container bg-white"
                type="button"
                data-bs-toggle="dropdown"
              ></button>

              <QuotationsNotification />
            </div>
            <button
              className="order-btn-1"
              onClick={downloadCsv}
              disabled={!requestedData?.length}
            >
              <i className="fa-solid fa-cloud-arrow-down"></i>
              <p className="cursor">Download CSV</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
