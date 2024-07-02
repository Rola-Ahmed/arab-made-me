import { useNavigate } from "react-router-dom";
// used in dashbaords
export default function BecomomeAFactoryFullScreen(directTo) {
  let navigate = useNavigate();
  return (
    <>
      <div className="w-100 ">
        <div className="row  row-gap">
          <div className="form-group">
            <label className="w-100">
              To gain access, please register as a Factory .
            </label>
          </div>
          <div className="col-12 d-flex justify-content-start btn-modal-gap">
            {" "}
            <button
              className="btn-edit submitButton"
              onClick={() => {
                navigate("/companyDetails");
              }}
            >
              <p className="cursor">Become A Factory</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
