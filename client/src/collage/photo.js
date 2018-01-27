/** @jsx h */
import { h, Component } from 'preact'

import TransitionImage from '../transition-image'
import PhotoText from '../photos/photo-text'
import buildSrcSet from '../photos/src-set-builder'

class Photo extends Component {
  constructor() {
    super()
    this.onClick = this.onClick.bind(this)
  }
  onClick(e) {
    e.preventDefault()
    this.props.onSelect(this.props.photo)
  }

  render() {
    const { photo, setWidth } = this.props
    const style = {
      width: setWidth ? `${photo.displayedWidth}px` : '100%'
    }

    return (
      <div style={style}>
        <a href={`/photos/${photo.key}`} onClick={this.onClick}>
          <div class="overlay-title-wrapper">
            <p class="title">{photo.title}</p>
            <p class="location">{photo.location}</p>
          </div>
          <TransitionImage
            alt={photo.title}
            src={photo.sizes.xsmall.url}
            srcSet={buildSrcSet(photo.sizes)}
            sizes="(min-width: 1100px) 30vw, 100vw"
          />
        </a>

        <div className="sn-dn-ns sn-mb-l">
          <PhotoText photo={photo} />
        </div>
      </div>
    )
  }
}

export default Photo
