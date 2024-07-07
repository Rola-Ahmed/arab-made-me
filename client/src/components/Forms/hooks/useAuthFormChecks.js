import { useContext } from "react";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import ImporterUnVerifiedFullScreen from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedFullScreen";
import ImporterUnVerifiedDash from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedDash";
import FormValidation from "components/ActionMessages/FormAccessControl/FormValidation";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";
import LoadingForm2 from "components/Loading/LoadingForm2";

function useAuthFormChecks(isLoading, headerTitle, pagePath) {
  // console.log("pagePath", pagePath);
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  if (!isLogin) {
    return (
      <IsLoggedIn
        show={true}
        distination={`/signIn/${pagePath}`}
        bgBlur={"bg-blur"}
      />
    );
  }

  if (currentUserData && !currentUserData.datacompletelyLoaded) {
    if (currentUserData.factoryId != null) {
      return <FormValidation show={true} userType="Buyer" />;
    }

    if (
      currentUserData.importerId != null &&
      (currentUserData.importerVerified === "0" ||
        !currentUserData.importerEmailActivated)
    ) {
      return <ImporterUnVerifiedFullScreen show={true} />;
    }

    if (
      currentUserData.factoryId == null &&
      currentUserData.importerId == null
    ) {
      return <FormValidation show={true} userType="Buyer" />;
    }
  }

  if (isLoading?.pageLoading) {
    return <LoadingForm2 title={headerTitle} />;
  }

  // return null;
  return <ImporterUnVerifiedFullScreen show={true} />;
  // return <ImporterUnVerifiedDash show={true} />;
}

export default useAuthFormChecks;
