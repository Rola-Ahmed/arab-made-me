import ReadOnly from "components/Forms/Shared/ReadOnly";
export default function ImporterInfo(props) {
  let { importerData } = props;
  return (
    <div className="container-profile-input w-100">
      <div className="title-contianer-input w-100">
        <div className="d-flex justify-content-between">
          <p>Buyer Information</p>
        </div>
        <div className="w-100 ">
          <div className="row  row-gap">
            <div className="col-6">
              <ReadOnly
                title="Product Name"
                value={`${
                  importerData?.repName == null
                    ? " "
                    : `${importerData?.repName}`
                }`}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title=" Representative email"
                value={importerData?.repEmail}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Representative phone number"
                value={importerData?.repPhone}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
