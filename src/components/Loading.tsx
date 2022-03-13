import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';



const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));


export default function SimpleBackdrop({ open, onCancel } : any) {
  const classes = useStyles();

  return (
      <Backdrop className={classes.backdrop} open={open}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <h1>Loading...</h1>
          </Grid>

          <Grid item xs={12}>
            <CircularProgress color="inherit" />
            <CloseIcon style={{ cursor: 'pointer', paddingBottom: '40px', paddingLeft: '10px'}} onClick={onCancel} ></CloseIcon>
          </Grid>
        </Grid>
      </Backdrop>
  );
}
