import Img5 from "../assets/images/PageNotFound.jpg"
import { Link } from 'react-router-dom';
function Errorpage() {
  return (
      <div className="container">
        <section
          className="section min-vh-100 d-flex flex-column align-items-center justify-content-center"
        >
          <h1>404</h1>
          <h2 className="text-center">The page you are looking for doesn't exist.</h2>
          <Link className="btn " to="/">Back to home</Link>
          <img
            src={Img5}
            className="img-fluid py-5"
            width="250px"
            alt="Page Not Found"
          />
        </section>
      </div>
  )
};

export default Errorpage;
