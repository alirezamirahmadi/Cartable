import RoleTree from "@/components/role/roleTree";
import connectToDB from "@/utils/db";
import roleModel from "@/models/role";

async function loadRoleData() {
  connectToDB();

  const roles = await roleModel.aggregate()
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .project({ "title": 1, "root": 1, "isActive": 1, "person._id": 1, "person.firstName": 1, "person.lastName": 1 })
    .unwind({ path: "$person", preserveNullAndEmptyArrays: true })

  return roles;
}

export default async function RolesPage() {

  const roles = await loadRoleData();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
        <RoleTree roles={roles} />
        {/* {!isLoading ? <RoleModify root={root} role={role} onModify={handleModify} /> : <Loading />} */}
      </div>
    </>
  )
}