import { omit, forIn } from 'lodash';
import { createActions, handleActions } from 'redux-actions';
import { getTreeRoot, getNotes } from './selectors';

export const {
    appendToTree,
    removeFromTree,
    updateTree,
    initTree,
    selectNode,
    addNotice,
    editNotice,
    removeNotice,
    searchNotices
} = createActions({
    APPEND_TO_TREE: (newNode) => ({newNode}),
    REMOVE_FROM_TREE: (nodeId) => ({nodeId}),
    UPDATE_TREE: (editedNode) => ({editedNode}),
    INIT_TREE: (tree) => ({tree}),
    SELECT_NODE: (selectedId) => ({selectedId}),
    ADD_NOTICE: (note) => ({note}),
    EDIT_NOTICE: (note) => ({note}),
    REMOVE_NOTICE: (noteId) => ({noteId}),
    SEARCH_NOTICES: (search) => ({search})
});

export const appReducer = handleActions(
    {
        [appendToTree]: (state, {payload: {newNode}}) => {
            return {...state, tree: treeAppended(newNode, state.tree)}
        },
        [removeFromTree]: (state, {payload: {nodeId}}) => {
            let selectedId = state.selectedId;
            // switching to new selected node
            if (isChildOfNode(state.tree, nodeId, state.selectedId)) {
                selectedId = getNewSelectedId(state.tree, state.selectedId);
            }

            return {...state, tree: treeReduced(nodeId, state.tree), selectedId: selectedId}
        },
        [updateTree]: (state, {payload: {editedNode}}) => {
            return {...state, tree: treeUpdated(editedNode, state.tree)}
        },
        [initTree]: (state, {payload: {tree}}) => {
            return {...state, tree: tree}
        },
        [selectNode]: (state, {payload: {selectedId}}) => {
            if (!state.tree[+selectedId]) {
                selectedId = getTreeRoot(state).id;
            }

            return {...state, selectedId: +selectedId}
        },
        [addNotice]: (state, {payload: {note}}) => {
            const nodeId = state.selectedId;
            const node = state.tree[nodeId];

            if (nodeId) {
                return {
                    ...state,
                    tree: {
                        ...state.tree,
                        [nodeId]: {...node, notices: [...node.notices, note]}
                    }
                }
            }

            return state;
        },
        [editNotice]: (state, {payload: {note}}) => {
            const nodeId = state.selectedId;
            const node = state.tree[nodeId];
            const notices = node.notices;

            const index = notices.findIndex(it => it.id === note.id);

            if (nodeId && index > -1) {
                return {
                    ...state,
                    tree: {
                        ...state.tree,
                        [nodeId]: {...node, notices: [...notices.slice(0, index), note, ...notices.slice(index + 1)]}
                    }
                }
            }

            return state;
        },
        [removeNotice]: (state, {payload: {noteId}}) => {
            const nodeId = state.selectedId;

            if (nodeId) {
                const node = state.tree[nodeId];

                return {
                    ...state,
                    tree: {
                        ...state.tree,
                        [nodeId]: {
                            ...node,
                            notices: node.notices.filter(it => it.id !== +noteId)
                        }
                    }
                }
            }

            return state;
        },
        [searchNotices]: (state, {payload: {search}}) => {
            const {mode, pattern} = search;
            const notes = getNotes(state);
            const comparator = (mode === 1) ? getSimplePredicate : getAdvancedPredicate;

            return {
                ...state,
                search: {
                    ...state.search,
                    pattern: pattern,
                    mode: mode,
                    results: pattern ? notes.filter(note => comparator(note, pattern)) : []
                }
            };
        }
    },
    { // initial tree state
        tree: {},
        selectedId: null,
        search: {
            mode: 1, // simple search mode
            pattern: '',
            results: []
        }
    }
);

// add element to tree
const treeAppended = (newNode, state) => {
    const {id, parentId} = newNode;
    const parent = state[parentId];

    if (!parentId) {
        // adding root
        return {...newNode, parentId: null, open: true, newest: false};
    }

    return {
        ...state,
        [id]: newNode,
        [parentId]: {...parent, children: [...parent.children, id]}
    }
};

// remove an element from tree
const treeReduced = (nodeId, state) => {
    const root = state[nodeId];

    const queue = [];
    const nodes = []; // nodes to delete

    queue.push(root.id);

    while (queue.length > 0) {
        const id = queue.pop();
        nodes.push(id);

        if (state[id].children.length > 0) {
            queue.push(...state[id].children);
        }
    }

    const omitedTree = omit(state, nodes);

    forIn(omitedTree, (node, _nodeId) => {
        if (node.children) {
            omitedTree[_nodeId] = {...node, children: node.children.filter(id => id !== nodeId)}
        }
    });

    return omitedTree;
};

const treeUpdated = (node, state) => {
    return {
        ...state,
        [node.id]: node
    }
};

const isChildOfNode = (tree, parentId, childId) => {
    const parent = tree[parentId];

    if (!parent) {
        return false;
    }

    if (parentId === childId || parent.children.includes(childId)) {
        return true;
    }

    for (let id of parent.children) {

        const isFound = isChildOfNode(tree, +id, childId);

        if (isFound) {
            return isFound;
        }
    }

    return false;
};

const getNewSelectedId = (tree, selectedId) => {
    const selected = tree[selectedId];

    if (selected.parentId) {
        let parent = tree[selected.parentId];
        let index = parent.children.indexOf(selectedId);

        if (parent.children.length > 1) {
            const closest = tree[parent.children[index - 1]];
            selectedId = (closest.children.length > 0) ? closest.children[closest.children.length - 1] : closest.id;
        } else {
            selectedId = selected.parentId;
        }
    }

    return selectedId;
};

const getSimplePredicate = (note, pattern) => {
    return note.title.toLowerCase().includes(pattern);
};

const getAdvancedPredicate = (note, pattern) => {
    const descriptionSuits = note.description.toLowerCase().includes(pattern);
    const tagsSuits = note.tags.find(it => it.label.toLowerCase().includes(pattern));

    return descriptionSuits || tagsSuits;
};