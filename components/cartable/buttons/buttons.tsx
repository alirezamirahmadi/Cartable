import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddLinkIcon from '@mui/icons-material/AddLink';
import WidgetsIcon from '@mui/icons-material/Widgets';

export default function Buttons({ rowData, onAction }: { value: string, onChange: (event: any) => void, rowData: any, onAction: (data: any, action: string) => void }): React.JSX.Element {

  const handleOpenDocument = () => {
    onAction(rowData, "Open");
  }

  const handleSendDocument = () => {
    onAction(rowData, "Send");
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
        <IconButton color="primary" onClick={handleSendDocument} title="ارجاع">
          <AddLinkIcon />
        </IconButton>
        <IconButton color="secondary" onClick={handleDetailsDocument} title="جزئیات">
          <WidgetsIcon />
        </IconButton>
      </div>
    </>
  )
}