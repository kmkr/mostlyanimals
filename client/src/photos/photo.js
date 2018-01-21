/** @jsx h */
import { h } from 'preact'

import TransitionImage from '../transition-image'
import PhotoText from './photo-text'
import buildSrcSet from './src-set-builder'

const Photo = ({ photo, onNext, onPrevious }) => (
  <div>
    <TransitionImage
      alt={photo.title}
      onClick={onNext}
      src={photo.sizes.large.url}
      srcSet={buildSrcSet(photo.sizes)}
      sizes='100vw'
    />

    <PhotoText photo={photo} />

    <button onClick={onPrevious}>Previous</button>
    <button onClick={onNext}>Next</button>
  </div>
)

export default Photo
