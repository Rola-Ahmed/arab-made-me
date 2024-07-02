import { handleImageError } from "utils/ImgNotFound";
import { baseUrl_IMG } from "config.js";
import { useNavigate } from "react-router-dom";

export default function CurrectAccountDropList(props) {
  let { coverImage, name, DashboardPath, profilePath } = props;
  let navigate = useNavigate();

  return (
    <div className="input-group drop-account position-relative justify-content-center">
      <button
        className="btn dropdown-toggle text-white"
        type="button"
        data-bs-toggle="dropdown"
      >
        <img
          className="nav-img me-2"
          src={`${baseUrl_IMG}/${coverImage}`}
          alt="factory logo"
          onError={handleImageError}
        />
        {name ?? "Account"}
      </button>

      <ul className="dropdown-menu p-0 mt-2">
        <div className="table-drop cursor">
          <div
            className="dropdown-item  "
            onClick={() => {
              navigate(`${DashboardPath}`);
            }}
          >
            <i className="fa-solid fa-table-columns me-1 cursor"></i>
            DashBoard
          </div>
          <div
            className="dropdown-item "
            onClick={() => {
              navigate(`${profilePath}`);
            }}
          >
            <i className="fa-solid fa-user me-1"></i>User Profile
          </div>
        </div>
      </ul>
    </div>
  );
}
