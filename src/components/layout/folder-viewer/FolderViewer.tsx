import React from 'react';
import './FolderViewer.css';

export const FolderViewer = (props: any) => {
    return (
        <div className="folder-viewer">
            {props.children}
        </div>
    );
};