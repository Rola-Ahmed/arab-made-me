import "./about.css";
import { homeAbout } from "constants/Images";

function About() {
  return (
      <section className="about-us margin-sm-screen">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-lg-6 col-md-6  parent-1 text-">
              <img src={homeAbout} alt="about-us" className="about-img" />
              <div className="overlay ps-5">
                <div className="years">
                  <h4>25</h4>
                  <h5>Years</h5>
                </div>
                <div className="pseudo"></div>
                <div className="experience">
                  <p>Of Experience in Trading Experience Company. </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6  col-lg-6 col-md-6  text-center">
              <div className="about-texts">
                <h6>About Arab Made</h6>
                <h2>
                  Who <span>We</span> Are?
                </h2>
                <p className="w-100">
                  We believe there is a better way to approach goals and bridge
                  the gap of skills in the market, we aspire to unleash the
                  potential of 100 Million curious learners by developing the
                  required skills for growing market.
                </p>
              </div>
              <div className="about-lists">
                <ul>
                  <div className="h">
                  <i className="fas fa-arrow-right icon"></i>
                    <li>
                      We're here to help you grow. Unleash your potentials.
                    </li>
                  </div>

                  <div className="h">
                  <i className="fas fa-arrow-right icon"></i>
                    <li>
                      Designed to give you the best career coach plan for your
                      needs.
                    </li>
                  </div>

                  <div className="h">
                  <i className="fas fa-arrow-right icon"></i>

                    <li>
                        Whether you're figuring out your next steps or want to
                        become a better leader, we've got the right support for
                        you.
                    </li>
                  </div>
                </ul>
              </div>
              <div className="about-para w-100">
                <p >
                  Getting the right support you need to advance in your career
                  is game changing. You don't have to do it alone, and we're
                  here to help you think through big decisions, develop skills
                  to be an impactful human being.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export default About;
