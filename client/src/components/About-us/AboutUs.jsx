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
                  Arab-Made is a pioneering B2B platform dedicated to
                  transforming the way businesses across the Arab world connect
                  and collaborate. We specialize in private label services,
                  offering a comprehensive suite of solutions that empower
                  manufacturers, suppliers, and buyers to streamline their
                  operations and achieve their business goals.
                </p>
                <p className="about-text-2 w-100">
                  Arab-Made connects manufacturers, suppliers, and buyers,
                  offering enhanced visibility and streamlined transactions. Our
                  platform supports growth and efficiency for all parties
                  involved, ensuring a seamless experience.
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
      <section className="home-padding-b margin-sm-screen">
        <div className="container">
          <div className="row ">
            <div className="col-lg-6 ">
              <h2 className="about-text-1 w-100 ">Our Mission & Vision</h2>
              <p className=" about-text-4 w-100 word-break">
                {/* We believe in creating technology that enhances the growth of
                your business around the world. Our vision is to design and
                deliver cutting-edge website solutions, E-commerce website &
                Digital marketing that help businesses become more sustainable.
                We understand the customized need of each client, and partner
                with them to create superior value for their businesses. Our
                team consists of highly skilled consultants, website developers,
                digital marketers, and executives. We aim to exceed the
                expectations of the clients by continually making our products
                and services better */}
                At Arab-Made, our mission is to empower businesses across the
                Arab world by providing a comprehensive B2B platform that
                connects manufacturers, suppliers, and buyers. We are dedicated
                to facilitating seamless transactions and fostering strong
                business relationships through our private label services. Our
                goal is to support the growth and success of our partners by
                offering innovative solutions, high-quality products, and
                exceptional service.
              </p>
              <p className=" about-text-4 w-100 word-break">
                {/* We believe in creating technology that enhances the growth of
                your business around the world. Our vision is to design and
                deliver cutting-edge website solutions, E-commerce website &
                Digital marketing that help businesses become more sustainable.
                We understand the customized need of each client, and partner
                with them to create superior value for their businesses. Our
                team consists of highly skilled consultants, website developers,
                digital marketers, and executives. We aim to exceed the
                expectations of the clients by continually making our products
                and services better */}
                Our vision is to be the leading B2B platform in the Arab region,
                driving economic growth and industry advancement through our
                robust network and expertise in private label services. We
                aspire to create a dynamic marketplace where businesses can
                thrive, collaborate, and expand their reach. By leveraging
                cutting-edge technology and maintaining a commitment to
                excellence, we aim to redefine the standards of B2B interactions
                and contribute to the prosperity of the Arab business community.
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
