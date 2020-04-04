import React, {Component, Fragment} from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { FolderOpenPreview } from './FolderOpenPreview';
import { FolderClosePreview } from './FolderClosePreview';
import { FolderAddDeleteTool } from './FolderAddDelete';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { selectNode } from '../../reducers/treeReducer';
import './Folder.css';

class Folder extends Component {
    state = {
        value: this.props.folder ? this.props.folder.name : '',
        opened: true,
        editable: false,
        activeId: +this.props.match.params.folderId
    };

    componentDidMount() {
        this.props.selectFolder(+this.state.activeId);
    }

    render() {
        const folder = this.props.folder;

        if (!folder || isEmpty(folder)) {
            return null;
        }

        const selectedId = this.props.selectedId || this.state.activeId;
        const nestedFolders = this.getNestedFolders();
        const nestedDOM = (
            <ul>
                {
                    nestedFolders.map(it =>
                        <Folder
                            {...this.props}
                            key={it.id}
                            folder={it}
                            selectedId={selectedId}
                        />
                    )
                }
            </ul>
        );

        // if folder is a top of the tree
        if (!folder.parentId) {
            return (
                <Fragment>
                    <FolderAddDeleteTool add={() => this.add()} delete={null}/>
                    {nestedDOM}
                </Fragment>
            )
        }

        // otherwise
        return (
            <li className={ classNames({'nested': folder.children.length > 0}, {'opened': this.state.opened}, {'closed': !this.state.opened})}>
                {   // close or open icon preview for the current folder
                    this.state.opened ?
                        <FolderOpenPreview close={() => this.closeFolder()}/> :
                        <FolderClosePreview open={() => this.openFolder()}/>
                }

                {/* folder title: text (default) or input (in edit mode) */}
                <span
                    onDoubleClick={() => this.editStarted()}
                    className={selectedId === folder.id ? 'selected' : ''}>
                {
                    this.state.editable ?
                        <input
                            type="text"
                            value={this.state.value}
                            placeholder="Press Enter to confirm"
                            onChange={(e) => this.onInputChanged(e)}
                            onKeyPress={(e) => this.editCompleted(e)}
                            onClick={(e) => this.folderSelected(e)}/> :

                        <Link
                            to={`/${folder.id}`}
                            onClick={(e) => this.folderSelected(e)}>
                            {folder.name}
                        </Link>
                }
                    <FolderAddDeleteTool add={() => this.add()} delete={() => this.delete()}/>
            </span>
                {/* then rendering nested folders inside */}
                {nestedDOM}
            </li>
        )
    }


    getNestedFolders() {
        const folder = this.props.folder;
        const tree = this.props.tree;

        return folder && tree ? folder.children.map(id => tree[id]) : [];
    }

    delete() {
        const currentFolder = this.props.folder;
        this.props.delete(currentFolder);
    }

    add() {
        const parentFolder = this.props.folder;
        this.props.add(parentFolder.id);
    }

    onInputChanged(event) {
        this.setState({
            value: event.target.value
        });
    }

    editStarted() {
        this.setState({
            editable: true
        });
    }

    editCompleted(event) {
        if (event.key === `Enter`) {
            this.setState({
                editable: false
            }, () => {
                const oldFolder = this.props.folder;
                this.props.edit({...oldFolder, name: this.state.value})
            });
        }
    }

    folderSelected(event) {
        event.stopPropagation();
        this.props.selectFolder(this.props.folder.id);
    }

    closeFolder() {
        this.setState({
            opened: false
        });
    }

    openFolder() {
        this.setState({
            opened: true
        });
    }
}

export default connect(
    state => {
        return {
            tree: state.tree
        }
    },
    dispatch => {
        return {
            selectFolder: (id) => dispatch(selectNode(id))
        }
    }
)(withRouter(Folder))