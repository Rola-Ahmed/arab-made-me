import ReactDOM from "react-dom/client";
import "./index.css";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "assets/css/pagination.css";
import "assets/css/forms.css";
import "assets/css/all.min.css";
import { UserTokenProvider } from "./Context/userToken";
import { UserTypeProvider } from "./Context/userType";
import { GlobalMessage } from "./Context/globalMessage";
import "./i18n";
import { useAppTranslation } from "config.js";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
// const {currentLang } = useAppTranslation();

// root.render(
//   <UserTokenProvider>
//     <UserTypeProvider>
//       <GlobalMessage>
//         <main lang={currentLang}>
//           <App />
//         </main>
//       </GlobalMessage>
//     </UserTypeProvider>
//   </UserTokenProvider>
// );

function RootComponent() {
  const { currentLang } = useAppTranslation();

  return (
    <UserTokenProvider>
      <UserTypeProvider>
        <GlobalMessage>
          <main lang={currentLang}>
            <App />
          </main>
        </GlobalMessage>
      </UserTypeProvider>
    </UserTokenProvider>
  );
}

// Render the root component
root.render(<RootComponent />);