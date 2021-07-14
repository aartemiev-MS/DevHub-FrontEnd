import React from 'react'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from "react-router-dom";

export default function ControlPanel(props) {
    const history = useHistory();

    const handleOnLogOutClick=e=>{
        history.push("/authentication/logout");
    }

    return (
        <div className='control-panel-wrap'>
            {props.conrolPanelMessage}
            <IconButton className='logout-button' onClick={handleOnLogOutClick}>
                <ExitToAppIcon fontSize="large" color='primary' />
            </IconButton>
        </div>
    )
}