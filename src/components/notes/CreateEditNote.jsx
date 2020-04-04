import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import TagSelector from '../tags/TagSelector';
import './CreateNote.css';

class CreateEditNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noteId: +this.props.match.params.noteId,
      folderId: +this.props.match.params.folderId,
      note: {
        title: '',
        description: ''
      }
    }

    this.createEditNote = this.createEditNote.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.note.id) {
      const tree = nextProps.tree;
      const nodeId = prevState.folderId ? prevState.folderId : nextProps.selectedId;
  
      let note = tree[nodeId].notices.find(it => it.id === prevState.noteId);
            
      if (note) {
        return { ...prevState, note: note }
      }
    }
    
    return prevState;
  }
  
  setTitle(value) {
    this.setState( (prevState) => ({
      note: {...prevState.note, title: value}
    }));
  }

  setDescription(value) {
    this.setState( (prevState) => ({
      note: {...prevState.note, description: value}
    }));
  }

  createEditNote() {
    const note = this.state.note;

    if (!note.id) {
      this.props.addNotice(note).then(this.cancel());
    } else {
      this.props.editNotice(note).then(this.cancel())
    }
  }

  cancel() {
    this.props.history.goBack();
  }

  setTags(tags) {
    this.setState( (prevState) => ({
      note: {...prevState.note, tags: tags}
    }));
  }

  render() {
    const note = this.state.note;
    
    if (!note) {
      return null;
    }

    return (
      <div className="create-note">
        <TagSelector 
          tagsSelected={(tags) => this.setTags(tags)} 
          note={note}
        />

        <TextField 
          value={note.title}
          className="text-field"  
          label="Title"  
          onChange={({target}) => this.setTitle(target.value)} />
        
        <TextField 
          value={note.description}
          onChange={({target}) => this.setDescription(target.value)}
          className="text-field"  
          label="Descrption" 
          multiline={true} 
          rows={3} 
          rowsMax={5} />

        <Button size="small" onClick={ () => this.cancel()} >
          Cancel
        </Button>
        
        <Button 
          variant="contained" 
          color="primary"  
          size="small" 
          onClick={this.createEditNote} >
          Save
        </Button>
      </div>
    );
  }
}
export default (withRouter(CreateEditNote));