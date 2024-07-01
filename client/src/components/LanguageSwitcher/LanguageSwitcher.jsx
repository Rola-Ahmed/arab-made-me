import React from "react";
import "./LanguageSwitcher.css";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const languageNames = {
    en: " English -En",
    "en-us": "English (US)",
    "en-gb": "English (UK)",
    "en-gb": "English (UK)",
    ar: " العربيه -Ar",
  };

  const currentLanguageCode = i18n.language;
  const currentLanguageName =
    languageNames[currentLanguageCode] || currentLanguageCode;

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="Lang-cont">
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle bg-light text-black fs-12"
          type="button"
          id="langMenuBtn"
          //   data-toggle="dropdown"
          // aria-bs-haspopup="true"
          // aria-bs-expanded="false"
          aria-haspopup="true"
          aria-expanded="false"
          data-bs-toggle="dropdown"
        >
          {currentLanguageName}
        </button>
        <div
          className="dropdown-menu"
          aria-labelledby="langMenuBtn"
          id="local-btns"
        >
          <button
            onClick={() => changeLanguage("en")}
            className="dropdown-item "
          >
            English -En
          </button>
          <button
            id="local-btns"
            onClick={() => changeLanguage("ar")}
            className="dropdown-item "
          >
            العربيه -Ar{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
