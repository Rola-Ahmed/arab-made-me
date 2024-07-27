import Loading from "./Loading";
import "./Loading.css";
import Header from "components/main/Header/Header";
export default function LoadingForm2(props) {
  return (
    <>
      <Header title={props?.title} />

      <div className="d-flex justify-content-center my-5">
        <Loading />
      </div>
    </>
  );
}
