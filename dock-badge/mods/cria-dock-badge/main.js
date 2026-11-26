// The Herdr Dock icon's badge: how many agents wait on the person, sub-agents included.
// The layout gives this mod a 0-pixel spot, so it draws nothing. Herdr redraws it when an
// agent's status changes, which keeps the count current.
import { View, div } from "gpui-kit";
import { terminals, setBadge, checking } from "herdr";
import { waiting, badgeText } from "./count.js";

export default class DockBadge extends View {
  render() {
    const text = badgeText(waiting(terminals()));
    // setBadge is meant to be called when the text changes, not on every render.
    if (text !== this.text && !checking()) {
      this.text = text;
      setBadge(text);
    }
    return div();
  }

  // A layout without this mod would otherwise keep showing the last count.
  close() {
    if (!checking()) setBadge(null);
  }
}
