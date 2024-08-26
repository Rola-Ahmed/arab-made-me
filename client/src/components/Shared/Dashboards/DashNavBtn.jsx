import { Link } from "react-router-dom";

export default function DashNavBtn(props) {
  let {
    currentNavPage,
    navigateToPage,
    icon,
    title,
    activePageName,
    notification,
  } = props;
  return (
    <div className="position-relative">
      <Link
        className={`base-btn cursor  ${
          currentNavPage == `${activePageName}` ? "active" : ""
        }   text-decoration-none`}
        to={navigateToPage}
      >
        <i className={`${icon}`}></i>
        <p className="sub-title cursor">{title}</p>
      </Link>
      {notification != 0 && (
        <div className="dash-notif position-absolute">{notification}</div>
      )}
    </div>
  );
}
