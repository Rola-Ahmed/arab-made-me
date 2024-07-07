import Questions from "components/Home/Questions/Questions";
import Header from "components/main/Header/Header";
import "./AboutUs.css";

// constants
import { about1, about2, about3 } from "constants/Images";

function AboutUs(props) {
  return (
    <>
      <Header title="About Arab Made"  />
      <section className="section-about-1 margin-sm-screen">
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
                  Top Class Web Development Agency
                </h2>
                <p className="about-text-2 about-text-3  w-100">
                  We are an experienced and talented team of passionate
                  developers who lives and breathe in web design and
                  development.
                </p>
                <p className="about-text-2 w-100">
                  We have many clients around the world like United States,
                  Australia, United Kingdom, Canada, France, Germany, and many
                  more.
                </p>
                <div className="about-nums">
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
      <section className="section-about-2  margin-sm-screen">
        <div className="container">
          <div className="row ">
            <div className="col-lg-6 ">
              <h2 className="about-text-1 w-100 ">Our Mission & Vision</h2>
              <p className=" about-text-4 w-100 word-break">
                We believe in creating technology that enhances the growth of
                your business around the world. Our vision is to design and
                deliver cutting-edge website solutions, E-commerce website &
                Digital marketing that help businesses become more sustainable.
                We understand the customized need of each client, and partner
                with them to create superior value for their businesses. Our
                team consists of highly skilled consultants, website developers,
                digital marketers, and executives. We aim to exceed the
                expectations of the clients by continually making our products
                and services better
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
