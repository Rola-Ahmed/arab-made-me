import Products from "./Products/Products";
import Questions from "./Questions/Questions";
import TopFactories from "./TopFactories/FetchTopFactories";
import About from "./about/About";
import Companies from "./companies/Companies";
import Hero from "./hero-section/Hero";
import Sectors from "./sectors/Sectors";
import Freq from "./freq/Freq";
import SourcingHub from "./SourcingHub/SourcingHub";

function Home() {
  document.title = "Home";

  return (
    <>
      <Hero />
      <Companies />
      <SourcingHub />
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
