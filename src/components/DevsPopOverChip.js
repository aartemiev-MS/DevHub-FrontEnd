import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import DevChip from './DevChip'

import { getTasksData } from '../tableData'

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
}));

export default function DevsPopOverChip(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const devs = props.devsSource
    const tasks = getTasksData()

    const handlePopOverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
        setAnchorEl(null);
    };

    const handleChange = (devId, isChecked) => {
        let updatedDevIds = Object.values({ ...props.filterDevIds })

        if (isChecked)
            updatedDevIds.push(devId)
        else
            updatedDevIds = updatedDevIds.filter(id => id !== devId)

        props.setFilterDevIds(updatedDevIds)
    }

    const isOpen = Boolean(anchorEl);

    return (
        <span>
            <DevChip
                dev={props.dev}
                clickable={!props.readOnly}
                onClick={handlePopOverOpen}
                empty={props.empty}
            />
            {!props.readOnly && <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <FormGroup column className='dev-popover'>
                    {devs.map(dev =>
                        <DevChip
                            dev={dev}
                            onClick={e => props.handleDevSelected(dev.id, props.taskId)}
                            clickable
                        />)}
                </FormGroup>
            </Popover>}
        </span>
    );
}