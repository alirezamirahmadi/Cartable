"use client"

import { Backdrop } from "@mui/material";

import { ScaleLoader } from "react-spinners";
import { useTheme } from "@mui/material";

export default function Loading(): React.JSX.Element {

  const theme = useTheme();

  return (
    <>
      <Backdrop open={true} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
        <ScaleLoader color={theme.palette.info.main} />
      </Backdrop>
    </>
  )
}