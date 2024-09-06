type SnackProps = {
  context: string,
  severity: "error" | "info" | "success" | "warning",
  isOpen: boolean,
  onCloseSnack: () => void,
}

type RoleGroupType = {
  _id: String,
  kind: number, // 1- role, 2- group
  title: string,
}

type AttachmentType = {
  _id: string,
  title: string,
  description: string,
  path: string,
  createDate: string,
  refPerson: string,
  refCollection: string,
  refDocument: string,
}

export type {
  SnackProps,
  RoleGroupType,
  AttachmentType
}