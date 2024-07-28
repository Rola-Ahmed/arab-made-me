import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { useNavigate } from "react-router-dom";

export default function HeaderSection() {
  let navigate = useNavigate();

  return (
    <div id="view" className="m-4 order-section ">
      <SubPageUtility
        currentPage="More Details"
        PrevPage="White Label Details"
      />
      <div>
        <div className=" d-flex justify-content-between align-items-center w-100 ">
          <h2>White Label Details</h2>

          <div className="btn-container">
            <button
              type="button"
              className="order-btn-1"
              onClick={() => {
                navigate("/factorydashboard/whiteLabel");
              }}
            >
              <p className="cursor">White Label Requests</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
