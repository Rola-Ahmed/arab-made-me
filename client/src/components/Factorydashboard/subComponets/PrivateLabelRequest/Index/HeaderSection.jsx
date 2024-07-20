import PrivateLabelNotification from "components/Factorydashboard/subComponets/PrivateLabelRequest/Index/PrivateLabelNotificationList";
import PageUtility from "components/Shared/Dashboards/PageUtility";

export default function HeaderSection(props) {
  let { allprivateLabelData } = props;

  const downloadCsv = () => {
    const attributesToFilter = [
      "productId",
      "factoryId",
      "importerId",
      "product",
      "factory",
      "importer",
      "updatedAt",
      "docs",
      "importerProfileImg",
    ];
    // ,"contactData"
    const newArray = filterAttributes(allprivateLabelData, attributesToFilter);

    // const csvData = convertToCsv(allprivateLabelData);

    const csvData = convertToCsv(newArray);

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "privateLabel.csv";
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
          if (
            key === "specialCharacteristics" &&
            typeof originalObject[key] === "object" &&
            Object.keys(originalObject[key])?.length !== 0
          ) {
            // originalObject[key].forEach((item, index) => {
            //   acc[`KeyWord${index}`] = Object.values([item]);
            //   acc[`description${index}`] = item;
            // });

            let index = 1;
            for (const keyLoop in originalObject[key]) {
              if (originalObject[key].hasOwnProperty(keyLoop)) {
                const value = originalObject[key][keyLoop];

                acc[`KeyWord${index}`] = keyLoop;
                acc[`description${index}`] = value;
              }
              index++;
            }

            while (index <= 5) {
              acc[`KeyWord${index}`] = "";
              acc[`description${index}`] = "";

              index++;
            }
          } else {
            acc[key] = originalObject[key];
          }

          return acc;
        }, {});

      return filteredObject;
    });
  };

  return (
    <>
      <PageUtility currentPage="Private Labels" />
      <div>
        <div className=" d-flex justify-content-between align-items-center ">
          <h2>Private Labels</h2>

          <div className="btn-container">
            <div>
              <button
                className="notific-btn dropdown-toggle fa-solid fa-bell btn-container bg-white"
                type="button"
                data-bs-toggle="dropdown"
              ></button>

              <PrivateLabelNotification />
            </div>
            <button
              className="order-btn-1"
              onClick={downloadCsv}
              disabled={!allprivateLabelData?.length}
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
