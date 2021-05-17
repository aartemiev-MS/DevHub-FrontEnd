import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function TaskInfoModal(props) {
    const classes = useStyles();

    const handleClose = () => {
        props.setTaskInfo(null);
    };

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={Boolean(props.taskInfo)}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={Boolean(props.taskInfo)}>
                <div className={classes.paper}>
                    <h2 id="transition-modal-title">{props.taskInfo && props.taskInfo.taskName}</h2>
                    <p id="transition-modal-description">{props.taskInfo && props.taskInfo.taskInfo}</p>
                </div>
            </Fade>
        </Modal>
    )
}