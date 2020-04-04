import './App.css';
import React, { Component } from 'react';
import Search from './components/search/Search';
import { SearchBar } from './components/layout/search-bar/SearchBar';
import { FolderViewer } from './components/layout/folder-viewer/FolderViewer';
import { NotesViewer } from './components/layout/notes-viewer/NotesViewer';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { ThunkDispatch } from "redux-thunk";
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import FolderTree from './components/folder-tree/FolderTree';
import NoteList from './components/notes/NoteList';
import CreateEditNote from './components/notes/CreateEditNote';
import Breadcrumbs from './components/breadcrumbs/Breadcrumbs';
import { 
  fetchTree, 
  createNotice, 
  modifyNotice, 
  appendNode, 
  updateNode, 
  deleteNode, 
  deleteNotice} from './actions/treeActions';
import { getNoticesByFolderId, getTreeRoot } from './reducers/selectors';

class App extends Component<any, any> {
  componentDidMount() {
    this.props.fetchTree()
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <SearchBar>
            <Search />
          </SearchBar>
        </div>
        <div className="row">
          <div className="column">
            <FolderViewer>
              <FolderTree
                tree={this.props.tree} 
                selectedId={this.props.selectedId}
                root={this.props.root}
                createFolder={this.props.createFolder} 
                editFolder={this.props.editFolder}
                deleteFolder={this.props.deleteFolder}
              />
            </FolderViewer>
            <p>*Double click to edit folder</p>
          </div>
          <div className="column">
            {
              this.props.selectedId &&
              <NotesViewer>                
                <Breadcrumbs />

                <Switch>
                  <Route path={[`/:folderId/new`, `/:folderId/edit/:noteId`]}>
                    <CreateEditNote 
                      tree={this.props.tree} 
                      selectedId={this.props.selectedId}
                      addNotice={this.props.addNotice}
                      editNotice={this.props.editNotice} 
                    />
                  </Route>
                  <Route path={`/:folderId`}>
                    <NoteList 
                      notices={this.props.notices}
                      matches={this.props.matches}
                      pattern={this.props.pattern} 
                      deleteNotice={this.props.deleteNotice} 
                    />
                  </Route>
                </Switch>
                  {
                    this.props.pattern ? 
                      <Redirect to={{pathname: `/${this.props.selectedId}`, search: `?search=${this.props.pattern}`}} /> :
                      <Redirect to={`/${this.props.selectedId}`} />
                  }          
              </NotesViewer>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state: any) => {
  return {
    tree: state.tree,
    notices: getNoticesByFolderId(state),
    root: getTreeRoot(state),
    selectedId: state.selectedId,
    pattern: state.search.pattern,
    matches: state.search.results // search results
  }
}, (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    fetchTree: () => dispatch(fetchTree()),
    addNotice: (newNote: any) => dispatch(createNotice(newNote)),
    editNotice: (note: any) => dispatch(modifyNotice(note)),
    deleteNotice: (noteId: number) => dispatch(deleteNotice(noteId)),
    createFolder: (parentId: any) => dispatch(appendNode(parentId)),
    editFolder: (folder: any) => dispatch(updateNode(folder)),
    deleteFolder: (folder: any) => dispatch(deleteNode(folder))
  }
})(withRouter(App));
