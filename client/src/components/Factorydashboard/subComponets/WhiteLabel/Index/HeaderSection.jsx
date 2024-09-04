import WhiteLabelNotification from "components/Factorydashboard/subComponets/WhiteLabel/Index/WhiteLabelNotificationList";
import PageUtility from "components/Shared/Dashboards/PageUtility";

export default function HeaderSection() {
  return (
    <>
      <PageUtility currentPage="White Labels" />
      <div>
        <div className=" d-flex justify-content-between align-items-center ">
          <h2>White Labels</h2>

          <div className="btn-container">
            <div>
              <button
                className="notific-btn dropdown-toggle fa-solid fa-bell btn-container bg-white"
                type="button"
                data-bs-toggle="dropdown"
              ></button>

              <WhiteLabelNotification />
            </div>
            <button
              className="order-btn-1"
              // onClick={downloadCsv}
              // disabled={!reqData?.length}
              disabled={true}
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
