import React from 'react'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';

export default function ControlPanel(props) {

    return (
        <div className='control-panel-wrap'>
            <IconButton className='logout-button' onClick={() => { }}>
                <ExitToAppIcon fontSize="large" color='primary' />
            </IconButton>
        </div>
    )
}