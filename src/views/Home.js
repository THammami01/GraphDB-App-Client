import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, ProgressCircle, TextInput } from "react-desktop/windows";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { setIsLoading } from "../store/actions/action-creators";
import axios from "axios";
import cover from "../assets/cover.jpg";

export const Home = () => {
  const dispatch = useDispatch();
  const isNavExpanded = useSelector((store) => store.global.isNavExpanded);
  const isLoading = useSelector((store) => store.global.isLoading);

  const usernameRef = useRef();
  const passwordRef = useRef();
  const [connHelper, setConnHelper] = useState("");

  const getProperTitleWelcome = () => {
    const _ = localStorage.getItem("notFirstTimeLoggedIn");
    if (_ === null) {
      setTimeout(() => {
        localStorage.setItem("notFirstTimeLoggedIn", "true");
      }, 1000);
      return "Welcome";
    } else return "Welcome Back";
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleCheckConnection();
  };

  const handleCheckConnection = (e) => {
    dispatch(setIsLoading(true));
    setConnHelper("");

    const formData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    if (formData.username === "" || formData.password === "") {
      setTimeout(() => {
        setConnHelper("Please fill all fields first.");
        dispatch(setIsLoading(false));
      }, 1000);
    } else {
      setTimeout(() => {
        axios
          .post("/establish-connections", formData)
          .then((res) => {
            setConnHelper("Authentication successful.");
          })
          .catch((err) => {
            setConnHelper("An error occured.");
          });

        dispatch(setIsLoading(false));
      }, 500);
    }
  };

  return (
    <div className="home-section">
      <img
        src={cover}
        alt="Cover"
        className={isNavExpanded ? "expanded" : "not-expanded"}
      />
      <div>
        <h1>{getProperTitleWelcome()} Dr. X Y!</h1>
        <div>
          <p>
            Please make sure that you are connected to a <u>Graph Database</u>{" "}
            <FontAwesomeIcon icon={faDatabase} />.
          </p>
          <p className="version">-- Version 1.0.0 --</p>

          <div>
            <TextInput
              ref={usernameRef}
              theme="dark"
              color="#cc7f29"
              background
              label="Username"
              name="username"
              placeholder="Enter Username"
              autoComplete="off"
              onKeyDown={handleKeyDown}
            />

            <TextInput
              ref={passwordRef}
              theme="dark"
              color="#cc7f29"
              background
              label="Password"
              name="password"
              placeholder="Enter Password"
              password
              onKeyDown={handleKeyDown}
            />

            <Button
              push
              color="#cc7f29"
              onClick={(e) => handleCheckConnection(e)}
              className="btn"
            >
              <ProgressCircle color="#ffffff" size={25} hidden={!isLoading} />
              Check{isLoading && "ing"} Connection
            </Button>

            <p
              style={{
                color:
                  connHelper === "Authentication successful." ? "green" : "red",
              }}
            >
              {connHelper}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
