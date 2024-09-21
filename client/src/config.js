import io from "socket.io-client";
import { useTranslation } from "react-i18next";

export const baseUrl ='https://arab-made.com/api/v1'
export const baseUrl_IMG ='https://arab-made.com'


export const socket = io.connect(baseUrl_IMG, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  cors: {
    origin: "*",
  },
});

// export const useAppTranslation = () => {
//   const { t: trans, i18n } = useTranslation(["forms", "translation","BtnsDescription"]);
//   const currentLang = i18n.language;
//   return { trans, currentLang };
// };



// Custom function to use translation hook
export const useAppTranslation = () => {
  const { t: trans, i18n } = useTranslation([
    "forms",
    "translation",
    "BtnsDescription",
    "countries",
    "sectors",
  ]);
  const currentLang = i18n.language;
  return { trans, currentLang };
};
