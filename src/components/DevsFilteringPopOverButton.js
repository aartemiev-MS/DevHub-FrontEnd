import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import tableDataSource, { getDevs } from '../tableData'

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
}));

export default function DevsFilteringPopOverButton(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const devs = getDevs()
    const tasks = tableDataSource()

    const handleClick = (event) => {
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
    const id = isOpen ? 'simple-popover' : undefined;

    return (
        <div>
            <Button
                aria-describedby={id}
                variant="contained"
                color="primary"
                onClick={handleClick}
                id='dev-filtering-button'>
                {devs.map(d => props.filterDevIds.includes(d.id) && d.name.charAt(0)).filter(d => d).join(',')}
            </Button>
            <Popover
                id={id}
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
                    {devs.map(dev => <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.filterDevIds.includes(dev.id)}
                                onChange={e => handleChange(dev.id, e.target.checked)}
                                color="primary"
                                value={dev.id}
                            />}
                        label={`${dev.name} (${tasks.filter(task => task.mainDev.id === dev.id).length})`}
                    />
                    )}
                </FormGroup>
            </Popover>
        </div>
    );
}