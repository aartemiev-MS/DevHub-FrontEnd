import React from 'react'
import Chip from '@material-ui/core/Chip';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function DevChip(props) {
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
            label={props.shortForm ? getInitials_Short(props.dev.name) : getInitials_Long(props.dev.name)}
            style={{ backgroundColor: props.dev.associatedBackgroundColor, color: props.dev.isWhiteForegroundColor ? 'white' : 'black', cursor: 'pointer', boxShadow: props.shining && false ? `5px 0 5px yellow, -5px 0 5px yellow, 5px 0 5px yellow, -5px 0 5px yellow` : 'none' }}
            clickable={props.clickable}
            onClick={props.clickable ? props.onClick : undefined}
        />
}