import io from "socket.io-client";
import { useTranslation } from "react-i18next";


export const baseUrl =
  process.env.REACT_APP_NODE_ENV == "production"
    ? process.env.REACT_APP_BASE_URL
    : process.env.REACT_APP_DEV_BASE_URL;

export const baseUrl_IMG =
  process.env.REACT_APP_NODE_ENV == "production"
    ? process.env.REACT_APP_IMAGE_URL
    : process.env.REACT_APP_DEV_IMAGE_URL;


export const map_api_Key = "gqEosgdSKdu6kLxXYi6ubsnOdssVsZL4EV8K60I7Xr4";


export const socket = io.connect(baseUrl_IMG, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  cors: {
    origin: "*",
  },
});


// const { t: trans, i18n } = useTranslation();
// const currentLang = i18n.language; // 'languages' gives an array; use 'language' for the current language

// export { trans, currentLang };


// Custom function to use translation hook
export const useAppTranslation = () => {
  const { t: trans, i18n } = useTranslation();
  const currentLang = i18n.language;
  return { trans, currentLang };
};