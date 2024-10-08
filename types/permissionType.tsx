type PermissionType = {
  _id: string | null,
  title: string,
  showTitle: string,
  root: string,
  kind: number,
}

type GroupPermissionType = {
  _id: string,
  refPermission: string,
  refGroup: string,
}

export type {
  PermissionType,
  GroupPermissionType
}