import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';

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
    iconButton: {
        height: '45px',
        width: '45px',
    },
    saveIcon: {
        marginLeft: 'auto'
    }
}));

export default function TaskInfoModal(props) {
    const [isReadonly, setIsReadonly] = useState(props.readOnlyMode)
    const [taskName, setTaskName] = useState(props.taskModal.taskName)
    const [taskInfo, setTaskInfo] = useState(props.taskModal.taskInfo)
    const [taskNotes, setTaskNotes] = useState(props.taskModal.taskNotes)
    const [isSaveRequired, setIsSaveRequired] = useState(false)

    useEffect(() => {
        setIsSaveRequired(taskName !== props.taskModal.taskName || taskInfo !== props.taskModal.taskInfo || taskNotes !== props.taskModal.taskNotes)
    }, [taskName, taskInfo, taskNotes])

    const classes = useStyles();

    const handleClose = () => props.setTaskModal(null)
    const handleReadOnlyModeChange = e => setIsReadonly(!isReadonly)
    const handleOnChangeInfo = e => {
        switch (e.target.name) {
            case 'taskName':
                setTaskName(e.target.value)

            case 'taskInfo':
                setTaskInfo(e.target.value)

            case 'taskNotes':
                setTaskNotes(e.target.value)
        }
    }
    const handleOnChangeName = e => {
        setTaskName(e.target.value)
    }
    const handleOnSave = () => {
        let updatedTask = { ...props.taskModal }

        updatedTask.taskName = taskName
        updatedTask.taskInfo = taskInfo
        updatedTask.taskNotes = taskNotes

        props.saveTask(updatedTask)
        handleClose()
    }

    return (
        <Modal
            className={classes.modal}
            open={Boolean(props.taskModal)}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={Boolean(taskInfo)}>
                <div className={classes.paper}>
                    <div className='modal-task-header'>
                        <TextField
                            className="modal-task-info"
                            label="Task Name"
                            defaultValue={taskName}
                            name='taskName'
                            inputProps={{ readOnly: isReadonly }}
                            onChange={handleOnChangeInfo}
                        />
                        <IconButton className={classes.iconButton} onClick={handleReadOnlyModeChange}>
                            <EditIcon fontSize='large' color={isReadonly ? 'disabled' : 'primary'} />
                        </IconButton>
                        <IconButton className={classes.iconButton + ' ' + classes.saveIcon} onClick={handleOnSave}>
                            <SaveIcon fontSize='large' color={isSaveRequired ? 'primary' : 'disabled'} />
                        </IconButton>
                        <IconButton className={classes.iconButton} onClick={handleClose}>
                            <CancelIcon fontSize='large' color='secondary' />
                        </IconButton>
                    </div>
                    <div className='modal-task-inputs-wrapper'>
                        <TextField
                            className="modal-task-info"
                            label="Task Info"
                            variant="outlined"
                            fullWidth
                            multiline
                            defaultValue={taskInfo}
                            name='taskInfo'
                            inputProps={{ readOnly: isReadonly }}
                            onChange={handleOnChangeInfo}
                        />
                        <TextField
                            className="modal-task-info"
                            label="Notes"
                            variant="outlined"
                            fullWidth
                            multiline
                            defaultValue={taskNotes}
                            name='taskNotes'
                            inputProps={{ readOnly: isReadonly }}
                            onChange={handleOnChangeInfo}
                        />
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}