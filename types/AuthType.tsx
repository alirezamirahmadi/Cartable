
type LoginType = {
  username: string,
  password: string,
}

type MeType = {
  isLogin: boolean,
  _id: string,
  firstName: string,
  lastName: string,
  defaultRole: { _id: string, title: string, root: string },
  permissions: string[],
}

export type {
  LoginType,
  MeType
}