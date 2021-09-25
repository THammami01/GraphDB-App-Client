const queries = [
  {
    title: "Display All Nodes",
    query: "MATCH(n)\nRETURN(n);",
  },
  {
    title: "Display Medical Records Only",
    query: `MATCH(n: MedicalRecord)\nRETURN(n);`,
  },
  {
    title: "Delete All Nodes",
    query: "MATCH(n)\nDETACH DELETE(n);",
  },
];

export default queries;
