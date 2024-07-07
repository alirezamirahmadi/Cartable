
import connectToDB from "@/utils/db";
import collectionModel from "@/models/collection";

const GET = async (request: Request) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  let collections;

  if (searchParams.size === 0) {
    collections = await collectionModel.find();
  }
  else{
    const showTitle = searchParams.get("showtitle");
    console.log(showTitle);
    
    collections = await collectionModel.find({showTitle:{$regex:`.*${showTitle}.*`}});
  }

  if (collections) {
    return Response.json(collections, { status: 200 })
  }
  return Response.json({ message: "Collections not found" }, { status: 404 })
}

const POST = async (request: Request) => {
  connectToDB();

  const { title, showTitle, route, numberRule, numberIdentity, stepNumber, isActive } = await request.json();

  const collection = await collectionModel.create({ title, showTitle, route, numberRule, numberIdentity, stepNumber, isActive });
  if (collection) {
    return Response.json({ message: "Collection created successfully" }, { status: 201 })
  }
  return Response.json({ message: "Collection is not create" }, { status: 500 })
}

export {
  GET,
  POST
}