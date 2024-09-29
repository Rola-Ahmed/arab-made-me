import { useState } from "react";
import { updateSourcingOfferMedia } from "Services/sourcingOffer";
import SuccessToast from "components/SuccessToast";
import ErrorToast from "components/ErrorToast";

export default function useBannerUpload(isLogin, requestedData, setRequestedData,handleClose) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSingleFileUpload = (fileKeyword, fileValue, index) => {
    const formData = new FormData();
    formData.append(fileKeyword, fileValue);
    formData.append("index", index);
    return formData;
  };

  const handleBannerUploads = async (data, actionType) => {
    setIsLoading(true);
    const result = await updateSourcingOfferMedia(requestedData?.id, { Authorization: isLogin }, data);

    if (result?.success) {
      SuccessToast("Data updated successfully");
      handleClose();

      setRequestedData(prev => ({
        ...prev,
        ...result?.data?.sourcingOffer,
      }));
    } else {
      if (actionType === "delete") {
        ErrorToast(result?.error);
      } else {
        setErrorMsg(prev => ({
          ...prev,
          response: result?.error,
        }));
      }
    }
    setIsLoading(false);
    setTimeout(() => {
        document.body.style.cursor = "default";
      }, 5000); // 5000 milliseconds = 5 seconds
  };

  const handleAddBanner = async (e, selectedDocs, index) => {
    e.preventDefault();
    document.body.style.cursor = "wait";
    const data = handleSingleFileUpload(selectedDocs?.[0]?.keyWord, selectedDocs?.[0]?.pdfFile, index);
    await handleBannerUploads(data, "add");
  };

  const handleDeleteBanner = async (index) => {
    document.body.style.cursor = "wait";
    const data = handleSingleFileUpload("images", null, index);
    await handleBannerUploads(data, "delete");
  };

  return {
    isLoading,
    errorMsg,
    handleAddBanner,
    handleDeleteBanner,
    setErrorMsg,
  };
}
