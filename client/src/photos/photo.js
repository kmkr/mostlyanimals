/** @jsx h */
import { h } from 'preact'

import PhotoText from './photo-text'
import Sidebar from './sidebar'
import TransitionImage from '../transition-image'
import buildSrcSet from './src-set-builder'

const Photo = ({ next, previous, photo }) => (
  <div class={`photo-and-navigation ${photo.mode}`}>
    <div class="photo-and-sidebar">
      <div class="photo-wrapper">
        {previous}
        {next}
        <TransitionImage
          alt={photo.title}
          src={photo.sizes.large.url}
          srcSet={buildSrcSet(photo.sizes)}
          sizes="100vw"
        />
      </div>
      <PhotoText photo={photo} />
      <Sidebar photo={photo} />
    </div>
  </div>
)

export default Photo
