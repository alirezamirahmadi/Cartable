type GroupType = {
  _id: string | null,
  title: string,
  root: string,
  kind: number,
  permissions?: string[],
}

export type {
  GroupType
}