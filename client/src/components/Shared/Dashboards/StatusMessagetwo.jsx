import Loading from "components/Loading/Loading";

export default function StatusMessagetwo(props) {
  let { errorMsg } = props;
  return (
    <div className="section factory-profile m-5 ">
      <div className="container gap-container">
        <div className="row">
          <div className="col-12  container-2-gap  p-0">
            <div className="d-flex justify-content-center w-100">
              {errorMsg ? (
                <div className="border-3 border-row py-5">
                  <p className="text-muted fw-semibold text-center my-5 py-5">
                    {errorMsg}
                  </p>
                </div>
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
