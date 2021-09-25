import { useState, useEffect, useRef } from "react";
import { Button, ProgressCircle, TextInput } from "react-desktop/windows";
import axios from "axios";

const UpdateSidebarContent = ({ mr, setIsSidebarDisplayed, setMR }) => {
  const [isMrUuidExpanded, setIsMrUuidExpanded] = useState(false);
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const nicRef = useRef();
  const phoneRef = useRef();
  const birthdayRef = useRef();
  const emailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [helper, setHelper] = useState(""); // eslint-disable-line

  useEffect(() => {
    setTimeout(() => {
      firstnameRef.current.value = mr.patient.firstname;
      lastnameRef.current.value = mr.patient.lastname;
      nicRef.current.value = mr.patient.nic_nb;
      phoneRef.current.value = mr.patient.phone_nb;
      birthdayRef.current.value = mr.patient.birthday;
      emailRef.current.value = mr.patient.email;
    }, 500);
  }, []); // eslint-disable-line

  const handleExpandMrUuid = () => {
    setIsMrUuidExpanded((isMrUuidExpanded) => !isMrUuidExpanded);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleUpdateMR();
  };

  const handleUpdateMR = () => {
    const formData = {
      uuid: mr.medicalRecord.uuid,
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      nic_nb: nicRef.current.value,
      email: emailRef.current.value,
      phone_nb: phoneRef.current.value,
      birthday: birthdayRef.current.value,
    };

    setIsLoading(true);
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
        .patch("/medical-record", formData)
        .then((res) => {
          delete formData.uuid;

          // setMR(mr => (

          // })

          setMR((mr) => ({
            ...mr,
            patient: {
              ...formData,
            },
          }));
        })
        .catch((err) => {});
      setIsLoading(false);
      setIsSidebarDisplayed(false);
    }, 1000);
  };

  return (
    <div>
      <h4 style={{ marginBottom: "1.25rem" }}>
        Update{" "}
        {mr.medicalRecord.name.substring(
          0,
          mr.medicalRecord.name.indexOf("-", 3)
        )}
        {isMrUuidExpanded ? (
          mr.medicalRecord.name.substring(mr.medicalRecord.name.indexOf("-", 3))
        ) : (
          <span
            className="expand-section"
            onClick={handleExpandMrUuid}
            style={{ marginLeft: ".5rem", cursor: "pointer" }}
          >
            ▪▪▪
          </span>
        )}
      </h4>

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
            {isLoading ? "Updating" : "Update"}
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

export default UpdateSidebarContent;
