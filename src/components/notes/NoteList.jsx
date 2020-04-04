import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { List, Tooltip } from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import NoteListItem from './NoteListItem';
import PropTypes from 'prop-types';
import './NoteList.css';

class NoteList extends Component {

  deleteNote(noteId) {
    this.props.deleteNotice(noteId)
  }

  onDragEnd = (result) => {
    const { destination, source } = result;

    if (this.props.notices.length < 1) {
      return;
    }

    if (!destination) {
      return;
    }

    if ( destination.droppableId === source.droppableId && destination.index === source.index) {
          return;
    }

    const start = source.index;
    const end = destination.index;
    const value = this.props.notices[start];

    this.props.notices.splice(start, 1);
    this.props.notices.splice(end, 0, value);
  }
  
  render() {
    const notes = this.props.notices || [];
    const selectedFolderId = this.props.match.params.folderId;

    return (
      <div className="note-list">
        { 
          this.props.pattern &&
          <div className="search-title">
             <i>Search results for</i> <b>{this.props.pattern}</b>
          </div>
        }
        <DragDropContext onDragEnd={this.onDragEnd}>
         <Droppable droppableId='search'>
            {
              provided => (
                <List ref={provided.innerRef} {...provided.droppableProps}>
                  {
                    this.props.matches.map((note, index) => 
                      <NoteListItem 
                        key={index} 
                        note={note} 
                        index={index} />
                    )
                  }
                  {provided.placeholder}
                </List>
              )
            }
        </Droppable>

        <Droppable droppableId='content'>
          {
            provided => (
                <List ref={provided.innerRef} {...provided.droppableProps}>
                  { 
                    !this.props.pattern && notes.map((note, index) => {
                      return (
                        <NoteListItem 
                          key={note.id} 
                          note={note} 
                          delete={() => this.deleteNote(note.id)} 
                          index={index} />
                      );
                    })
                  }
                  { provided.placeholder }
                </List>
            )
          }
        </Droppable> 
      </DragDropContext>
  
      <div className="action-panel">
          {
             selectedFolderId && 
             <Link to={`/${selectedFolderId}/new`}>
                <Tooltip title="Add note">
                  <Fab 
                    color="primary" 
                    aria-label="Add" 
                    size="small" 
                    className="add-note-btn">
                    <AddIcon />
                  </Fab>
                </Tooltip>
             </Link>
          }
        </div> 
      </div>
    )
  }
}

export default withRouter(NoteList);

NoteList.propTypes = {
  notices: PropTypes.array,
  matches: PropTypes.array,
  pattern: PropTypes.string,
  deleteNotice: PropTypes.func
}