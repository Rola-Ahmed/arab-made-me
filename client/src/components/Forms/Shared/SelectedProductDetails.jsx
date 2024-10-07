import ReadOnly from "./ReadOnly";

export default function ProductDetails(props) {
  let { productDetails } = props;
  
  return (
    <div className="container container-req ">
      <div className="input-content ">
        <div className="title-text w-100 ">
          <h5>Product Details</h5>
        </div>

        <div className="row row-container w-100 ">
          <div className="col-md-6 col-sm-12">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                value={productDetails?.name}
                readOnly
              />
              <input
                type="text"
                className="form-control"
                id="productId"
                name="productId"
                value={productDetails?.id}
                readOnly
                hidden
              />
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div className="form-group">
              <label>hsnCode</label>
              <input
                type="text"
                className="form-control"
                value={productDetails?.hsnCode}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                className="form-control"
                value={productDetails?.factory?.country}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div className="form-group">
              <label>Price </label>
              <input
                type="text"
                className="form-control"
                value={productDetails?.price}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-6 col-sm-12 ">
            <div className="form-group">
              <label>guarantee </label>
              <input
                type="email"
                className="form-control"
                value={productDetails?.guarantee}
                readOnly
              />
            </div>
          </div>

          {productDetails?.specialCharacteristics &&
            Object.keys(productDetails?.specialCharacteristics)?.length > 0 &&
            Object.keys(productDetails?.specialCharacteristics) != "" && (
              <div className="col-12 ">
                <label className="fw-600 mb-1">Product Characteristics</label>

                <div className="form-group form-control p-4 ">
                  <div className="row row-gap w-100">
                    {Object?.entries(
                      productDetails?.specialCharacteristics
                    )?.map(([key, value], index) => (
                      <div className="col-6">
                        <ReadOnly title={key} value={value} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          <div className="col-12">
            <div className="form-group">
              <label>description</label>
              <textarea
                type="text"
                className="form-control"
                value={productDetails?.description}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
