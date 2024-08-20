"use client"

import { useState, useEffect } from "react";
import { IconButton, Box, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';
import CachedIcon from "@mui/icons-material/Cached";

export default function TreeActions({ roots, onAction, search, reset, backward }:
  { roots: any[], onAction: (roots: any[], action: string, searchContent?: string) => void, search?: boolean, reset?: boolean, backward?: boolean }): React.JSX.Element {

  const [searchContent, setSearchContent] = useState<string>("");
  const [root, setRoot] = useState(roots);

  useEffect(() => {
    setRoot(roots)
  }, [roots])

  const handleSearch = () => {
    onAction(root, "Search", searchContent);
  }

  const handleReset = () => {
    onAction([[...root][0]], "Reset");
  }

  const handleBackward = () => {
    const tempRoots: any[] = [...root];
    tempRoots.length > 1 && tempRoots.pop();
    onAction(tempRoots, "Backward");
  }

  return (
    <>
      <Box>
        <TextField size="small" label={<Typography variant="body2">جستجو</Typography>} variant="outlined"
          value={searchContent} onChange={event => setSearchContent(event.target.value)} sx={{ m: 0 }} />
        {search &&
          <IconButton onClick={handleSearch} title="جستجو" disabled={searchContent.length === 0}>
            <SearchIcon />
          </IconButton>
        }
        {reset &&
          <IconButton onClick={handleReset} title="ریست">
            <CachedIcon />
          </IconButton>
        }
        {backward &&
          <IconButton onClick={handleBackward} title="بازگشت" disabled={root.length === 1}>
            <ReplyIcon />
          </IconButton>
        }
      </Box>
    </>
  )
}