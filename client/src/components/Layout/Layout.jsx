import { Outlet } from "react-router-dom";
import Navbar from "components/main/Navbar/Navbar";
import Footer from "components/main/Footer/Footer";
// import { useTranslation } from "react-i18next";
export default function Layout() {
  // const { t } = useTranslation(["forms", "translation"]);
  // const { t } = useTranslation();
  return (
    <>
      {/* <h1>{t("translation:home")}</h1>
      {t("forms:quantity")}
      <h1>{t("packingConditions", { ns: "forms" })}</h1>
      <h1>{t("home", { ns: "translation" })}</h1> */}
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
