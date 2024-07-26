import { IconButton, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AddIcon from '@mui/icons-material/Add';

export default function ModifyButtons({ rowData, onAction, add, edit, omit }: { rowData: any, onAction: (data: any, action: string) => void, add?: boolean, edit?: boolean, omit?: boolean }): React.JSX.Element {

  const handleAdd = () => {
    onAction(rowData, 'Add');
  }

  const handleEdit = () => {
    onAction(rowData, 'Edit');
  }

  const handleDelete = () => {
    onAction(rowData, 'Delete');
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {add &&
          <IconButton color="success" onClick={handleAdd} title="اضافه">
            <AddIcon />
          </IconButton>
        }
        {edit &&
          <IconButton color="secondary" onClick={handleEdit} title="ویرایش">
            <AppRegistrationIcon />
          </IconButton>
        }
        {omit &&
          <IconButton color="error" onClick={handleDelete} title="حذف">
            <DeleteIcon />
          </IconButton>
        }
      </Box>
    </>
  )
}