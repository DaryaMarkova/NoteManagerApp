import React from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';
import './ControlBar.css';

export const ControlBar = (props: any) => {
    return (
        <div className="control-bar">
            <List component="nav">
                <ListItem button>
                    <ListItemIcon>
                        <AddIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="Add"/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <EditIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="Edit"/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <DeleteIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="Delete"/>
                </ListItem>
            </List>
        </div>
    );
};