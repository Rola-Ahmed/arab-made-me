import { Link } from "react-router-dom";

export default function DashListsDropDown(props) {
  let { path, urlHashValue, title, icon } = props;
  return (
    <Link
      className={` sub-btn  text-decoration-none ${
        window?.location.href.includes(urlHashValue) && "active"
      }`}
      to={`${path}#${urlHashValue}`}
    >
      <div className="d-grid  align-items-center  ms-2 ps-4 icon-text-gap ">
        <i className={`${icon}  text-white `}></i>
        <p className="sub-text cursor ">{title}</p>
      </div>
    </Link>
  );
}
