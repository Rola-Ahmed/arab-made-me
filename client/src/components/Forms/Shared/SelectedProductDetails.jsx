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
              <label>Sku</label>
              <input
                type="text"
                className="form-control"
                value={productDetails?.Sku || ""}
                readOnly
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
                value={productDetails?.country}
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

          <div className="col-md-6 col-sm-12">
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
