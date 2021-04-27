import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        }
    },
}))(MenuItem);

export default function TableContextMenu(props) {

    const handleClose = () => {
        props.setContextMenuAnchor(null);
    };

    const onClickAddAbove = e => {
        props.addRow(props.contextMenuAnchor[2])
        handleClose()
    }

    const onClickAddBelow = e => {
        props.addRow(props.contextMenuAnchor[2] + 1)
        handleClose()
    }

    const onClickRemove = e => {
        props.removeRow(props.contextMenuAnchor[2])
        handleClose()
    }

    return (
        <StyledMenu
            id="customized-menu"
            anchorReference="anchorPosition"
            anchorPosition={props.contextMenuAnchor && { left: props.contextMenuAnchor[0], top: props.contextMenuAnchor[1] }}
            keepMounted
            open={Boolean(props.contextMenuAnchor)}
            onClose={handleClose}
            autoFocus={false}
        >
            <StyledMenuItem onClick={onClickAddAbove}>
                <ListItemIcon>
                    <KeyboardArrowUpIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Add a row above" />
            </StyledMenuItem>
            <StyledMenuItem onClick={onClickAddBelow}>
                <ListItemIcon>
                    <KeyboardArrowDownIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Add a row below" />
            </StyledMenuItem>
            <StyledMenuItem onClick={onClickRemove}>
                <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Remove row" />
            </StyledMenuItem>
        </StyledMenu>
    );
}
