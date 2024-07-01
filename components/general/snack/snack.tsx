
import React, { useEffect } from 'react';
import { Stack, Snackbar, AlertProps, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

type SnackProp = {
  context: string,
  severity: 'error' | 'info' | 'success' | 'warning',
  isOpen: boolean,
  onCloseSnack: () => void,
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Snack({ context, severity, isOpen, onCloseSnack }: SnackProp): React.JSX.Element {

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    isOpen && setOpen(true);
  }, [isOpen])

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    onCloseSnack();
    setOpen(false);
  }

  return (
    <div>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
            <Typography variant='body2'>
              {context}
            </Typography>
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
}
