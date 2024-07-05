import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

export default function ModifyButtons({ rowData, handleAction }: { value: string, onChange: (event: any) => void, rowData: any, handleAction: (data: any, action: string) => void }): React.JSX.Element {

  const handleEdit = () => {
    handleAction(rowData, 'Edit');
  }

  const handleDelete = () => {
    handleAction(rowData, 'Delete');
  }

  return (
    <>
      <div className="flex justify-center">
        <IconButton color="secondary" onClick={handleEdit} title="ویرایش">
          <AppRegistrationIcon />
        </IconButton>
        <IconButton color="error" onClick={handleDelete} title="حذف">
          <DeleteIcon />
        </IconButton>
      </div>
    </>
  )
}