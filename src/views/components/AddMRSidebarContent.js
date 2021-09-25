import { useState, useRef } from "react";
import { Button, ProgressCircle, TextInput } from "react-desktop/windows";
import axios from "axios";

const AddMRSidebarContent = ({ setIsSidebarDisplayed, handleRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [helper, setHelper] = useState("");
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const nicRef = useRef();
  const phoneRef = useRef();
  const birthdayRef = useRef();
  const emailRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleUpdateMR();
  };

  const handleUpdateMR = () => {
    setIsLoading(true);
    setHelper("");

    const formData = {
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      nic_nb: nicRef.current.value,
      email: emailRef.current.value,
      phone_nb: phoneRef.current.value,
      birthday: birthdayRef.current.value,
    };

    setTimeout(() => {
      for (let v of Object.values(formData)) {
        if (v === "") {
          setHelper("Please fill all fields.");
          setIsLoading(false);

          setTimeout(() => {
            firstnameRef.current.value = formData.firstname;
            lastnameRef.current.value = formData.lastname;
            nicRef.current.value = formData.nic_nb;
            emailRef.current.value = formData.email;
            phoneRef.current.value = formData.phone_nb;
            birthdayRef.current.value = formData.birthday;
          }, 0);
          return;
        }
      }

      axios
        .post("/medical-record", formData)
        .then((res) => {
          handleRefresh();
        })
        .catch((err) => {});

      setIsLoading(false);
      setIsSidebarDisplayed(false);
    }, 1000);
  };

  return (
    <div>
      <h4 style={{ marginBottom: "1.25rem" }}>Add New Medical Record</h4>

      <div>
        <TextInput
          ref={firstnameRef}
          theme="light"
          color="#cc7f29"
          label="Firstname"
          name="firstname"
          placeholder="Enter Firstname"
          autoComplete="off"
          onKeyDown={handleKeyDown}
          style={{ marginBottom: ".5rem", width: "70%" }}
        />

        <TextInput
          ref={lastnameRef}
          theme="light"
          color="#cc7f29"
          label="Lastname"
          name="lastname"
          placeholder="Enter Lastname"
          onKeyDown={handleKeyDown}
          style={{ marginBottom: ".5rem", width: "70%" }}
        />

        <TextInput
          ref={nicRef}
          theme="light"
          color="#cc7f29"
          label="NIC"
          name="NIC"
          placeholder="Enter NIC Number"
          onKeyDown={handleKeyDown}
          style={{ marginBottom: ".5rem" }}
        />

        <TextInput
          ref={phoneRef}
          theme="light"
          color="#cc7f29"
          label="Phone"
          name="phone"
          placeholder="Enter Phone Number"
          onKeyDown={handleKeyDown}
          style={{ marginBottom: ".5rem" }}
        />

        <TextInput
          ref={birthdayRef}
          theme="light"
          color="#cc7f29"
          label="Birthday"
          name="birthday"
          type="date"
          placeholder="dd-mm-yyyy"
          onKeyDown={handleKeyDown}
          style={{ marginBottom: ".5rem" }}
        />

        <TextInput
          ref={emailRef}
          theme="light"
          color="#cc7f29"
          label="Email"
          name="email"
          placeholder="Enter Email"
          onKeyDown={handleKeyDown}
          style={{ marginBottom: ".5rem", width: "90%" }}
        />

        <div className="btns">
          <Button
            push
            color="#cc7f29"
            onClick={(e) => handleUpdateMR(e)}
            className="btn"
            style={{ marginTop: ".5rem" }}
          >
            <ProgressCircle color="#ffffff" size={25} hidden={!isLoading} />
            {isLoading ? "Adding" : "Add"}
          </Button>
        </div>

        <p
          style={{
            color: helper === "..." ? "green" : "red",
            fontSize: ".95rem",
            marginTop: ".5rem",
          }}
        >
          {helper}
        </p>
      </div>
    </div>
  );
};

export default AddMRSidebarContent;
