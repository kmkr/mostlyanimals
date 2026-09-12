import throttleit from "throttleit";

export default function throttle(
  type: string,
  name: string,
  obj: Window = window
): void {
  let running = false;
  const func = throttleit(() => {
    if (running) {
      return;
    }
    running = true;
    window.requestAnimationFrame(() => {
      obj.dispatchEvent(new window.CustomEvent(name));
      running = false;
    });
  }, 200);
  obj.addEventListener(type, func);
}
