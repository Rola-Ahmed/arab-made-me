import { Link } from "react-router-dom";

export default function DashListsDropDown(props) {
  let { path, setActiveMenu, urlHashValue, title, icon } = props;
  return (
    <Link
      className={` sub-btn  text-decoration-none ${
        window?.location.href.includes(urlHashValue) && "active"
      }`}
      to={`${path}#${urlHashValue}`}
      onClick={() => {
        setActiveMenu(urlHashValue);
      }}
    >
      <div className="d-flex  align-items-start sub-profile-cont  ms-2 ps-4">
        <i class={`${icon} pe-3 text-white`}></i>
        <p className="sub-text cursor ">{title}</p>
      </div>
    </Link>
  );
}
