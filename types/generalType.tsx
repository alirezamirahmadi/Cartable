type SnackProps = {
  context: string,
  severity: "error" | "info" | "success" | "warning",
  isOpen: boolean,
  onCloseSnack: () => void,
}

export type {
  SnackProps
}