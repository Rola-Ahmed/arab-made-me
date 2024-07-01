
import Header from "components/main/Header/Header";

import { useLocation, useNavigate } from "react-router-dom";

function ResetPasswordMsg() {
  let location = useLocation();
  let navigate = useNavigate();

  return (
    <>
      <Header title="Check Your Email" subTitle="" />
      <section className="register-msg login">
        <div className="container d-flex justify-content-center align-content-center">
          <div className="frame-container-1">
            <i className={`${location.state?.icon}`}></i>
            <div className="container content-1">
              <div className="sub-content">
                <div className="input-content">
                  <div className="form-1 row">
                    <label className="fw-bolder text-center h3">
                      {location.state?.title}
                    </label>
                    <label className="fw-bolder text-center ">
                      {location.state?.message}
                    </label>

                    {location.state?.actionBtn ? (
                      <div className="action row">
                        <div className="col-12">
                          <button
                            type="submit"
                            className="action-btn btn-1 w-100 "
                            onClick={() => {
                              localStorage.setItem(
                                location.state?.actionBtn.setlocalStorage,
                                "true"
                              );
                              navigate(`${location.state?.actionBtn.navigate}`);
                            }}
                          >
                            {location.state?.actionBtn.name}
                          </button>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export default ResetPasswordMsg;
