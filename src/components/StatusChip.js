import React from 'react'
import Chip from '@material-ui/core/Chip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import StatusSelect from './StatusSelect';

export default (props) => {

    const getInitials_Short = name => name.split(' ').map(word => word.charAt(0)).join('')
    const getInitials_Long = name => name.split(' ')[0] + ' ' + name.split(' ').splice(1).map(word => word.charAt(0) + '.').join(' ')

    return props.empty ?
        <Chip
            size="small"
            label='Add'
            variant="outlined"
            icon={<AddCircleIcon />}
            clickable
            onClick={props.onClick}
        /> :
        <Chip
            size="small"
            label={props.statusId}
            // style={{  }}
            clickable={props.clickable}
            onClick={props.clickable ? props.onClick : undefined}
        />
}