function createCustomEvent(
  event: string,
  params: CustomEventInit = {
    bubbles: false,
    cancelable: false,
    detail: undefined,
  }
): globalThis.CustomEvent {
  const evt = document.createEvent("CustomEvent");
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
  return evt as globalThis.CustomEvent;
}

if (typeof window !== "undefined" && typeof window.CustomEvent !== "function") {
  Object.defineProperty(createCustomEvent, "prototype", {
    value: window.Event.prototype,
    writable: true,
  });
  window.CustomEvent = createCustomEvent as typeof window.CustomEvent;
}
