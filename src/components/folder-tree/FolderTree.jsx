import React, { Component } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import { isEmpty } from 'lodash';
import Folder from '../folder/Folder';
import PropTypes from 'prop-types';
import './FolderTree.css';

class FolderTree extends Component {

    constructor(props) {
        super(props);

        this.deleteFolder = this.deleteFolder.bind(this);
        this.addFolder = this.addFolder.bind(this);
        this.editFolder = this.editFolder.bind(this);
    }

    deleteFolder(folder) {
        this.props.deleteFolder(folder);
    }

    editFolder(folder) {
        this.props.editFolder(folder);
    }

    addFolder(parentId) {
        this.props.createFolder(parentId);
    }


    render() {
        if (isEmpty(this.props.tree)) {
            return null;
        }

        const rootFolder = this.props.root;
        const isRootLocation = this.props.location.pathname.length <= 1;

        return (
            <div className="tree-view">
                <Route
                    path={`/:folderId`}
                    render={props => {
                        return (
                            <Folder
                                folder={rootFolder}
                                delete={this.deleteFolder}
                                add={this.addFolder}
                                edit={this.editFolder}
                                onSelect={this.selectFolder}
                                selectedId={this.props.selectedId}
                                {...props}
                            />
                        );
                    }}>
                </Route>
                {
                    isRootLocation && rootFolder && <Redirect to={`/${rootFolder.id}`}/>
                }
            </div>
        )
    }
}

export default (withRouter(FolderTree));

FolderTree.propTypes = {
    createFolder: PropTypes.func,
    editFolder: PropTypes.func,
    deleteFolder: PropTypes.func,
    selectedId: PropTypes.number
};