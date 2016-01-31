import React, {Component} from 'react';
import {connect} from 'react-redux';

import PhotoUploader from './photos/photo-uploader';
import {updatePhoto} from './photos/update-photo-actions';
import {uploadPhoto} from './photos/upload-photo-actions';
import {deletePhoto} from './photos/delete-photo-actions';
import ListPhotos from './photos/list-photos';
import {fetchPhotos} from '../photos/photo-actions';

class App extends Component {
    componentWillMount() {
        this.props.dispatch(fetchPhotos());
    }

    onAddPhoto(photo) {
        this.props.dispatch(uploadPhoto(photo));
    }

    onDeleteClick(photo) {
        this.props.dispatch(deletePhoto(photo));
    }

    onUpdateClick(photo, updatedValues) {
        this.props.dispatch(updatePhoto(photo, updatedValues));
    }

    render() {
        return (
            <div>
                <PhotoUploader onAddPhoto={this.onAddPhoto.bind(this)} />
                <ListPhotos
                    photos={this.props.photos.data}
                    onDeleteClick={this.onDeleteClick.bind(this)}
                    onUpdateClick={this.onUpdateClick.bind(this)} />
            </div>
        );
    }
}

function select(state) {
    return {
        photos: state.photos
    };
}

export default connect(select)(App);
