import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import FormGroup from '@material-ui/core/FormGroup';
import StatusChip from "./StatusChip";

import { getTasksData } from '../tableData'

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
}));

export default function StatusPopOverChip(prop) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const statuses = props.statusSource

    const handlePopOverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
        setAnchorEl(null);
    };

    const isOpen = Boolean(anchorEl);

    return (
        <span>
            <DevChip
                stat={props.stat}
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
                <FormGroup column className='status-popover'>
                    {statuses.map(status =>
                        <StatusChip
                            stat={status}
                            onClick={e => props.handleStatusSelected(status.id, props.taskId)}
                            clickable
                        />)}
                </FormGroup>
            </Popover>}
        </span>
    );

}