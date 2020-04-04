import React, {Component} from 'react';
import {
    Checkbox,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Tooltip
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {Draggable} from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import './NoteListItem.css';

class NoteListItem extends Component {
    render() {
        return (
            <Draggable draggableId={this.props.note.id} index={this.props.index}>
                {
                    provided => (
                        <ListItem
                            dense
                            button
                            className="note-item"
                            disableRipple
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}>

                            <ListItemIcon className="note-icon">
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                    checkedIcon={<CheckBoxIcon fontSize="small"/>}
                                    edge="start"
                                    color="primary"
                                />
                            </ListItemIcon>
                            {/* link to notice edit page */}
                            <Link
                                className="note-link"
                                to={`/${this.props.note.folderId}/edit/${this.props.note.id}`}>

                                <ListItemText
                                    primary={this.props.note.title}
                                    className="note-text"/>

                            </Link>
                            { // delete notice tool
                                this.props.delete &&
                                <Tooltip title="delete note">
                                    <IconButton
                                        onClick={() => this.props.delete(this.props.note)}
                                        edge="end"
                                        aria-label="Delete"
                                        size="small">
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>
                            }
                        </ListItem>
                    )
                }
            </Draggable>
        )
    }
}

export default connect(
    (state) => {
        return {
            selectedId: state.selectedId
        }
    }
)(NoteListItem);

NoteListItem.propTypes = {
    note: PropTypes.object
};