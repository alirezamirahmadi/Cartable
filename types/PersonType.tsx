type PersonType = {
  code?: string,
  firstName: string,
  lastName: string,
  nationalCode?: string,
  birthday?: string,
  gender?: 1 | 2,
  maritalStatus?: boolean,
  education?: string,
  phone?: string,
  email?: string,
  address?: string,
  description?: string,
  isActive?: boolean,
  account: AccountType,
  refRole?: string[],
}

type AccountType = {
  username: string,
  password: string,
}


export type {
  PersonType
}