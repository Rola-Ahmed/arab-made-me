import React from "react";

export default function StatusMessage(props) {
  let { reqDataLength, apiLoadingData, errorsMsg } = props;
  return (
    <>
      {reqDataLength == 0 && (
        <tr className="row">
          <div className="col-12  w-100 h-100 my-5 py-5">
            <div className="text-center">
              <p className="trate-sub-title ">
                {apiLoadingData ? (
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  errorsMsg || "No Records Found"
                )}
              </p>
            </div>
          </div>
        </tr>
      )}
    </>
  );
}
