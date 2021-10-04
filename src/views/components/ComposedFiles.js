const ComposedFiles = ({ res, composedTypesFiles, openExternalFile }) => {
  return (
    <div>
      {res.type === "composed" && composedTypesFiles[res.uuid]?.length === 0 && (
        <p style={{ marginLeft: "2.5rem" }}>No files found.</p>
      )}
      {res.type === "composed" &&
        composedTypesFiles[res.uuid]?.map((el) => (
          <p style={{ marginLeft: "2.5rem" }} key={el.uuid}>
            - {el.name}{" "}
            <span
              className="expand-section"
              onClick={() => openExternalFile(el.path)}
            >
              <i
                style={{ fontSize: "0.8rem" }}
                className="pi pi-external-link"
              ></i>
            </span>
          </p>
        ))}
    </div>
  );
};

export default ComposedFiles;
