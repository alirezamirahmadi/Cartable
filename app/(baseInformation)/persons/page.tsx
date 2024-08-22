import PersonModify from "@/components/person/personModify";
import { Divider } from "@mui/material";

import PersonTable from "@/components/person/personTable";

async function loadPersonData() {
  const persons = await fetch("http://localhost:3000/api/v1/persons", { cache: "no-store" })
    .then(res => res.status === 200 && res.json())
    .then(data => data);

  return persons;
}

export default async function Persons() {

  const persons = await loadPersonData();

  return (
    <>
      <PersonModify />
      <Divider sx={{ mx: "Auto", width: "90%", my: 2 }} />
      <PersonTable persons={persons} />
    </>
  )
}