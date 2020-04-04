import React, { Fragment } from 'react';
import { IconButton, Tooltip } from '@material-ui/core/';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import ClearIcon from '@material-ui/icons/Clear';
import PropTypes from 'prop-types';

export const FolderAddDeleteTool = (props) => {
    return (
        <Fragment>
            {
                props.add &&
                <Tooltip title="Add folder">
                    <IconButton size="small" onClick={props.add}>
                        <AddIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
            }
            {
                props.delete &&
                <Tooltip title="Delete folder">
                    <IconButton size="small" onClick={props.delete}>
                        <ClearIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
            }

        </Fragment>
    );
};

FolderAddDeleteTool.propTypes = {
    add: PropTypes.func,
    delete: PropTypes.func
};