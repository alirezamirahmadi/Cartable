import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddLinkIcon from '@mui/icons-material/AddLink';
import CategoryIcon from '@mui/icons-material/Category';

export default function Buttons({ rowData, onAction }: { value: string, onChange: (event: any) => void, rowData: any, onAction: (data: any, action: string) => void }): React.JSX.Element {

  const handleOpenDocument = () => {
    onAction(rowData, "Open");
  }

  const handleReferenceDocument = () => {
    onAction(rowData, "Reference");
  }

  const handleDetailsDocument = () => {
    onAction(rowData, "Details");
  }

  return (
    <>
      <div className="flex justify-center">
        <IconButton color="secondary" onClick={handleOpenDocument} title="مشاهده">
          <VisibilityIcon />
        </IconButton>
        <IconButton color="secondary" onClick={handleReferenceDocument} title="ارجاع">
          <AddLinkIcon />
        </IconButton>
        <IconButton color="secondary" onClick={handleDetailsDocument} title="جزئیات">
          <CategoryIcon />
        </IconButton>
      </div>
    </>
  )
}