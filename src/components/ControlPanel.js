import React from 'react'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from "react-router-dom";
import { sashaTest } from "../backendRequests";

export default function ControlPanel(props) {
    const history = useHistory();

    const handleOnLogOutClick=e=>{
        history.push("/authentication/logout");
    }

    return (
        <div className='control-panel-wrap'>
            {props.conrolPanelMessage}
        {/* <button onClick={()=>{sashaTest()}}>Sasha</button>
            <IconButton className='logout-button' onClick={handleOnLogOutClick}>
                <ExitToAppIcon fontSize="large" color='primary' />
            </IconButton> */}
        </div>
    )
}