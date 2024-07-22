import ReadOnly from "components/Forms/Shared/ReadOnly";
import { formattedTime as getFornattedTime } from "utils/formattedTime";
import { getMonthName as getDate } from "utils/getMonthName";

export default function VisitRequestInfo({ requestedData }) {
  let formattedTime = getFornattedTime;
  let getMonthName = getDate;

  return (
    <div className="container-profile-input w-100">
      <div className="title-contianer-input w-100">
        <p> Factory Visit Details</p>
        <div className="w-100 ">
          <div className="row  row-gap">
            <div className="col-6">
              <ReadOnly title="status" value={requestedData?.status} />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Created At"
                value={`${formattedTime(requestedData?.date)}`}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Created At"
                value={getMonthName(requestedData?.createdAt?.split("T")?.[0])}
              />
            </div>

            <div className="col-12">
              <ReadOnly title="purpose " value={requestedData?.purpose} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
