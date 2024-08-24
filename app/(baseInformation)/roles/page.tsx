import RoleTree from "@/components/role/roleTree";
import connectToDB from "@/utils/db";
import roleModel from "@/models/role";

async function loadRoleData() {
  connectToDB();

  const roles = await roleModel.aggregate()
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .project({ "title": 1, "root": 1, "isActive": 1, "person._id": 1, "person.firstName": 1, "person.lastName": 1 })
    .unwind({ path: "$person", preserveNullAndEmptyArrays: true })

  return JSON.parse(JSON.stringify(roles));
}

export default async function RolesPage() {

  const roles = await loadRoleData();

  return (
    <>
      <RoleTree roles={roles} />
    </>
  )
}