"use client";

import { Button, Box, Typography } from "@mui/material";

export default function GlobalError({ error, reset }:
  { error: Error & { digest?: string }, reset: () => void }) {

  return (
    <Box sx={{ display: "flex", flexFlow: "column", justifyContent: "center", alignItems: "center" }}>
      <Typography variant="body1">{error.message}</Typography>
      <Box sx={{ width: { xs: "60%", md: "35%" }, mb: 6, mt: 2 }}>
        <img src="/svg/errors/error.svg" alt="error" />
      </Box>
      <Button variant="outlined" color="secondary" onClick={() => reset()}>
        خطایی رخ داده دوباره تلاش نمایید
      </Button>
    </Box>
  )
}