import React from 'react'
import Chip from '@material-ui/core/Chip';
import AddCircleIcon from '@material-ui/icons/AddCircle';

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
            label={props.shortForm ? getInitials_Short(props.dev.name) : getInitials_Long(props.dev.name)}
            style={{ backgroundColor: props.dev.associatedBackgroundColor, color: props.dev.isWhiteForegroundColor ? 'white' : 'black', cursor: 'pointer', boxShadow: props.shining ? `10px 0 20px ${props.dev.associatedBackgroundColor}, -10px 0 20px ${props.dev.associatedBackgroundColor}, 10px 0 20px ${props.dev.associatedBackgroundColor}, -10px 0 20px ${props.dev.associatedBackgroundColor}` : 'none' }}
            clickable={props.clickable}
            onClick={props.clickable ? props.onClick : undefined}
        />
}