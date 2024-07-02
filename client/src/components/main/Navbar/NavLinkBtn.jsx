import { Link } from "react-router-dom";

export default function NavLinkBtn(props) {
  let { name, path } = props;
  return (
    <li className="nav-item">
      <Link className="nav-link " to={`${path}`}>
        {name}
      </Link>
    </li>
  );
}
