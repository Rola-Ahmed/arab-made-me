
const DropdownMenuItem = ({
  title,
  onClick,
  description,
  handleQuestionMarkClick,
}) => (
  <div className="d-flex align-items-center gap-2">
    <div className="text-container cursor" onClick={onClick}>
      <p className="cursor">{title}</p>
    </div>
    <button
      className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
      title={description}
      onClick={() => handleQuestionMarkClick(description)}
    ></button>
  </div>
);

const DropdownActionBtnsFactory = ({
  currentUserData,
  factoryitem,
  BtnDescription,
  handleQuestionMarkClick,
  handleBtnCheckIfProductExisit,
  handleUserClickValidation1,
}) => (
  <div className="text-dark text-decoration-none cursor">
    {currentUserData?.datacompletelyLoaded ? (
      <i className="fas fa-spinner fa-spin text-dark"></i>
    ) : (
      <i className="ellipsis px-2 py-3 fa-solid fa-ellipsis-vertical"></i>
    )}
    {/* if fa-spinner appears then the ul won't appear */}
    <ul className="dropdown-menu-top p-3 m-2">
      <div className="parent-buttons-container cursor">
        <DropdownMenuItem
          title="Custom Product Request"
          onClick={() =>
            handleUserClickValidation1(
              `CustomerProductReq?factoryId=${factoryitem?.factoryId}&factoryName=${factoryitem?.factory?.name}`
            )
          }
          description={BtnDescription.customProductRequest}
          handleQuestionMarkClick={handleQuestionMarkClick}
        />
        <DropdownMenuItem
          title="White Label Request"
          onClick={() =>
            handleUserClickValidation1(
              `whiteLabelings/form?factoryId=${factoryitem?.factoryId}&factoryName=${factoryitem?.factory?.name}`
            )
          }
          description={BtnDescription.whiteLabelRequest}
          handleQuestionMarkClick={handleQuestionMarkClick}
        />
        <DropdownMenuItem
          title="Send RFQ"
          onClick={() =>
            handleBtnCheckIfProductExisit(
              `sendrfq?factoryId=${factoryitem?.factoryId}&factoryName=${factoryitem?.factory?.name}`,
              factoryitem?.productLength,
              factoryitem?.id,
              factoryitem?.name
            )
          }
          description={BtnDescription.RFQ}
          handleQuestionMarkClick={handleQuestionMarkClick}
        />
        <DropdownMenuItem
          title="Send PO"
          onClick={() =>
            handleBtnCheckIfProductExisit(
              `purchasingOrder?factoryId=${factoryitem?.factoryId}&factoryName=${factoryitem?.factory?.name}`,
              factoryitem?.productLength,
              factoryitem?.id,
              factoryitem?.name
            )
          }
          description={BtnDescription.PO}
          handleQuestionMarkClick={handleQuestionMarkClick}
        />
        {/* <DropdownMenuItem
          title="Contact Supplier"
          onClick={() =>
            handleIsLoggedInBtn(
              `contactsupplier?userId=${factoryitem?.factory?.userId}&factoryName=${factoryitem?.factory?.name}`
            )
          }
          description={BtnDescription.contactSupplier}
          handleQuestionMarkClick={handleQuestionMarkClick}
        /> */}
        <DropdownMenuItem
          title="Factory Visit Request"
          onClick={() =>
            handleUserClickValidation1(
              `requestVisit?factoryId=${factoryitem?.factoryId}&factoryName=${factoryitem?.factory?.name}`
            )
          }
          description={BtnDescription.factoryVisitRequest}
          handleQuestionMarkClick={handleQuestionMarkClick}
        />
      </div>
    </ul>
  </div>
);

export default DropdownActionBtnsFactory;
