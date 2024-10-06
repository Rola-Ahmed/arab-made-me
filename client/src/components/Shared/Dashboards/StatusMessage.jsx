export default function StatusMessage(props) {
  let { reqDataLength, apiLoadingData, errorsMsg } = props;
  return (
    <>
      {reqDataLength == 0 && (
        <tr className=" d-contents w-100">
          {/* <tr className="row d-contents w-100"> */}
          <td colspan="12">
            <div className="col-12  w-100 h-100 my-5 py-5">
              <div className="text-center">
                <p className="trate-sub-title ">
                  {apiLoadingData && !errorsMsg ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    errorsMsg || "No Records Found"
                  )}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
