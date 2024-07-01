// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { useNavigate } from "react-router-dom";

export default function HeaderSection() {
  let navigate = useNavigate();
  return (
    <div id="view" className="m-4 order-section  ">
      <SubPageUtility
        currentPage="More Details"
        PrevPage="Custom Product Details"
      />
      <div>
        <div className=" d-flex justify-content-between align-items-center w-100 ">
          <h2>Custom Product Details</h2>

          <div className="btn-container">
            <button
              type="button"
              className="order-btn-1"
              onClick={() => {
                navigate("/factorydashboard/CustomerProductRequest");
              }}
            >
              <p className="cursor">Custom Product Requests</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
