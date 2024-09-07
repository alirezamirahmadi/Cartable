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

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type {
  SnackProps,
  RoleGroupType,
  AttachmentType,
  TabPanelProps
}