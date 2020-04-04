import React from 'react';
import './NotesViewer.css';

export const NotesViewer = (props: any) => {
    return (
        <div className="notes-viewer">
            {props.children}
        </div>
    );
};