function CustomEvent(event, params) {
  params = params || {
    bubbles: false,
    cancelable: false,
    detail: undefined
  }
  const evt = document.createEvent('CustomEvent')
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
  return evt
}

if (typeof window.CustomEvent !== 'function') {
  CustomEvent.prototype = window.Event.prototype
  window.CustomEvent = CustomEvent
}
