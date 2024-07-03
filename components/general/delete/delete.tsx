import { Button, Typography } from "@mui/material";

export default function Delete({ message, onDelete }: { message: string, onDelete: (isDelete: boolean) => void }): React.JSX.Element {
  return (
    <>
      <div className="">
        <Typography variant="body1">{message}</Typography>
        <div className="flex flex-wrap justify-end gap-x-2 mt-4">
          <Button variant="outlined" color="secondary" onClick={() => onDelete(false)}>انصراف</Button>
          <Button variant="contained" color="error" onClick={() => onDelete(true)}>حذف</Button>
        </div>
      </div>
    </>
  )
}