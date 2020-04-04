import treeRepository from '../repositories/TreeRepository';
import noticeRepozitory from '../repositories/NoticeRepozitory';

import {
    initTree,
    appendToTree,
    removeFromTree,
    updateTree,
    addNotice,
    editNotice,
    removeNotice
} from '../reducers/treeReducer';

export const fetchTree = () => {
    return (dispatch) => {
        treeRepository.fetchFolders().subscribe(items => {
            const tree = {};

            items.forEach(it => {
                const parent = tree[it.parentId];
                tree[it.id] = {
                    ...it,
                    children: it.children ? it.children : [],
                    notices: []
                };

                if (it.parentId) {
                    tree[it.parentId] = {
                        ...parent,
                        parentId: parent.parentId ? parent.parentId : null,
                        children: [...parent.children, it.id]
                    }
                }
            });

            noticeRepozitory.fetchNotices().subscribe(items => {
                items.forEach(it => {
                    tree[it.directoryId].notices.push(it)
                });

                dispatch(initTree(tree));
            });
        })
    }
};

export const appendNode = (parentId) => {
    return (dispatch) => {
        treeRepository.createFolder(parentId, `New folder`).subscribe(it => {
            dispatch(appendToTree({...it, newest: true, children: [], notices: []}))
        });
    }
};

export const updateNode = (node) => {
    return (dispatch) => {
        treeRepository.editFolder(node).subscribe(it => {
            dispatch(updateTree(node))
        });
    }
};

export const deleteNode = (node) => {
    return (dispatch) => {
        treeRepository.deleteFolder(node.id).subscribe(_ => {
            dispatch(removeFromTree(node.id))
        });
    }
};

export const createNotice = (note) => {
    return (dispatch, getState) => new Promise((resolve, reject) => {
        const nodeId = getState().selectedId;
        noticeRepozitory.createNotice({...note, folderId: nodeId}).subscribe(it => {
            dispatch(addNotice(it));
            resolve()
        }, () => reject());
    });
};

export const modifyNotice = (note) => {
    return (dispatch) => new Promise((resolve, reject) => {
        noticeRepozitory.editNotice(note).subscribe(it => {
            dispatch(editNotice(note));
            resolve()
        }, () => reject());
    });
};

export const deleteNotice = (noteId) => {
    return (dispatch) => new Promise((resolve, reject) => {
        noticeRepozitory.deleteNotice(noteId).subscribe(_ => {
            dispatch(removeNotice(noteId));
            resolve()
        }, () => reject());
    });
};