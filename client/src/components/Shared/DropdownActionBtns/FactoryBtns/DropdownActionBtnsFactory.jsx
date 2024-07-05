import PropTypes from "prop-types";
import DropdownMenuItem from "./DropdownMenuItem";

const DropdownActionBtnsFactory = ({
  currentUserData,
  factoryitem,
  BtnDescription,
  handleQuestionMarkClick,
  handleBtnCheckIfProductExisit,
  handleUserClickValidation1,
  handleUserClickValidLogin,
}) => {
  return (
    <div className="text-dark text-decoration-none cursor">
      {currentUserData?.datacompletelyLoaded ? (
        <i className="fas fa-spinner fa-spin text-dark"></i>
      ) : (
        <i className="ellipsis px-2 py-3 fa-solid fa-ellipsis-vertical"></i>
      )}
      {!currentUserData?.datacompletelyLoaded && (
        <ul className="dropdown-menu-top p-3 m-2">
          <div className="parent-buttons-container cursor">
            <DropdownMenuItem
              title="Custom Product Request"
              onClick={() =>
                handleUserClickValidation1(
                  `CustomerProductReq?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`
                )
              }
              description={BtnDescription.customProductRequest}
              handleQuestionMarkClick={handleQuestionMarkClick}
            />
            <DropdownMenuItem
              title="White Label Request"
              onClick={() =>
                handleUserClickValidation1(
                  `whiteLabelings/form?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`
                )
              }
              description={BtnDescription.whiteLabelRequest}
              handleQuestionMarkClick={handleQuestionMarkClick}
            />
            <DropdownMenuItem
              title="Send RFQ"
              onClick={() =>
                handleBtnCheckIfProductExisit(
                  `sendrfq?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`,
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
                  `purchasingOrder/fromfactory?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`,
                  factoryitem?.productLength,
                  factoryitem?.id,
                  factoryitem?.name
                )
              }
              description={BtnDescription.PO}
              handleQuestionMarkClick={handleQuestionMarkClick}
            />
            <DropdownMenuItem
              title="Factory Visit Request"
              onClick={() =>
                handleUserClickValidation1(
                  `requestVisit?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`
                )
              }
              description={BtnDescription.factoryVisitRequest}
              handleQuestionMarkClick={handleQuestionMarkClick}
            />
          </div>
        </ul>
      )}
    </div>
  );
};

DropdownActionBtnsFactory.propTypes = {
  currentUserData: PropTypes.object.isRequired,
  factoryitem: PropTypes.object.isRequired,
  BtnDescription: PropTypes.object.isRequired,
  handleQuestionMarkClick: PropTypes.func.isRequired,
  handleBtnCheckIfProductExisit: PropTypes.func.isRequired,
  handleUserClickValidation1: PropTypes.func.isRequired,
  handleUserClickValidLogin: PropTypes.func.isRequired,
};

DropdownActionBtnsFactory.defaultProps = {
  currentUserData: {},
  factoryitem: {},
  BtnDescription: {
    customProductRequest: "",
    whiteLabelRequest: "",
    RFQ: "",
    PO: "",
    factoryVisitRequest: "",
  },
  handleQuestionMarkClick: () => {},
  handleBtnCheckIfProductExisit: () => {},
  handleUserClickValidation1: () => {},
  handleUserClickValidLogin: () => {},
};

export default DropdownActionBtnsFactory;

// export default function DropdownActionBtnsFactory({
//   currentUserData,
//   factoryitem,
//   BtnDescription,
//   handleQuestionMarkClick,
//   handleBtnCheckIfProductExisit,
//   handleUserClickValidation1,
//   handleUserClickValidLogin,
// }) {
//   console.log(
//     "EDededede",
//     currentUserData,
//     factoryitem,
//     BtnDescription,
//     handleQuestionMarkClick,
//     handleBtnCheckIfProductExisit,
//     handleUserClickValidation1,
//     handleUserClickValidLogin
//   );
//   return <div>DropdownActionBtnsFactory</div>;
// }
