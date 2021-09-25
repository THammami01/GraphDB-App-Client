import { useState } from "react";
import { Button } from "react-desktop/windows";

const QueryCard = ({title, query}) => {
  const [copyText, setCopyText] = useState("COPY");

  const handleCopyQuery = (query) => {
    navigator.clipboard.writeText(query);
    setCopyText("COPIED");
    setTimeout(() => {
      setCopyText("COPY");
    }, 1000);
  };
  
  return (
    <div>
      <h3>{title}</h3>
      <div className="query-card">
        {query}

        <Button
          push
          color="#cc7f29"
          className="copy-query-btn"
          onClick={() => handleCopyQuery(query)}
        >
          {copyText}
        </Button>
      </div>
    </div>
  );
};

export default QueryCard;
