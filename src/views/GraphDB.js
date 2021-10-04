import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, ProgressCircle } from "react-desktop/windows";
import { Sidebar } from "primereact/sidebar";
import axios from "axios";
import MedicalRecord from "./components/MedicalRecord";
import AddMRSidebarContent from "./components/AddMRSidebarContent";

export const GraphDB = () => {
  const [resList, setRestList] = useState(null);
  const isNavExpanded = useSelector((store) => store.global.isNavExpanded);
  const [isAddingNewMRLoading, setIsAddingNewMRLoading] = useState(false);
  const [isSidebarDisplayed, setIsSidebarDisplayed] = useState(false);

  const deleteMR = (mrUuid, setIsBeingDeleted) => {
    setIsBeingDeleted(true);
    setTimeout(() => {
      
      axios
      .delete("/medical-record", { data: { uuid: mrUuid } })
      .then((res) => {
        setRestList(resList?.filter((el) => el.medicalRecord.uuid !== mrUuid));
        setIsBeingDeleted(false);
        })
        .catch((err) => {
          setIsBeingDeleted(false);
        });
    }, 500);
  };

  const fetchMRs = () => {
    setTimeout(() => {
      axios
        .get("/medical-record")
        .then((res) => {
          setRestList(res.data.resList?.reverse());
        })
        .catch((err) => {});
    }, 1000);
  };

  useEffect(() => {
    fetchMRs();
  }, []);

  const handleRefresh = () => {
    setRestList(null);
    fetchMRs();
  };

  const hanleAddingNewMRLoading = () => {
    setIsAddingNewMRLoading(true);
    setTimeout(() => {
      setIsSidebarDisplayed(true);
      setIsAddingNewMRLoading(false);
    }, 1000);
  };

  return (
    <div
      className={`section container graph-db ${
        isNavExpanded ? "expanded" : "not-expanded"
      }`}
    >
      <div className="header">
        <h1 style={{ dispaly: "flex" }}>
          Medical Records{"  "}
          <small>
            {resList === null ? (
              <i>Loading...</i>
            ) : (
              "[" + resList?.length + " found]"
            )}
          </small>
          {resList !== null && (
            <i
              className="pi pi-refresh refresh-btn"
              onClick={handleRefresh}
            ></i>
          )}
        </h1>

        <div className="btns">
          <Button push onClick={hanleAddingNewMRLoading} className="btn">
            <ProgressCircle
              color="#000000"
              size={25}
              hidden={!isAddingNewMRLoading}
            />
            {isAddingNewMRLoading ? "Adding" : "Add"} New Medical Record
          </Button>
        </div>
      </div>

      <div className="res-list">
        {resList === null ? (
          <p>
            <i>Loading...</i>
          </p>
        ) : (
          resList?.map((res, idx) => {
            return <MedicalRecord key={res.medicalRecord.uuid} res={res} deleteMR={deleteMR} />;
          })
        )}
      </div>

      <Sidebar
        visible={isSidebarDisplayed}
        onHide={() => setIsSidebarDisplayed(false)}
        position="right"
        blockScroll
      >
        <AddMRSidebarContent
          setIsSidebarDisplayed={setIsSidebarDisplayed}
          handleRefresh={handleRefresh}
        />
      </Sidebar>
    </div>
  );
};
