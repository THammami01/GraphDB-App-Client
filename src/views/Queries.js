import { useSelector } from "react-redux";
// import axios from "axios";
import QueryCard from "./components/QueryCard";
import queries from "../data/queries";

export const Queries = () => {
  const isNavExpanded = useSelector((store) => store.global.isNavExpanded);

  return (
    <div
      className={`section container cypher-queries ${
        isNavExpanded ? "expanded" : "not-expanded"
      }`}
    >
      <h1>Queries</h1>

      {queries.map(({ title, query }) => (
        <QueryCard title={title} query={query} />
      ))}
    </div>
  );
};
