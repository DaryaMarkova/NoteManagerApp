import React, { Component, Fragment } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { connect } from 'react-redux';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { searchNotices } from '../../reducers/treeReducer';

export enum SearchOption {
    SIMPLE = 1,  // through the names of notes
    ADVANCED = 2 // through the content of notes and tags.
}

class Search extends Component<any, any> {
    state = {
        searchPattern: '',
        searchOption: SearchOption.SIMPLE
    };

    searchPattern$: BehaviorSubject<string | null>;

    componentDidMount() {
        this.searchPattern$ = new BehaviorSubject(null);

        this.searchPattern$.pipe(
            distinctUntilChanged(),
            debounceTime(200)
        ).subscribe(value => {
            this.props.searchNotices({
                pattern: value,
                mode: this.state.searchOption
            });
        });
    }

    onSearchInputChanged(value: string) {
        this.setState({
            searchPattern: value
        }, () => {
            this.searchPattern$.next(this.state.searchPattern);
        });
    }

    onSearchOptionChanged(value: any) {
        this.setState({
            searchOption: +value
        }, () => {
            this.searchPattern$.next(this.state.searchPattern);
        });
    }

    render() {
        return (
            <Fragment>
                <TextField
                    className="search-field"
                    label="Search through..."
                    onChange={e => this.onSearchInputChanged(e.target.value)}
                />

                <TextField
                    select
                    margin="normal"
                    value={this.state.searchOption}
                    onChange={e => this.onSearchOptionChanged(e.target.value)}>
                    {
                        Object.values(SearchOption).map((option, index) => {
                            return (
                                !(parseInt(option)) ?
                                    <MenuItem
                                        key={index}
                                        value={index + 1}
                                        disableRipple>
                                        {option.toLowerCase()}
                                    </MenuItem> :
                                    null
                            )
                        })
                    }
                </TextField>
            </Fragment>
        );
    }
}

export default connect(
    () => {
        return {}
    }, dispatch => {
        return {
            searchNotices: (data: any) => dispatch(searchNotices(data))
        }
    }
)(Search);