import React, { useEffect } from "react";
import Products from "./Products/Products";
import Questions from "./Questions/Questions";
import TopFactories from "./TopFactories/FetchTopFactories";
// import TopFactories from "./TopFactories/TopFactories";
import About from "./about/About";
import Companies from "./companies/Companies";
import Hero from "./hero-section/Hero";
import Sectors from "./sectors/Sectors";
import Freq from "./freq/Freq";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sourcingh from "./sourcingh/Sourcingh";
import { Chat } from "@aidbase/chat";
function Home() {
  
  if (localStorage.getItem("ToHomePage")) {
    // if true then direct only to the holme page
    // there is two conditions either success message or page is not found

    if (localStorage.getItem("ToHomePage") !== "true") {
      if (localStorage.getItem("ToHomePage") === "Page Not Found") {
        toast(localStorage.getItem("ToHomePage"), {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          // //pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          type: "error",
        });
        // ferfref
      } else {
        toast(localStorage.getItem("ToHomePage"), {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          type: "success",
        });
      }
    }

    localStorage.removeItem("ToHomePage");
  }
  document.title = "Home";

  return (
    <>
      <ToastContainer />
      <Hero />
      <Companies />
      <Sourcingh />
      <Sectors />
      <TopFactories />
      <Products />
      <About />
      <Freq />
      <Questions />
    </>
  );
}

export default Home;
