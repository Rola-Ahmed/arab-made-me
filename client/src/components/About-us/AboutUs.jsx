import Questions from "components/Home/Questions/Questions";
import Header from "components/main/Header/Header";
import "./AboutUs.css";

// constants
import { about1, about2, about3 } from "constants/Images";

function AboutUs(props) {
  return (
    <>
      <Header title="About Arab Made" />
      <section className=" home-padding-y  margin-sm-screen">
        <div className="container">
          <div className="row justify-content-between ">
            <div className="col-lg-7   ">
              <div>
                <img className="photo-about" src={about1} alt="about-us" />
              </div>
            </div>
            <div className="col-lg-5 overflow-hidden ">
              <div className="about-texts ">
                <h2 className="about-text-1 w-sm-100">
                  {/* Top Class Web Development Agency */}
                  Arab-Made is a B2B platform
                </h2>
                <p className="about-text-2 about-text-3  w-100">
                  Arab-Made is a pioneering B2B platform revolutionizing
                  business connections across the Arab world, specializing in
                  private label services and comprehensive solutions that
                  empower manufacturers, suppliers, and buyers to streamline
                  operations and achieve their goals. With over 50 diverse
                  employees based in Egypt, Arab-Made supports small and medium
                  Arab businesses in expanding globally through an intuitive,
                  easy-to-use platform that promotes scalability and creates
                  value for shareholders.
                </p>
                <p className="about-text-2 w-100">
                  Arab-Made connects manufacturers, suppliers, and buyers,
                  offering enhanced visibility and streamlined transactions. Our
                  platform supports growth and efficiency for all parties
                  involved, ensuring a seamless experience.
                </p>
                <div className="about-nums d-none ">
                  <div className="about-num">
                    <h4>450</h4>
                    <p className="w-100">Happy Clients</p>
                  </div>
                  <div className="about-num">
                    <h4>95k</h4>
                    <p className="w-100">Hours Worked</p>
                  </div>
                  <div className="about-num">
                    <h4>850</h4>
                    <p className="w-100">Projects Done</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="home-padding-b margin-sm-screen">
        <div className="container">
          <div className="row ">
            <div className="col-lg-6 ">
              <h2 className="about-text-1 w-100 ">Our Mission & Vision</h2>
              <p className=" about-text-4 w-100 word-break">
                At Arab Made, we are leading global growth for Arab factories
                through a seamlessly integrated cross-border e-commerce
                platform. Our tailored and technology-driven approach ensures a
                secure and digitalized importing and exporting experience.
                Committed to consistency, we provide comprehensive services and
                foster a public image of ease and security. We strive to be the
                trusted partner for Arab factories and worldwide by empowering
                our employees and encouraging innovation.
              </p>
              <p className=" about-text-4 w-100 word-break">
                Arab-Made aims "to shape a brighter exporting economic future
                for Arab manufacturers" by upholding the highest standards of
                honesty, transparency, and ethical conduct. The platform fosters
                trust with customers, employees, and partners while ensuring
                product quality through a rigorous seller vetting process. With
                a commitment to convenience, Arab-Made allows buyers to easily
                and efficiently find and source products from Arab manufacturers
                through a variety of user-friendly features.
              </p>
            </div>
            <div className="col-lg-6 parent-about ">
              <div>
                <img
                  className="photo-about-section21"
                  src={about2}
                  alt="about-us"
                />
                <img
                  className="photo-about-section22"
                  src={about3}
                  alt="about-us"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Questions />
    </>
  );
}

export default AboutUs;
