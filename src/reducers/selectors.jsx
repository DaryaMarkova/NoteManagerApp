import { createSelector } from 'reselect';
import { flatMapDeep, uniqBy } from 'lodash';

export const getSelectedId = (state) => state.selectedId;
export const getTree = (state) => state.tree;
export const getPattern = (state) => state.search.pattern;

export const getNoticesByFolderId = createSelector(
    [
        getTree,
        getSelectedId
    ], (tree, selectedId) => {
        return selectedId && tree[selectedId] ? tree[selectedId].notices : [];
    }
);

export const getTreeRoot = createSelector(
    getTree, (tree) => Object.values(tree).find(it => !it.parentId)
);

export const getSelectedFolderHistory = createSelector(
    [
        getTree,
        getSelectedId
    ], (tree, selectedId) => {
        return tree && selectedId ? getHistoryByFolderId(tree, selectedId) : [];
    }
);

export const getTags = createSelector(
    [
        getTree
    ], (tree) => {
        return uniqBy(flatMapDeep(tree, it => it.notices.map(note => note.tags)), `label`)
    }
);

export const getNotes = createSelector(
    [getTree],
    (tree) => flatMapDeep(tree, it => it.notices)
);

const getHistoryByFolderId = (tree, activeId) => {
    let node = tree[activeId];

    if (!node) {
        return [];
    }

    return [
        { label: node.name, id: node.id},
        ...getHistoryByFolderId(tree, node.parentId)
    ]
};

