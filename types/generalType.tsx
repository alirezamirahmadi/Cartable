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

export type {
  SnackProps,
  RoleGroupType
}