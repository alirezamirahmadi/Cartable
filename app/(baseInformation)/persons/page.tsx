import { Divider } from "@mui/material";

import PersonModify from "@/components/person/personModify";
import PersonTable from "@/components/person/personTable";
import connectToDB from "@/utils/db";
import personModel from "@/models/person";

async function loadPersonData() {
  connectToDB();

  const persons = await personModel.find();
  return JSON.parse(JSON.stringify(persons));
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