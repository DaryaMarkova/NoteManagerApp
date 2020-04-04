import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import PropTypes from 'prop-types';


export const FolderOpenPreview = (props) => {
  return (
    <IconButton 
      size="small" 
      className="folder-btn" 
      onClick={() => props.close()}>
      <FolderOpenIcon color="primary" />
    </IconButton>
  );
};

FolderOpenPreview.propTypes = {
  close: PropTypes.func
};