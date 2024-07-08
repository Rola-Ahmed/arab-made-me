import Img5 from "../assets/images/PageNotFound.jpg";
import { Link } from "react-router-dom";
import Navbar from "./main/Navbar/Navbar";
import Footer from "./main/Footer/Footer";
import PropTypes from "prop-types";

function Errorpage({ msg, code }) {
  return (
    <>
      <Navbar />
      <div className="container">
        <section className="section mt-5 pb-3  d-flex flex-column align-items-center justify-content-center">
          <h1>{code}</h1>
          <h2 className="text-center">{msg}</h2>
          <Link className="btn " to="/">
            Back to home
          </Link>
          <img
            src={Img5}
            className="img-fluid py-5"
            width="250px"
            alt="Page Not Found"
          />
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Errorpage;
Errorpage.propTypes = {
  msg: PropTypes.string,
  code: PropTypes.string,
};

Errorpage.defaultProps = {
  msg: "The page you are looking for doesn't exist.",
  code: "404",
};
