import { logo } from "constants/Images";
import { Link } from "react-router-dom";

export default function DashLogo() {
  return (
    <div className="img-icon mb-2 justify-content-start align-items-center d-flex">
      <Link className="navbar-brand w-100" to="/">
        <img src={logo} alt="arabmade logo" className="w-100" />
      </Link>
    </div>
  );
}
