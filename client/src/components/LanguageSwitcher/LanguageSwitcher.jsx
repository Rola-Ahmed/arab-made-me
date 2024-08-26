import "./LanguageSwitcher.css";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const languageNames = {
    en: " English",
    "en-us": "English",
    "en-US": "English",
    // "en-gb": "English (UK)",
    // "en-gb": "English (UK)",
    ar: " العربيه",
  };

  const currentLanguageCode = i18n.language;
  const currentLanguageName =
    languageNames[currentLanguageCode] || currentLanguageCode;

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="Lang-cont">
      <div className="dropdown w-fit-content mx-auto">
        <button
          className="show-lang btn btn-secondary dropdown-toggle  text-black fs-16 bg-transparent border-0"
          type="button"
          id="langMenuBtn"
          //   data-toggle="dropdown"
          // aria-bs-haspopup="true"
          // aria-bs-expanded="false"
          aria-haspopup="true"
          aria-expanded="false"
          data-bs-toggle="dropdown"
        >
          <i className="fa-solid fa-globe color-white me-2"></i>{" "}
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
            العربيه -Ar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
