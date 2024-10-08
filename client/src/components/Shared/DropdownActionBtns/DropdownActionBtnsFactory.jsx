import PropTypes from "prop-types";
import DropdownMenuItem from "./DropdownMenuItem";
import { useAppTranslation } from "config.js";

const DropdownActionBtnsFactory = ({
  currentUserData,
  factoryitem,
  // BtnDescription,
  handleQuestionMarkClick,
  handleBtnCheckIfProductExisit,
  handleUserClickValidation1,
  // handleUserClickValidLogin,
}) => {
  const { trans: t } = useAppTranslation();
  return (
    <div className="text-dark text-decoration-none cursor">
      {currentUserData?.datacompletelyLoaded ? (
        <i className="fas fa-spinner fa-spin text-dark"></i>
      ) : (
        // <i className="ellipsis px-2 py-3 fa-solid fa-ellipsis-vertical"></i>
        <i className="ellipsis  fa-solid fa-ellipsis-vertical py-2 px-1"></i>
      )}
      {!currentUserData?.datacompletelyLoaded && (
        <ul className="dropdown-menu-top p-3 m-2">
          <div>
            <DropdownMenuItem
              title={t("BtnsDescription:customProductRequest.name")}
              onClick={() =>
                handleUserClickValidation1(
                  `CustomerProductReq?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`
                )
              }
              description={t(
                "BtnsDescription:customProductRequest.description"
              )}
              handleQuestionMarkClick={handleQuestionMarkClick}
            />
            <DropdownMenuItem
              title={t("BtnsDescription:whiteLabelRequest.name")}
              onClick={() =>
                handleUserClickValidation1(
                  `whiteLabelings/form?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`
                )
              }
              description={t("BtnsDescription:whiteLabelRequest.description")}
              handleQuestionMarkClick={handleQuestionMarkClick}
            />
            {/* // ---------------------DONT REMOVE IT WILL USE IT AGAIN--------------- */}
            {/* <DropdownMenuItem
              title={t("BtnsDescription:RFQ.sendRfq")}
              onClick={() =>
                handleBtnCheckIfProductExisit(
                  `sendrfq?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`,
                  factoryitem?.products?.length,
                  factoryitem?.id,
                  factoryitem?.name
                )
              }
              description={t("BtnsDescription:RFQ.description")}
              handleQuestionMarkClick={handleQuestionMarkClick}
            /> */}
            <DropdownMenuItem
              title={t("BtnsDescription:privateLabelRequest.name")}
              onClick={() =>
                handleUserClickValidation1(
                  `privatelabel?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name} `
                )
              }
              description={t("BtnsDescription:privateLabelRequest.description")}
              handleQuestionMarkClick={handleQuestionMarkClick}
            />
            <DropdownMenuItem
              title={t("BtnsDescription:PO.sendPo")}
              onClick={() =>
                handleBtnCheckIfProductExisit(
                  `purchasingOrder/fromfactory?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`,
                  factoryitem?.products?.length,
                  factoryitem?.id,
                  factoryitem?.name
                )
              }
              description={t("BtnsDescription:PO.description")}
              handleQuestionMarkClick={handleQuestionMarkClick}
            />
            <DropdownMenuItem
              title={t("BtnsDescription:factoryVisitRequest.name")}
              onClick={() =>
                handleUserClickValidation1(
                  `requestVisit?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`
                )
              }
              description={t("BtnsDescription:factoryVisitRequest.description")}
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
  // BtnDescription: PropTypes.object.isRequired,
  handleQuestionMarkClick: PropTypes.func.isRequired,
  handleBtnCheckIfProductExisit: PropTypes.func.isRequired,
  handleUserClickValidation1: PropTypes.func.isRequired,
  // handleUserClickValidLogin: PropTypes.func.isRequired,
};

DropdownActionBtnsFactory.defaultProps = {
  currentUserData: {},
  factoryitem: {},
  // BtnDescription: {
  //   customProductRequest: "",
  //   whiteLabelRequest: "",
  //   RFQ: "",
  //   PO: "",
  //   factoryVisitRequest: "",
  // },
  handleQuestionMarkClick: () => {},
  handleBtnCheckIfProductExisit: () => {},
  handleUserClickValidation1: () => {},
  // handleUserClickValidLogin: () => {},
};

export default DropdownActionBtnsFactory;
