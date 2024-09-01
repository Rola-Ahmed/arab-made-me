import SourcingOfferCard from "./SourcingOfferCard";

export default function SourcingOfferTable({ allSourcingReqData }) {
  return (
    <table className="table table-striped align-middle  ">
      <thead>
        <tr className=" bg-header ">
          <th scope="col">
            <div className="d-flex  align-items-center justify-contnet-center ">
              <p className="fs-14-semi text-muted">Product</p>
            </div>
          </th>
          <th scope="col">
            <div className="d-flex  align-items-center justify-contnet-center ">
              <p className="fs-14-semi text-muted">Quantity</p>
            </div>
          </th>
          <th scope="col">
            <div className="d-flex  align-items-center justify-contnet-center ">
              <p className="fs-14-semi text-muted">Exporting Countries</p>
            </div>
          </th>
          <th scope="col">
            <div className="d-flex  align-items-center justify-contnet-center ">
              <p className="fs-14-semi text-muted">Details</p>
            </div>
          </th>
          <th scope="col" className="">
            <div className="d-flex  align-items-center justify-contnet-center ">
              <p className="fs-14-semi text-muted">Date</p>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {allSourcingReqData?.map((item) => (
          <SourcingOfferCard item={item} />
        ))}
      </tbody>
    </table>
  );
}
