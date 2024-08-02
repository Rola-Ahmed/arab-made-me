import ReactDOM from "react-dom/client";
import "./index.css";
import "./pagination.css";

import App from "./App";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "assets/css/all.min.css";

import { UserTokenProvider } from "./Context/userToken";
import { UserTypeProvider } from "./Context/userType";
import { GlobalMessage } from "./Context/globalMessage";
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserTokenProvider>
    <UserTypeProvider>
      <GlobalMessage>
        <App />
      </GlobalMessage>
    </UserTypeProvider>
  </UserTokenProvider>
);
