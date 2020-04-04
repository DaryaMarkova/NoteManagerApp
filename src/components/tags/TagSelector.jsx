import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Chip, IconButton, Tooltip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { getTags } from '../../reducers/selectors';
import './TagSelector.css';

class TagSelector extends Component {
    state = {
        value: '',
        tags: [],
        selectedTags: [],
        note: null
    };

    static getDerivedStateFromProps(props, state) {
        if (state.note && state.note.id === props.note.id) {
            return state;
        }

        const newNote = props.note;

        if (newNote) {

            return {
                ...state,
                note: newNote,
                selectedTags: newNote.tags || [],
                tags: props.allTags.filter(it => !(newNote.tags || []).find(_it => _it.label === it.label))
            }
        }

        return {...state, note: newNote};
    }

    createTag() {
        const selectedTags = this.state.selectedTags;

        // if such tag has already existed -> not add it
        if (selectedTags && selectedTags.find(tag => tag.label === this.state.value)) {
            this.clearTag();
            return;
        }

        const tag = {
            label: this.state.value
        };

        this.setState((prevState) => ({
            selectedTags: [...prevState.selectedTags, tag]
        }), () => {
            this.props.tagsSelected(this.state.selectedTags);
            this.clearTag();
        });
    }

    clearTag() {
        this.setState({
            value: ''
        });
    }

    onInputChanged(e) {
        this.setState({
            value: e.target.value
        });
    }

    onTagSelected(value) {
        const selectedTag = this.state.tags.find(tag => tag.label === value);

        if (!selectedTag) {
            return;
        }

        this.setState((prevState) => ({
            selectedTags: [...prevState.selectedTags, selectedTag],
            tags: [...prevState.tags.filter(tag => tag.label !== selectedTag.label)],
        }), () => {
            this.props.tagsSelected(this.state.selectedTags);
            this.clearTag();
        });
    }

    onTagDeleted(deletedTag) {
        this.setState((prevState) => ({
            selectedTags: [...prevState.selectedTags.filter(tag => tag.label !== deletedTag.label)],
            tags: [...prevState.tags, deletedTag]
        }), () => {
            this.props.tagsSelected(this.state.selectedTags);
        });
    }

    render() {
        return (
            <div className="autocomplete-tag-selector">
                {/* chips for displaying selected tags */}
                <div className="choosen-tags">
                    {
                        this.state.selectedTags.map(
                            tag =>
                                <Chip
                                    className='tag-item'
                                    key={tag.label}
                                    label={tag.label}
                                    onDelete={() => this.onTagDeleted(tag)}/>
                        )
                    }
                </div>

                <div className="autocomplete">
                    <Autocomplete
                        getItemValue={(item) => item.label}
                        items={this.state.tags}
                        renderInput={(props) => <input {...props} placeholder='Tags'/>}
                        renderItem={(item, highlighted) =>
                            <div
                                key={item.label}
                                className={classNames('autocomplete-item', {'hovered': highlighted})}>
                                {item.label}
                            </div>
                        }
                        value={this.state.value}
                        onChange={e => this.onInputChanged(e)}
                        onSelect={value => this.onTagSelected(value)}
                        shouldItemRender={(item, value) => value && item && item.label.toLowerCase().startsWith(value.toLowerCase())}
                    />

                    <Tooltip title="Create new tag">
                        <IconButton size='small' onClick={() => this.createTag()}>
                            <DoneIcon
                                fontSize='inherit'
                                color='primary'/>
                        </IconButton>
                    </Tooltip>

                    <IconButton size='small' onClick={() => this.clearTag()}>
                        <ClearIcon
                            fontSize='inherit'
                            color='primary'/>
                    </IconButton>
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => {
        return {
            allTags: getTags(state)
        }
    }
)(withRouter(TagSelector));