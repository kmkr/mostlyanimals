import React, {PropTypes, PureComponent} from 'react';
import {connect} from 'react-redux';

import {toggleDetails} from '../photos/photo-actions';

import './menu-bar.scss';

const TOGGLE_KEYS = [13 /* enter */, 32/* space */];

class MenuBar extends PureComponent {
    constructor() {
        super();
        this.handleClickDetails = this.handleClickDetails.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleClickDetails() {
        const {dispatch, photo} = this.props;
        dispatch(toggleDetails(photo.key));
    }

    handleKeyDown(e) {
        const keyCode = e.keyCode || e.detail.keyCode;
        if (TOGGLE_KEYS.indexOf(keyCode) !== -1) {
            e.preventDefault();
            e.stopPropagation();
            this.handleClickDetails();
        }
    }

    render() {
        const {photo} = this.props;

        return (
            <div>
                <div id="menu-bar"
                     onClick={this.handleClickDetails}
                     className={photo.mode}>

                    <div
                        className={photo.detailsActive ? 'expanded' : ''}
                        tabIndex="0" onKeyDown={this.handleKeyDown}>
                        <div>+</div>
                    </div>
                </div>
            </div>
        );
    }
}

// todo: fjern connect herfra
function mapStateToProps() {
    return {};
}

MenuBar.propTypes = {
    photo: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(MenuBar);