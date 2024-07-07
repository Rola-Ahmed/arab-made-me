import "./Loading.css";
import Footer from "components/main/Footer/Footer";
import Header from "components/main/Header/Header";
import Navbar from "components/main/Navbar/Navbar";
export default function LoadingForm(props) {
  return (
    <>
      <Navbar />
      <Header title={props?.title}  />

      <div className="my-3 py-2 ">
        <div className="loading my-5 ">
          <div className="square-3 "> </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
