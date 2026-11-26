// Pure, so node --test covers it.

// Herdr reports "blocked" when an agent needs the person: a question or a permission.
// terminals() lists sub-agents too, which agents() leaves out: they run inside their parent's pane.
export const waiting = (terminals) => terminals.filter((t) => t.status === "blocked").length;

// What the Dock icon shows: the count, or nothing (null clears the badge).
export const badgeText = (count) => (count ? String(count) : null);
