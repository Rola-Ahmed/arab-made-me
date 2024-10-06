import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import ReadOnly from "components/Forms/Shared/ReadOnly";
import { getMonthName as getDate } from "utils/getMonthName";

export default function OfferInfo(props) {
  let { requestedData, handleImageClick, hideImage } = props;
  let getMonthName = getDate;
  return (
    <>
      {" "}
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p className="h5 fw-bolder title-header"> Offer Details</p>
          <div className="w-100 ">
            <div className="row  row-gap">
              {[
                { title: "Product Name", value: requestedData?.productName },
                { title: "Quantity", value: requestedData?.quantity },
                { title: "HSN Code", value: requestedData?.productHSNCode },
                { title: "Price", value: requestedData?.price },
                {
                  title: "Packing Conditions",
                  value: requestedData?.packingConditions,
                },
                {
                  title: "Quality Conditions",
                  value: requestedData?.qualityConditions,
                },
                {
                  title: "Shipping Conditions",
                  value: requestedData?.shippingConditions,
                },
                {
                  title: "Delivery Terms",
                  value: requestedData?.deliveryTerms,
                },
                { title: "Payment Terms", value: requestedData?.paymentTerms },
                {
                  title: "Available",
                  value: requestedData?.available ? "In Stock" : "Out Of Stock",
                },
                {
                  title: "Preferred Countries",
                  value: `${requestedData?.preferredCountries?.join(", ") || "All"
                    }`,
                },
                {
                  title: "Created At",
                  value: getMonthName(requestedData?.createdAt?.split("T")[0]),
                },
                {
                  title: "Product Description",
                  value: requestedData?.productDescription,
                },
              ].map(({ title, value }, index) => (
                <div className="col-md-6 col-sm-12" key={index}>
                  <ReadOnly title={title} value={value} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {!hideImage && (
        <div className="container-profile-input w-100">
          <div className="title-contianer-input w-100">
            <p className="h5 fw-bolder title-header"> Product Images</p>
            <DisplayMultiImages
              handleImageClick={handleImageClick}
              images={requestedData?.images}
            />
          </div>
        </div>
      )}
    </>
  );
}
