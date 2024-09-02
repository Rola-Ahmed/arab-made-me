import DropdownMenuItem from "./DropdownMenuItem";
const DropdownActionBtnsProducts = ({
  currentUserData,
  productItem,
  BtnDescription,
  handleButtonClick,
  handleQuestionMarkClick,
  handleIsLoggedInBtn,
}) => (
  <div className="text-dark text-decoration-none cursor">
    {currentUserData?.datacompletelyLoaded ? (
      <i className="fas fa-spinner fa-spin text-dark"></i>
    ) : (
      <i className="ellipsis px-2 py-3 fa-solid fa-ellipsis-vertical"></i>
    )}
    {/* if fa-spinner appears then the ul won't appear */}
    <ul className="dropdown-menu-top p-3 m-2">
      <div>
        <DropdownMenuItem
          title="Custom Product Request"
          onClick={() =>
            handleButtonClick(
              `CustomerProductReq?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
            )
          }
          description={BtnDescription.customProductRequest}
          handleQuestionMarkClick={handleQuestionMarkClick}
        />
        <DropdownMenuItem
          title="White Label Request"
          onClick={() =>
            handleButtonClick(
              `whiteLabelings/form?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
            )
          }
          description={BtnDescription.whiteLabelRequest}
          handleQuestionMarkClick={handleQuestionMarkClick}
        />
        <DropdownMenuItem
          title="Send RFQ"
          onClick={() =>
            handleButtonClick(
              `sendrfq?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
            )
          }
          description={BtnDescription.RFQ}
          handleQuestionMarkClick={handleQuestionMarkClick}
        />
        <DropdownMenuItem
          title="Send PO"
          onClick={() =>
            handleButtonClick(
              `purchasingOrder/fromSelectedProduct?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
            )
          }
          description={BtnDescription.PO}
          handleQuestionMarkClick={handleQuestionMarkClick}
        />
        {/* <DropdownMenuItem
          title="Contact Supplier"
          onClick={() =>
            handleIsLoggedInBtn(
              `contactsupplier?userId=${productItem?.factory?.userId}&factoryName=${productItem?.factory?.name}`
            )
          }
          description={BtnDescription.contactSupplier}
          handleQuestionMarkClick={handleQuestionMarkClick}
        /> */}
        <DropdownMenuItem
          title="Factory Visit Request"
          onClick={() =>
            handleButtonClick(
              `requestVisit?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}`
            )
          }
          description={BtnDescription.factoryVisitRequest}
          handleQuestionMarkClick={handleQuestionMarkClick}
        />
      </div>
    </ul>
  </div>
);

export default DropdownActionBtnsProducts;
