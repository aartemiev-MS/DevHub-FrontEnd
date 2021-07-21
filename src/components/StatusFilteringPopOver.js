import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import DevChip from './DevChip'

export default function StatusFilteringPopOverButton(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIds, setSelectedIds] = React.useState(props.filterStatusIds);

    const handleApply = e => {
        props.setFilterStatusIds(selectedIds)
        handleClose();
    }
    const handleClose = e => setAnchorEl(null);
    const handleIconClick = e => setAnchorEl(e.currentTarget)
    const handleRemoveAll = e => {
        props.setFilterStatusIds([])
        handleClose();
    }
    const handleChange = (statusId, isChecked) => {
        let updatedStatusIds = Object.values({ ...selectedIds })

        if (isChecked)
            updatedStatusIds.push(statusId)
        else
            updatedStatusIds = updatedStatusIds.filter(id => id !== statusId)

        setSelectedIds(updatedStatusIds)
    }

    const isOpen = Boolean(anchorEl);

    return (
        <>
            <IconButton
                className={props.hidden ? 'filtering-header-icon hidden-item' : 'filtering-header-icon'}
                onClick={handleIconClick}>
                <FilterListIcon fontSize="small" color={props.filterStatusIds.length === 0 ? 'disabled' : 'primary'} />
            </IconButton>
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                transformOrigin={{ vertical: 'top', horizontal: 'left', }}
            >
                <FormGroup>
                    {props.statuses.map(status =>
                        <FormControlLabel
                            className='status-form-control'
                            control={<Checkbox
                                checked={selectedIds.includes(status.id)}
                                onChange={e => handleChange(status.id, e.target.checked)}
                                color="primary"
                                value={status.id}
                                size='small'
                            />}
                            label={`${status.statusName} (${props.tasksData.filter(task => task.status === status.id).length})`}
                        />
                    )}
                </FormGroup>
                <ButtonGroup className='filter-button-group' variant="contained" color="primary" size='small'>
                    <Button color="secondary" onClick={handleRemoveAll}>Show All</Button>
                    <Button onClick={handleApply}>Apply</Button>
                </ButtonGroup>
            </Popover>
        </>
    );
}