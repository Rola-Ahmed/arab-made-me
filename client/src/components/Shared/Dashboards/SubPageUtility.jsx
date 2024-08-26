import { Link, useNavigate } from "react-router-dom";

export default function SubPageUtility(props) {
  let { currentPage, PrevPage } = props;
  let navigate = useNavigate();
  return (
    <div className="page-utility  gap">
      <Link
        to="/"
        className="back-btn-dash cursor text-decoration-none text-muted"
      >
        Home
      </Link>
      <i className="fa-solid fa-chevron-right btn-back-icon"></i>

      <p
        to="-1"
        className="back-btn-dash cursor text-decoration-none text-muted"
        onClick={() => {
          navigate(-1);
        }}
      >
        {PrevPage}
      </p>

      <i className="fa-solid fa-chevron-right btn-back-icon"></i>

      <p className="back-btn-dash-2  text-muted">{currentPage}</p>
    </div>
  );
}
