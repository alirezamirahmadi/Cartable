"use client"

import { useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { useCookies } from "react-cookie";
import localFont from "next/font/local";

const vazir = localFont({src:"./fonts/Vazir.woff2"});

export default function theme() {

  const [cookies, ,] = useCookies(["darkmode"]);
  const [mode, setMode] = useState<"light" | "dark">("light");

  let theme = createTheme({});
  theme = useMemo(() =>

    createTheme({
      direction: "rtl",

      palette: {
        mode,

        primary: {
          main: mode === "light" ? "#0067A5" : "#AB3924",
          contrastText: "#fff",
        },

        secondary: {
          main: mode === "light" ? "#AB3924" : "#0067A5",
          contrastText: "#fff",
        },
      },
      typography: {
        fontFamily: [vazir.style.fontFamily, "arial"].join(","),
      },
      components: {}
    }),
    [mode]
  )

  return theme;
}
