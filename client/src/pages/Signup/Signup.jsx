import React, { useRef, useState } from "react";
import "./Signup.scss";
import fire from "../../config/Fire";
import { useHistory } from "react-router-dom";
import OpenArrow from "../../assets/logos/openarrow.png";
import AboutModal from "../../components/AboutModal/AboutModal";

function Signup({ user }) {
  const db = fire.firestore();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [validationError, setValidationError] = useState("");
  const [aboutState, setAboutState] = useState(false);

  // FUNCTION FOR SIGN UP
  function signupActions(event) {
    event.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setValidationError("Passwords do not match");
    }

    if (emailRef.current.value === "") {
      return setValidationError("Please enter a valid email");
    }

    if (passwordRef.current.value.length < 6) {
      return setValidationError("Password must be 6 characters or longer");
    }

    if (username === "") {
      return setValidationError("Please enter a valid username");
    }

    fire
      .auth()
      .createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
      .then((res) => {
        console.log(res, user, username);
        db.collection("users")
          .doc(res.user.uid)
          .set({ username: username })
          .then(() => {
            history.push("/");
          });
      })
      .catch((error) => {
        if (validationError === "") {
          setValidationError(`${error.message}`);
        }
      });
  }

  // CHANGE HANDLER FOR USERNAME
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  // FUNCTION TO SHOW CREATOR INFO
  const aboutHandler = () => {
    setAboutState(true);
  };

  // FUNCTION TO CLOSE CREATOR INFO
  const closeAboutHandler = () => {
    setAboutState(false);
  };

  return (
    <section className="signup">
      {aboutState === true && <AboutModal closeAboutHandler={closeAboutHandler} />}
      <div className="signup__about" onClick={aboutHandler}>
        <p className="signup__about-text">ABOUT THE CREATOR</p>
        <img src={OpenArrow} className="signup__about-open" alt="arrow pointing left to signify information about the creator can be shown if clicked" />
      </div>
      <div className="signup__container">
        <form className="signup__form">
          <h1 className="signup__header">JTrack Sign Up</h1>
          <label className="signup__form-title" htmlFor="email">
            Email
          </label>
          <input className="signup__form-input" type="email" id="email" name="email" placeholder="Enter your email here" ref={emailRef} />
          <label className="signup__form-title" htmlFor="username">
            Username
          </label>
          <input className="signup__form-input" type="text" id="username" name="username" placeholder="Choose a username" value={username} onChange={handleUsernameChange} />
          <label className="signup__form-title" htmlFor="password">
            Password
          </label>
          <input className="signup__form-input" type="password" id="password" name="password" placeholder="Choose a password" ref={passwordRef} />
          <label className="signup__form-title" htmlFor="confirm">
            Password Confirmation
          </label>
          <input className="signup__form-input" type="password" id="confirm" name="confirm" placeholder="Re-enter your password" ref={passwordConfirmRef} />
          <div className="signup__form-error-container">
            <p className="signup__form-error">{validationError}</p>
          </div>
          <button className="signup__form-signup" type="submit" onClick={signupActions}>
            Sign Up
          </button>
          <div className="signup__redirect">
            <p>
              Already have an account?{" "}
              <a className="signup__login-link" href="/login">
                Log In Here.
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Signup;
