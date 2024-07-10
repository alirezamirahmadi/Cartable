type CollectionType = {
  _id?: string,
  title: string,
  showTitle: string,
  route: string,
  numberRule: string,
  numberIdentity: number,
  stepNumber: number,
  isActive: boolean,
}

type InboxListType = {
  _id: string,
  title: string,
  count: number,
}

export type {
  CollectionType, InboxListType
}