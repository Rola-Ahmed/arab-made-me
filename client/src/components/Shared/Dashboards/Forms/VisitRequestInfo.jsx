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
            {[
              { title: "Visit Purpose", value: requestedData?.purpose },
              {
                title: "requested Visit Date",
                value: `${formattedTime(requestedData?.date)}`,
              },
              { title: "Visit Type", value: requestedData?.visitType },
              {
                title: "Individuals Number",
                value: requestedData?.individualsNumber,
              },
              {
                title: "Required Products",
                value: requestedData?.requiredProducts,
              },
              { title: "status", value: requestedData?.status },
              {
                title: "Created At",
                value: `${getMonthName(
                  requestedData?.createdAt?.split("T")?.[0]
                )}`,
              },
            ]?.map(({ title, value }, index) => (
              <div className="col-md-6 col-sm-12" key={index}>
                <ReadOnly title={title} value={value} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
