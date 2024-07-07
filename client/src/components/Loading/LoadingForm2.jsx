import "./Loading.css";
import Header from "components/main/Header/Header";
export default function LoadingForm2(props) {
  return (
    <>
      <Header title={props?.title}  />

      <div className="my-3 py-2 ">
        <div className="loading my-5 ">
          <div className="square-3 "> </div>
        </div>
      </div>
    </>
  );
}
