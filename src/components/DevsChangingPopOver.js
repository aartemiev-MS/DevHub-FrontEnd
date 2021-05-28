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

import tableDataSource, { getDevs } from '../tableData'

export default function DevsChangingPopOver(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedDevs, setSelectedDevs] = React.useState(props.taskCollaborators);

    const devs = getDevs()
    const tasks = tableDataSource()

    const handleApply = e => {
        props.handleSaveDevs(selectedDevs)
        handleClose();
    }
    const handleClose = e => setAnchorEl(null);
    const handleIconClick = e => !props.readOnlyMode && setAnchorEl(e.currentTarget)
    const handleChange = (dev, isChecked) => {
        let updatedDevs = Object.values({ ...selectedDevs })

        if (isChecked)
            updatedDevs.push(dev)
        else
            updatedDevs = updatedDevs.filter(updatedDev => updatedDev.id !== dev.id)

        setSelectedDevs(updatedDevs)
    }

    const isOpen = Boolean(anchorEl);
    const devChips = props.taskCollaborators.length === 0 && !props.readOnlyMode ? <DevChip empty shortForm /> : props.taskCollaborators.map(dev => <DevChip dev={dev} shortForm />)

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
                    {devs.filter(dev => dev.id !== props.taskMainDevId).map(dev => <div>
                        <Checkbox
                            checked={selectedDevs.some(selectedDev => selectedDev.id === dev.id)}
                            onChange={e => handleChange(dev, e.target.checked)}
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