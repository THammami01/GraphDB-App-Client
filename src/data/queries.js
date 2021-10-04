const queries = [
  {
    title: "Display All Nodes",
    query: "MATCH(n)\nRETURN(n);",
  },
  {
    title: "Display Patients' Nodes Only",
    query: `MATCH(p: Patient)\nRETURN(p);`,
  },
  {
    title: "Delete All Nodes",
    query: "MATCH(n)\nDETACH DELETE(n);",
  },
];

export default queries;
