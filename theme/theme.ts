"use client"

import { useState, useMemo, useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import { useCookies } from "react-cookie";
import localFont from "next/font/local";

import { useAppSelector } from "@/lib/hooks";

const vazir = localFont({ src: "./fonts/Vazir.woff2" });

export default function theme() {

  const darkMode = useAppSelector(state => state.darkMode);
  const [cookies, ,] = useCookies(["dark-mode"]);
  const [mode, setMode] = useState<boolean>(cookies["dark-mode"] ?? false);

  useEffect(() => {
    setMode(darkMode);
  }, [darkMode])

  let theme = createTheme({});
  theme = useMemo(() =>

    createTheme({
      direction: "rtl",

      palette: {
        mode: mode ? "dark" : "light",

        primary: {
          main: !mode ? "#0067A5" : "#AB3924",
          contrastText: "#fff",
        },

        secondary: {
          main: !mode ? "#AB3924" : "#0067A5",
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
