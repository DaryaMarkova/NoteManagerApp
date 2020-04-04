import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FolderCloseIcon from '@material-ui/icons/Folder';
import PropTypes from 'prop-types';

export const FolderClosePreview = (props) => {
  return (
    <IconButton 
      size="small" 
      className="folder-btn" 
      onClick={() => props.open()}>
      <FolderCloseIcon color="primary" />
    </IconButton>
  );
};

FolderClosePreview.propTypes = {
  open: PropTypes.func
};