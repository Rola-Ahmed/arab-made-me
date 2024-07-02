import { Outlet } from "react-router-dom";
import Navbar from "components/main/Navbar/Navbar";
import Footer from "components/main/Footer/Footer";
import { useTranslation } from "react-i18next";
export default function Layout() {
  const { t } = useTranslation(["factory", "translation"]);
  return (
    <>
      {/* <h1>{t("translation:welcome_message")}</h1> */}
      {/* <h1>{t("factoryData", { ns: "factory" })}</h1> */}
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
