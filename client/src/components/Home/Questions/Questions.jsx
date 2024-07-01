import "./questions.css";
import ava1 from "../../../assets/images/Avatar.png";
import ava2 from "../../../assets/images/Avatar (1).png";
import ava3 from "../../../assets/images/Avatar (2).png";
import { useNavigate } from "react-router-dom";
function Questions(props) {
  let navigate = useNavigate();
  return (
    <>
      <section className="questions">
        <div className="container cont-que">
          <div className="questions-container">
            <div className="questions-content">
              <div className="avatar-group">
                <img className="ava1" src={ava1} alt="avatar" />
                <img className="ava2" src={ava2} alt="avatar" />
                <img className="ava3" src={ava3} alt="avatar" />
              </div>
            </div>
          </div>
          <div>
            <h4 className="question-1">Still have questions?</h4>
            <p className="question-2">
              Can’t find the answer you’re looking for? Please chat to our
              friendly team.
            </p>
          </div>
          <div className="bty">
            <button
              className="ques-btn cursor"
              onClick={() => {
                navigate("/contact");
              }}
            >
              Get in touch
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Questions;
