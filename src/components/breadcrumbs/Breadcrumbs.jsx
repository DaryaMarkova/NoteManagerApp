import React, { PureComponent } from 'react';
import Navigation from '@material-ui/core/Breadcrumbs';
import NavLink from '@material-ui/core/Link';
import { connect } from 'react-redux';
import { getSelectedFolderHistory } from '../../reducers/selectors';
import './Breadcrumbs.css';

class Breadcrumbs extends PureComponent {
    render() {
        return (
            <Navigation className='navigation'>
                {
                    this.props.breadcrumbs.reverse().map(it =>
                        <NavLink key={it.id} href={`/${it.id}`}>
                            {it.label}
                        </NavLink>
                    )
                }
            </Navigation>
        );
    }
}

export default connect(
    (state) => {
        return {
            breadcrumbs: getSelectedFolderHistory(state)
        }
    }
)(Breadcrumbs);