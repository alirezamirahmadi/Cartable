import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect("mongodb://localhost:27017/cartable");
      console.log("connect to db");
    }
  }
  catch(error){
    console.log(error);
    
  }
}

export default connectToDB;