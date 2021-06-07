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

export default function GroupFilteringPopOver(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIds, setSelectedIds] = React.useState(props.filterGroupIds);

    const handleApply = e => {
        props.setFilterGroupIds(selectedIds)
        handleClose();
    }
    const handleClose = e => setAnchorEl(null);
    const handleIconClick = e => setAnchorEl(e.currentTarget)
    const handleRemoveAll = e => {
        props.setFilterGroupIds([])
        handleClose();
    }
    const handleChange = (groupId, isChecked) => {
        let updatedSelectedIds = Object.values({ ...selectedIds })

        if (isChecked)
            updatedSelectedIds.push(groupId)
        else
            updatedSelectedIds = updatedSelectedIds.filter(id => id !== groupId)

        setSelectedIds(updatedSelectedIds)
    }

    const isOpen = Boolean(anchorEl);
    const getCorrespondedTasksNumber = groupId => props.subGroupMode ?
        props.tasksData.filter(task => task.taskSubGroupId === groupId).length :
        props.tasksData.filter(task => task.taskGroupId === groupId).length


    return (
        <>
            <IconButton
                className='filtering-header-icon'
                onClick={handleIconClick}>
                <FilterListIcon fontSize="small" color={props.filterGroupIds.length === 0 ? 'disabled' : 'primary'} />
            </IconButton>
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                transformOrigin={{ vertical: 'top', horizontal: 'left', }}
            >
                <FormGroup>
                    {props.taskGroups.map(group =>
                        <FormControlLabel
                            className='status-form-control'
                            control={<Checkbox
                                checked={selectedIds.includes(group.id)}
                                onChange={e => handleChange(group.id, e.target.checked)}
                                color="primary"
                                value={group.id}
                                size='small'
                            />}
                            label={`${group.name} (${getCorrespondedTasksNumber(group.id)})`}
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