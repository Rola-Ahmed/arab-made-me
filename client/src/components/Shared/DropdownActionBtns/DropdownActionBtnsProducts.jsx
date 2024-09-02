import DropdownMenuItem from "./DropdownMenuItem";
import { useAppTranslation } from "config.js";

const DropdownActionBtnsProducts = ({
  currentUserData,
  productItem,
  // BtnDescription,
  handleButtonClick,
  handleQuestionMarkClick,
  // handleIsLoggedInBtn,
}) => {
  const { trans: t } = useAppTranslation();
  return (
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
            title={t("BtnsDescription:customProductRequest.name")}
            onClick={() =>
              handleButtonClick(
                `CustomerProductReq?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
              )
            }
            description={t("BtnsDescription:customProductRequest.description")}
            handleQuestionMarkClick={handleQuestionMarkClick}
          />
          <DropdownMenuItem
            title={t("BtnsDescription:whiteLabelRequest.name")}
            onClick={() =>
              handleButtonClick(
                `whiteLabelings/form?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
              )
            }
            description={t("BtnsDescription:whiteLabelRequest.description")}
            handleQuestionMarkClick={handleQuestionMarkClick}
          />
          <DropdownMenuItem
            title={t("BtnsDescription:RFQ.sendRfq")}
            onClick={() =>
              handleButtonClick(
                `sendrfq?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
              )
            }
            description={t("BtnsDescription:RFQ.description")}
            handleQuestionMarkClick={handleQuestionMarkClick}
          />
          <DropdownMenuItem
            title={t("BtnsDescription:PO.sendPo")}
            onClick={() =>
              handleButtonClick(
                `purchasingOrder/fromSelectedProduct?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
              )
            }
            description={t("BtnsDescription:PO.description")}
            handleQuestionMarkClick={handleQuestionMarkClick}
          />

          <DropdownMenuItem
            title={t("BtnsDescription:factoryVisitRequest.name")}
            onClick={() =>
              handleButtonClick(
                `requestVisit?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}`
              )
            }
            description={t("BtnsDescription:factoryVisitRequest.description")}
            handleQuestionMarkClick={handleQuestionMarkClick}
          />
        </div>
      </ul>
    </div>
  );
};

export default DropdownActionBtnsProducts;
