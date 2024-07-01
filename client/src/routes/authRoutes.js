// Auth
import Sign from "components/Auth/Sign/Sign";
import SignUp from "components/Auth/SignUp/SignUp";
import ForgotPassword from "components/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "components/Auth/ResetPassword/ResetPassword";
import UserType from "components/Auth/UserType/UserType";

// factory registration
import CompanyRegistration from "components/Auth/FactorySignUp/CompanyRegistration";
import CompanyRegistrationPhase2 from "components/Auth/FactorySignUp/CompanyRegistrationPhase2";
import CompanyMircoSiteDocs from "components/Auth/FactorySignUp/CompanyMircoSiteDocs";
import FactoryRepInfoRegistration from "components/Auth/FactorySignUp/FactoryRepInfoRegistration";
import FactoryLegalDocs from "components/Auth/FactorySignUp/FactoryLegalDocs";

// Buyer registration
import ImporterRepDetails from "components/Auth/ImporterSignUp/ImporterRepDetails";
import ImporterLegalDocs from "components/Auth/ImporterSignUp/ImporterLegalDocs";

// full screen
// import ImporterUnVerifiedFullScreen from "components/ActionMessages/ImporterUnVerifiedFullScreen/ImporterUnVerifiedFullScreen";

// action message
import SignUpMessage from "components/ActionMessages/SignUpMessage/SignUpMessage";
import ResetPasswordMsg from "components/ActionMessages/ResetPasswordMsg/ResetPasswordMsg";
import EmailActivatedMsg from "components/ActionMessages/EmailActivatedMsg/EmailActivatedMsg";
import FactoryEmailActivatedMsg from "components/ActionMessages/FactoryEmailActivatedMsg/FactoryEmailActivatedMsg";
import ImporterEmailActivatedMsg from "components/ActionMessages/ImporterEmailActivatedMsg/ImporterEmailActivatedMsg";


const authRoutes = [
  // Splats
  // Also known as "catchall" and "star" segments. If a route path pattern ends with /* then it will match any characters following the /, including other / characters.
  {
    // this path will match URLs like
    // - /files
    // - /files/one
    // - /files/one/two
    // - /files/one/two/three

    path: "/signIn/*",
    element: <Sign />,
  },
  {
    path: "/userType",
    element: <UserType />,
  },
  {
    path: "/login/identify",
    element: <ForgotPassword />,
  },
  {
    path: "/recover/account/:message?",
    element: <ResetPasswordMsg />,
  },
  {
    path: "user/reset-password/change",
    element: <ResetPassword />,
  },

  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path: "/buyerRegistration",

    element: <ImporterRepDetails />,
  },
  {
    path: "/buyerRegistration/LegalDocuments",

    element: <ImporterLegalDocs />,
  },

  {
    path: "/CompanyDetails",
    element: <CompanyRegistration />,
  },
  {
    path: "/CompanyDetails/setp2",
    element: <CompanyRegistrationPhase2 />,
  },

  {
    path: "/CompanyDetails/MircoSiteDocs",
    element: <CompanyMircoSiteDocs />,
  },

  {
    path: "/CompanyDetails/RepresentiveDetails",
    element: <FactoryRepInfoRegistration />,
  },

  {
    path: "/CompanyDetails/LegalDocuments",
    element: <FactoryLegalDocs />,
  },

  {
    path: "/SignUpVerification",
    element: <SignUpMessage />,
  },
  {
    path: "/emailActivation",
    element: <EmailActivatedMsg />,
  },

  {
    path: "/factory/emailActivation",
    element: <FactoryEmailActivatedMsg />,
  },
  {
    path: "/importer/emailActivation",
    element: <ImporterEmailActivatedMsg />,
  },

  

  // {
  //   path: "/buyer/verification",
  //   element: <ImporterUnVerifiedFullScreen />,
  // },
];

export default authRoutes;
