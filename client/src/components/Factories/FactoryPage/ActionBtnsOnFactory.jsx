import React from "react";

export default function ActionBtnsOnFactory(props) {
  const {
    factoryDetails,
    factoryProduct,
    setFactoryHasProduct,
    handleButtonClick,
    handleIsLoggedInBtn,
  } = props;
  return (
    <div className=" text-dark text-decoration-none cursor ">
      <i
        class=" ellipsis  fa-solid fa-ellipsis-vertical "
        onMouseEnter={() => {
          document
            .getElementById(factoryDetails?.id)
            .classList.toggle("d-block");
        }}
      ></i>

      <ul
        className="dropdown-menu-top 
          p-3 m-2 "
        onMouseLeave={() => {
          setTimeout(() => {
            document
              .getElementById(factoryDetails?.id)
              .classList.toggle("d-block");
          }, 500); // Adjust the delay time as needed
        }}
        id={factoryDetails?.id}
      >
        <div className="parent-buttons-container cursor">
          <div
            className={`text-container`}
            onClick={() => {
              handleButtonClick(
                `privatelabel?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`,
                
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
                `sendrfq?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`,
                "ToSendRFQ"
              );
            }}
          >
            <p className={`cursor`}>Send RFQ</p>
          </button>

          <button
            className={`text-container`}
            onClick={() => {
              // cant send rfq or po if factory has no products
              if (factoryProduct?.length == 0) {
                setFactoryHasProduct(true);
                return;
              }
              handleButtonClick(
                `purchasingOrder?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`,
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
                `contactsupplier?userId=${factoryDetails?.userId}&factoryName=${factoryDetails?.name}`,
                
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
