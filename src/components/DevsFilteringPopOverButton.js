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

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
}));

export default function DevsFilteringPopOverButton(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIds, setSelectedIds] = React.useState(props.filterDevIds);

    const handleApply = e => {
        props.setFilterDevIds(selectedIds)
        handleClose();
    }
    const handleClose = e => setAnchorEl(null);
    const handleIconClick = e => setAnchorEl(e.currentTarget)
    const handleRemoveAll = e => {
        props.setFilterDevIds([])
        handleClose();
    }
    const handleChange = (devId) => {
        const isCurrentlyChecked=selectedIds.some(id=>id===devId)

        let updatedDevIds = Object.values({ ...selectedIds })

        if (isCurrentlyChecked)
        updatedDevIds = updatedDevIds.filter(id => id !== devId)
        else
        updatedDevIds.push(devId)

        setSelectedIds(updatedDevIds)
    }
    
    const getInitials_Long = name => name.split(' ')[0] + ' ' + name.split(' ').splice(1).map(word => word.charAt(0) + '.').join(' ')

    const devButton=(dev)=>{
        return <Button
                //onClick={handlePopOverOpen}
                style={{backgroundColor:dev.associatedBackgroundColor, color:dev.isWhiteForegroundColor?'white':'black'}}>
                {getInitials_Long(dev.name)}
               </Button>
    }

    const isOpen = Boolean(anchorEl);
    return (
        <>
            <IconButton
                className={props.hidden ? 'filtering-header-icon hidden-item' : 'filtering-header-icon'}
                onClick={handleIconClick}>
                <FilterListIcon fontSize="small" color={props.filterDevIds.length === 0 ? 'disabled' : 'primary'} />
            </IconButton>
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                transformOrigin={{ vertical: 'top', horizontal: 'left', }}
            >
                <FormGroup column className='dev-popover'>
                    {props.devs.map(dev => {
                        const devAssociatedTasksQuantity = props.shortForm ?
                            props.tasks.filter(task => task.collaboratorsIds.includes(dev.id)).length :
                            props.tasks.filter(task => task.mainDevId === dev.id).length

                        return <div className='dev-popover-line'
                            onClick={e => handleChange(dev.id)}>
                            <Checkbox
                                checked={selectedIds.includes(dev.id)}
                                color="primary"
                                value={dev.id}
                                size='small'
                            />
                            {devButton(dev)}
                            <span>{`(${devAssociatedTasksQuantity})`}</span>
                        </div>
                    })}
                </FormGroup>
                <ButtonGroup className='filter-button-group' variant="contained" color="primary" size='small'>
                    <Button color="secondary" onClick={handleRemoveAll}>Show All</Button>
                    <Button onClick={handleApply}>Apply</Button>
                </ButtonGroup>
            </Popover>
        </>
    );
}