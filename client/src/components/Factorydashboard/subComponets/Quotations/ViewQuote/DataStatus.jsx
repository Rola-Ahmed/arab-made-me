export default function DataStatus(props) {
  let { requestedData, errorsMsg, apiLoadingData } = props;
  return (
    <>
      {" "}
      {requestedData?.length == 0 ? (
        <tr className="row">
          <div className="col-12  w-100 h-100 my-5 py-5">
            <div className="text-center">
              <p className="trate-sub-title ">
                {/* {errorsMsg ?? " No Record"} */}
                {apiLoadingData ? (
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  errorsMsg ?? "No Records"
                )}
              </p>
            </div>
          </div>
        </tr>
      ) : (
        " "
      )}
    </>
  );
}
