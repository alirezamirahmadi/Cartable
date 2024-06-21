"use client"

import { useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { useCookies } from "react-cookie";

export default function theme() {

  const [cookies, ,] = useCookies(['darkmode']);
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  let theme = createTheme({});
  theme = useMemo(() =>

    createTheme({
      direction: 'rtl',

      palette: {
        mode,

        primary: {
          main: mode === 'light' ? '#0067A5' : '#00A693',
          contrastText: '#fff',
        },

        secondary: {
          main: mode === 'light' ? '#AB3924' : '#0067A5',
          contrastText: '#fff',
        },
      },
      typography: {
        fontFamily: ["sahel, arial"].join(","),
      },
      components: {}
    }),
    [mode]
  )

  return theme;
}
