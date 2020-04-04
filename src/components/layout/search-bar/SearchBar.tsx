import React from 'react'
import './SearchBar.css';

export const SearchBar = (props: any) => {
    return (
        <div className="search-bar">
            {props.children}
        </div>
    );
};

