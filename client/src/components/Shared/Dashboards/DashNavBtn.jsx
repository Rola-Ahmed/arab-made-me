import { Link } from "react-router-dom";

export default function DashNavBtn(props) {
  let { currentNavPage, navigateToPage, icon, title, activePageName } = props;
  return (
    <div className="p-0 m-0 text-decoration-none text-dark w-100 ">
      <Link
        className={`base-btn cursor  ${
          currentNavPage == `${activePageName}` ? "active" : ""
        }   text-decoration-none`}
        to={navigateToPage}
      >
        <i class={`${icon}`}></i>
        <p className="sub-title cursor">{title}</p>
      </Link>
    </div>
  );
}
