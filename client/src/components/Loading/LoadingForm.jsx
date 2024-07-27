import "./Loading.css";
import Footer from "components/main/Footer/Footer";
import Header from "components/main/Header/Header";
import Navbar from "components/main/Navbar/Navbar";
import Loading from "./Loading";
export default function LoadingForm(props) {
  return (
    <>
      <Navbar />
      <Header title={props?.title} />

      <div className="d-flex justify-content-center my-5">
        <Loading />
      </div>

      <Footer />
    </>
  );
}
