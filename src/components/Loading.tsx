import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));


export default function SimpleBackdrop({ open, setOpen } : any) {
  const classes = useStyles();

  return (
    <div>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
        <CloseIcon style={{ cursor: 'pointer', paddingBottom: '40px', paddingLeft: '10px'}} onClick={() => setOpen(false)} ></CloseIcon>
        <h1>
          Loading...
        </h1>
      </Backdrop>
    </div>
  );
}
