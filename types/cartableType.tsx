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

type UrgencyType = {
  _id: string,
  title: string,
}

type ReceiverType = {
  _id?: string,
  person: { _id: string, name: string },
  role: { _id: string, title: string },
  urgency: { _id: string, title: string },
  comment: string,
}

export type {
  CollectionType, InboxListType, UrgencyType, ReceiverType
}