import { Button, Typography, Box } from "@mui/material";

export default function Delete({ message, onDelete }: { message: string, onDelete: (isDelete: boolean) => void }): React.JSX.Element {
  return (
    <>
      <Box>
        <Typography variant="body1">{message}</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "end", columnGap: 1, mt: 2 }} >
          <Button variant="outlined" color="secondary" onClick={() => onDelete(false)}>انصراف</Button>
          <Button variant="contained" color="error" onClick={() => onDelete(true)}>حذف</Button>
        </Box>
      </Box>
    </>
  )
}