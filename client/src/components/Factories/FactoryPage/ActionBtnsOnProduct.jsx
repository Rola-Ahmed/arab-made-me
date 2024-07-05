export default function ActionBtnsOnProduct(props) {
  const {
    factoryDetails,
    factoryProduct,
    setFactoryHasProduct,
    handleButtonClick,
    handleIsLoggedInBtn,
    productItem,
  } = props;
  return (
    <div className=" text-dark text-decoration-none cursor">
      <i class=" ellipsis  fa-solid fa-ellipsis-vertical "></i>

      <ul
        className="dropdown-menu-top 
    p-3 m-2"
      >
        <div className="parent-buttons-container cursor">
          <div
            className={`text-container`}
            onClick={() => {
              handleButtonClick(
                `privatelabel?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
              );
            }}
          >
            <p className={`cursor`}> Private Label Request</p>
          </div>

          <div
            className="text-container "
            onClick={() => {
              handleButtonClick(
                `CustomerProductReq?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`,
                "ToCustomerProductReq"
              );
            }}
          >
            <p className="cursor">Custom Product Request</p>
          </div>

          <button
            className={`text-container  `}
            onClick={() => {
              if (factoryProduct?.length == 0) {
                setFactoryHasProduct(true);
                return;
              }
              handleButtonClick(
                `sendrfq?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}&productId=${productItem?.id}&productName=${productItem?.name}`,
                "ToSendRFQ"
              );
            }}
          >
            <p className={`cursor`}>Send RFQ</p>
          </button>

          <button
            className={`text-container`}
            onClick={() => {
              if (factoryProduct?.length == 0) {
                setFactoryHasProduct(true);
                return;
              }
              handleButtonClick(
                `purchasingOrder/fromfactory?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}&productId=${productItem?.id}&productName=${productItem?.name}`,
                "ToPurchasingOrder"
              );
            }}
          >
            <p className="cursor">Send PO</p>
          </button>

          <button
            className="text-container "
            onClick={() => {
              handleIsLoggedInBtn(
                `contactsupplier?userId=${factoryDetails?.userId}&factoryName=${factoryDetails?.name}`
              );
            }}
          >
            <p className="cursor">Contact Supplier</p>
          </button>

          <div
            className="text-container "
            onClick={() => {
              handleButtonClick(
                `requestVisit?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`,
                "ToRequestVisit"
              );
            }}
          >
            <p className="cursor">Factory Visit Request</p>
          </div>
        </div>
      </ul>
      {/*  */}
    </div>
  );
}
