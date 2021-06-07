import React from 'react';
import Popover from '@material-ui/core/Popover';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import DevChip from './DevChip'

export default function DevsChangingPopOver(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedDevIds, setSelectedDevIds] = React.useState(props.taskCollaboratorIds);

    const handleApply = e => {
        props.handleSaveDevs(selectedDevIds, props.taskId)
        handleClose();
    }
    const handleClose = e => setAnchorEl(null);
    const handleIconClick = e => !props.readOnlyMode && setAnchorEl(e.currentTarget)
    const handleChange = (devId, isChecked) => {
        let updatedDevsIds = Object.values({ ...selectedDevIds })

        if (isChecked)
            updatedDevsIds.push(devId)
        else
            updatedDevsIds = updatedDevsIds.filter(updatedDevId => updatedDevId !== devId)

        setSelectedDevIds(updatedDevsIds)
    }

    const isOpen = Boolean(anchorEl);

    const devChips = props.taskCollaboratorIds.length === 0 && !props.readOnlyMode ?
        <DevChip empty shortForm /> :
        props.taskCollaboratorIds.map(id => <DevChip dev={props.devs.find(dev => dev.id === id)} shortForm />)

    return (
        <>
            <IconButton className='dev-chips-group' onClick={handleIconClick}>{devChips}</IconButton>
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                transformOrigin={{ vertical: 'top', horizontal: 'left', }}
            >
                <FormGroup column className='dev-popover'>
                    {props.devs.filter(dev => dev.id !== props.taskMainDevId).map(dev => <div>
                        <Checkbox
                            checked={selectedDevIds.some(selectedDevId => selectedDevId === dev.id)}
                            onChange={e => handleChange(dev.id, e.target.checked)}
                            color="primary"
                            value={dev.id}
                            size='small'
                        />
                        <DevChip dev={dev} shortForm />
                    </div>
                    )}
                </FormGroup>
                <ButtonGroup className='devs-apply-button-group' variant="contained" color="primary" size='small'>
                    <Button onClick={handleApply}>Apply</Button>
                </ButtonGroup>

            </Popover>
        </>
    );
}