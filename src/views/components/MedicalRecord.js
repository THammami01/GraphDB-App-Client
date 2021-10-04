import { useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { Button, ProgressCircle } from "react-desktop/windows";
import { Sidebar } from "primereact/sidebar";
import axios from "axios";
import UpdateSidebarContent from "./UpdateSidebarContent";
import {
  getReadableDate,
  getReadableCreationDate,
} from "../../utils/functions";
import ComposedFiles from "./ComposedFiles";

const MedicalRecord = ({ res: mrRes, deleteMR }) => {
  const [mr, setMR] = useState(mrRes);
  const [isUpadating, setIsUpdating] = useState(false);
  const [isSidebarDisplayed, setIsSidebarDisplayed] = useState(false);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  const [mrContainedFiles, setMrContainedFiles] = useState(null);

  const [isMrUuidExpanded, setIsMrUuidExpanded] = useState(false);
  const [isFilesSectionExpanded, setIsFilesSectionExpanded] = useState(false);
  const [composedTypesFiles, setComposedTypesFiles] = useState({}); // eslint-disable-line

  const uploadFileInputRef = useRef();
  const [isAddingFile, setIsAddingFile] = useState(false);
  // const [fileToUpload, setFileToUpload] = useState(false);

  const handleFileInputChange = (e) => {
    if (!e.target.files[0]) return;

    setIsAddingFile(true);
    // setFileToUpload(e.target.files[0]);

    if (e.target.files[0] !== undefined) {
      // console.log(e.target.files[0]);

      console.log(e.target.files[0].type);
      const mimeType = e.target.files[0].type;
      // const mimeTypeCat = mimeType.substring(0, mimeType.indexOf("/"));
      const [mimeTypeCat, mimeTypeSecCat] = mimeType.split("/");
      let format;
      let type = "simple";

      switch (mimeTypeCat) {
        case "image":
          format = "IMG";
          break;
        case "audio":
          format = "AUD";
          break;
        case "video":
          format = "VID";
          break;
        case "application":
          type = "composed";

          switch (mimeTypeSecCat) {
            case "pdf":
              format = "PDF";
              break;

            case "msword":
              format = "MS_DOC";
              break;
            case "vnd.openxmlformats-officedocument.wordprocessingml.document":
              format = "MS_DOCX";
              break;

            case "vnd.ms-powerpoint":
              format = "MS_PTT";
              break;
            case "vnd.openxmlformats-officedocument.presentationml.presentation":
              format = "MS_PPTX";
              break;

            case "vnd.ms-excel":
              format = "MS_XLS";
              break;
            case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              format = "MS_XLSX";
              break;

            default:
              break;
          }

          break;
        case "text":
          format = "TXT";
          break;
        default:
          break;
      }

      const formData = new FormData();
      formData.append("file", e.target.files[0]); // fileToUpload

      // // parent_uuid, format, type, file
      // // formData.append("parent_uuid", mr.medicalRecord.uuid);
      // // formData.append("format", "PNG");
      // // formData.append("type", "simple");

      axios
        .post("/upload-file", formData)
        .then((res) => {
          const fileNode = {
            parent_uuid: mr.medicalRecord.uuid,
            format,
            type,
            path: `assets/uploaded/${e.target.files[0].name}`,
          };

          console.log("FILE NODE");
          console.log(fileNode);

          axios
            .post("/file", fileNode)
            .then((res) => {
              // console.log(res);
              setIsAddingFile(false);
              if (mrContainedFiles !== null) handleRefreshFiles();
              uploadFileInputRef.current.value = "";
            })
            .catch((err) => {
              // console.log(err);
              setIsAddingFile(false);
              uploadFileInputRef.current.value = "";
            });
        })
        .catch((err) => {
          // console.log(err);
          setIsAddingFile(false);
          uploadFileInputRef.current.value = "";
        });
    }
  };

  const fetchContainedFiles = (uuid) => {
    setTimeout(() => {
      if (composedTypesFiles[uuid]) {
        setComposedTypesFiles((composedTypesFiles) => ({
          ...composedTypesFiles,
          [uuid]: null,
        }));
      } else {
        axios
          .post("/get-contained-files", { uuid })
          .then((res) => {
            // NOT THIS
            // console.log(res.data.resList);

            if (uuid === mr.medicalRecord.uuid) {
              setMrContainedFiles(res.data.resList);
              setComposedTypesFiles(() => {
                const d = res.data.resList
                  ?.filter((el) => el.type === "composed")
                  .map((el) => ({ [el.uuid]: null }));
                return d;
              });
            } else {
              setComposedTypesFiles((composedTypesFiles) => ({
                ...composedTypesFiles,
                [uuid]: res.data.resList?.reverse(),
              }));
            }
          })
          .catch((err) => {});
      }
    }, 500);
  };

  const handleClick = (action) => {
    switch (action) {
      case "Update":
        setIsUpdating(true);
        setTimeout(() => {
          setIsSidebarDisplayed(true);
          setIsUpdating(false);
        }, 1000);
        break;

      case "Delete":
        deleteMR(mr.medicalRecord.uuid, setIsBeingDeleted);
        break;

      case "Add New File":
        uploadFileInputRef.current.click();
        break;

      default:
        break;
    }
  };

  const handleExpandMrUuid = () => {
    setIsMrUuidExpanded((isMrUuidExpanded) => !isMrUuidExpanded);
  };

  const handleExpandFilesSection = () => {
    setIsFilesSectionExpanded(
      (isFilesSectionExpanded) => !isFilesSectionExpanded
    );

    fetchContainedFiles(mr.medicalRecord.uuid, setMrContainedFiles);
  };

  const openExternalFile = (url) => {
    window.open(url, "_blank");
  };

  const deleteFile = (uuid) => {
    axios
      .delete("/file", { data: { uuid } })
      .then((res) => {
        setMrContainedFiles((mrContainedFiles) =>
          mrContainedFiles?.filter((el) => el.uuid !== uuid)
        );

        // setTimeout(() => {
        //   // fetchContainedFiles(mr.medicalRecord.uuid);
        // }, 500);
      })
      .catch((err) => {});
  };

  const handleRefreshFiles = () => {
    setMrContainedFiles(null);
    fetchContainedFiles(mr.medicalRecord.uuid);
  };

  const Header = (
    <p className="mr-title">
      {`${mr.patient.firstname} ${
        mr.patient.lastname
      }, ${mr.medicalRecord.name.substring(
        0,
        mr.medicalRecord.name.indexOf("-", 3)
      )}`}
      {isMrUuidExpanded ? (
        mr.medicalRecord.name.substring(mr.medicalRecord.name.indexOf("-", 3))
      ) : (
        <span className="expand-section" onClick={handleExpandMrUuid}>
          ▪▪▪
        </span>
      )}
    </p>
  );

  return (
    <Panel header={Header} toggleable collapsed transitionOptions={null}>
      <div className="mr-container">
        <p>{getReadableCreationDate(mr.medicalRecord.created_at)}</p>
        <p>
          Patient details:
          <br />- Firstname: {mr.patient.firstname}
          <br />- Lastname: {mr.patient.lastname}
          <br />- NIC: {mr.patient.nic_nb}
          <br />- Phone: {mr.patient.phone_nb}
          <br />- Birthday: {getReadableDate(mr.patient.birthday)}
          <br />- Email: {mr.patient.email}
          <br />
        </p>{" "}
        <div className="btns">
          <Button push onClick={() => handleClick("Update")} className="btn">
            <ProgressCircle color="#000000" size={25} hidden={!isUpadating} />
            {isUpadating ? "Updating" : "Update"}
          </Button>

          <Button
            push
            color="#f70d1a"
            onClick={() => handleClick("Delete")}
            className="btn"
          >
            <ProgressCircle
              color="#ffffff"
              size={25}
              hidden={!isBeingDeleted}
            />
            {isBeingDeleted ? "Being Deleted" : "Delete"}
          </Button>
        </div>
      </div>

      <Divider />

      <p>
        Files:{" "}
        {mrContainedFiles !== null && (
          <i
            className="pi pi-refresh refresh-files-btn"
            onClick={handleRefreshFiles}
          ></i>
        )}
      </p>
      {!isFilesSectionExpanded ? (
        <span className="expand-section" onClick={handleExpandFilesSection}>
          ▪▪▪
        </span>
      ) : (
        <div>
          {mrContainedFiles === null ? (
            <p>
              <i>Loading...</i>
            </p>
          ) : mrContainedFiles?.length === 0 ? (
            <p>No files found.</p>
          ) : (
            mrContainedFiles?.map((res, idx) => {
              return (
                <div key={res.uuid}>
                  <p>
                    {res.type === "simple" ? (
                      <span
                        className={`expand-section`}
                        style={{ cursor: "initial" }}
                      >
                        <i
                          style={{
                            fontSize: "0.8rem",
                            visibility: "hidden",
                            cursor: "initial",
                          }}
                          className="pi pi-angle-right"
                        ></i>
                      </span>
                    ) : (
                      <span
                        onClick={() => fetchContainedFiles(res.uuid)}
                        className={`expand-section ${
                          "clickable"
                          // !composedTypesFiles[res.uuid]
                          //   ? "clickable"
                          //   : "not-clickable"
                        }`}
                      >
                        <i
                          style={{ fontSize: "0.8rem" }}
                          className={`pi ${
                            !composedTypesFiles[res.uuid]
                              ? "pi-angle-right"
                              : "pi-angle-down"
                          }`}
                        ></i>
                      </span>
                    )}{" "}
                    {res.name}{" "}
                    <span
                      className="expand-section"
                      onClick={() => openExternalFile(res.path)}
                    >
                      <i
                        style={{ fontSize: "0.8rem" }}
                        className="pi pi-external-link"
                      ></i>
                    </span>
                    <span
                      className="expand-section"
                      onClick={() => deleteFile(res.uuid)}
                    >
                      <i
                        className="pi pi-trash"
                        style={{ fontSize: "0.8rem" }}
                      ></i>
                    </span>
                  </p>

                  <ComposedFiles
                    res={res}
                    composedTypesFiles={composedTypesFiles}
                    openExternalFile={openExternalFile}
                  />
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="btns" style={{ marginTop: "1rem" }}>
        <label htmlFor="file-to-upload">
          <Button
            push
            onClick={() => handleClick("Add New File")}
            className="btn"
            disabled={isAddingFile}
          >
            <ProgressCircle color="#000000" size={25} hidden={!isAddingFile} />
            {isAddingFile ? "Adding New File" : "Add New File"}
          </Button>
        </label>

        <input
          ref={uploadFileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleFileInputChange(e)}
          accept="image/*, audio/*, video/*, application/pdf, text/plain, .doc, .docx, .ppt, .pptx, .xls, .xlsx"
        />
      </div>

      <Sidebar
        visible={isSidebarDisplayed}
        onHide={() => setIsSidebarDisplayed(false)}
        position="right"
        blockScroll
      >
        <UpdateSidebarContent
          mr={mr}
          setIsSidebarDisplayed={setIsSidebarDisplayed}
          setMR={setMR}
        />
      </Sidebar>
    </Panel>
  );
};

export default MedicalRecord;
