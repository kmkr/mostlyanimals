import { PureComponent } from "react";

const LEFT_KEYS = [
  33, // pgup
  37, // arrow left
];
const RIGHT_KEYS = [
  32, // space
  34, // pgdn
  39, // arrow right
];
const SIDEBAR_KEYS = [
  73, // i
];
const HOME_KEYS = [
  27, // ESC
];

interface KeyboardEventHandlerProps {
  onHome: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleSidebar: () => void;
}

class KeyboardEventHandler extends PureComponent<KeyboardEventHandlerProps> {
  constructor(props: KeyboardEventHandlerProps) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  handleKeyUp(e: KeyboardEvent & { detail?: { keyCode?: number } }) {
    const keyCode = e.keyCode || e.detail?.keyCode;
    if (keyCode === undefined) {
      return;
    }
    const { onHome, onPrevious, onNext, onToggleSidebar } = this.props;

    if (e.altKey) {
      return;
    }

    if (LEFT_KEYS.indexOf(keyCode) !== -1) {
      e.preventDefault();
      onPrevious();
    } else if (RIGHT_KEYS.indexOf(keyCode) !== -1) {
      e.preventDefault();
      onNext();
    } else if (SIDEBAR_KEYS.indexOf(keyCode) !== -1) {
      e.preventDefault();
      onToggleSidebar();
    } else if (HOME_KEYS.indexOf(keyCode) !== -1) {
      e.preventDefault();
      onHome();
    }
  }

  render() {
    return null;
  }
}

export default KeyboardEventHandler;
