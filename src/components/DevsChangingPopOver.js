import React from 'react';
import Popover from '@material-ui/core/Popover';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';

export default function DevsChangingPopOver(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedDevIds, setSelectedDevIds] = React.useState(props.taskCollaboratorIds);

    const handleApply = e => {
        props.handleSaveDevs(selectedDevIds, props.taskId)
        handleClose();
    }
    const handleClose = e => setAnchorEl(null);
    const handleIconClick = e => !props.readOnlyMode && setAnchorEl(e.currentTarget)
    const handleChange = (devId) => {
        const isCurrentlyChecked = selectedDevIds.some(id=>id===devId)
        let updatedDevsIds = Object.values({ ...selectedDevIds })

        if (isCurrentlyChecked)
            updatedDevsIds = updatedDevsIds.filter(updatedDevId => updatedDevId !== devId)
        else
            updatedDevsIds.push(devId)

        setSelectedDevIds(updatedDevsIds)
    }

    const isOpen = Boolean(anchorEl);

    const getDevById = id => props.devs.find(dev => dev.id === id)
    const getInitials_Short = name => name.split(' ').map(word => word.charAt(0)).join('')
    const getInitials_Long = name => name.split(' ')[0] + ' ' + name.split(' ').splice(1).map(word => word.charAt(0) + '.').join(' ')

    const collaboratorButton =(devId,longStyle,onClickFunction,tooltipRequired)=>{
        const dev=getDevById(devId)
        const emptyButton=!!(!dev)
        
        const getDevName=()=>{
            return longStyle?getInitials_Long(dev.name):getInitials_Short(dev.name)
        }

        if(emptyButton){
            return <Tooltip title={"Add a collaborator"} arrow interactive>
            <Button
                    className='collaborator-button collaborator-button-empty'
                    startIcon={<AddCircleIcon />}>
                    </Button>
                    </Tooltip>
        }else{
            if(tooltipRequired){
                return <Tooltip title={dev.name} arrow interactive>
                <Button
                className='collaborator-button'
                onClick={onClickFunction}
                style={{backgroundColor:dev.associatedBackgroundColor, color:dev.isWhiteForegroundColor?'white':'black'}}>
                       {getDevName()}
                </Button>
                </Tooltip> 
            } else {
                return <Button
                className='collaborator-button'
                onClick={onClickFunction}
                style={{backgroundColor:dev.associatedBackgroundColor, color:dev.isWhiteForegroundColor?'white':'black'}}>
                       {getDevName()}
                </Button>
            }
        }
    }

    const getDevButtons =()=>{
         if(props.taskCollaboratorIds.length === 0 && !props.readOnlyMode){
            return collaboratorButton(null) 
         } else {
            const sortedCollaboratorIds= props.taskCollaboratorIds.sort((devId1,devId2)=> getDevById(devId1).priorityAmongDevelopers > getDevById(devId2).priorityAmongDevelopers)
            return sortedCollaboratorIds.map(id => collaboratorButton(id,false,null,true)) 
    }
}

    return (
        <>
            <IconButton className='dev-chips-group' onClick={handleIconClick}>{getDevButtons()}</IconButton>
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                transformOrigin={{ vertical: 'top', horizontal: 'left', }}
            >
                <FormGroup column className='dev-popover'>
                    {props.devs.filter(dev => dev.id !== props.taskMainDevId).map(dev => <div className='dev-popover-line-2'>
                        <Checkbox
                            checked={selectedDevIds.some(selectedDevId => selectedDevId === dev.id)}
                            onChange={e => handleChange(dev.id)}
                            color="primary"
                            value={dev.id}
                            size='small'
                        />
                        {collaboratorButton(dev.id,true,e => handleChange(dev.id),false)}
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