import { Link } from "react-router-dom";

export default function DashNavBtn(props) {
  let { currentNavPage, navigateToPage, icon, title, activePageName } = props;
  return (
      <Link
        className={`base-btn cursor  ${
          currentNavPage == `${activePageName}` ? "active" : ""
        }   text-decoration-none`}
        to={navigateToPage}
      >
        <i class={`${icon}`}></i>
        <p className="sub-title cursor">{title}</p>
      </Link>
  );
}
