
const regex = {
  username:/^\w{4,20}$/,
  password:/^.{8,20}$/,
  flName:/^.{3,50}$/,
  email:/(\w+[\.-]?\w+)@\w+([\.-]?\w+)*(\.\w{2,3})/,
  phone:/09\d{9}$/,
  comment:/\w{4}/,
}


export default regex