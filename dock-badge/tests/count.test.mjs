// The count the Dock icon shows.
import { test } from "node:test";
import assert from "node:assert/strict";
import { waiting, badgeText } from "../mods/cria-dock-badge/count.js";

const terminal = (address, status, parent = null) => ({ address, status, parent });

test("counts only the terminals waiting on the person", () => {
  assert.equal(waiting([terminal("t1", "blocked"), terminal("t2", "working"), terminal("t3", "done"),
    terminal("t4", "idle"), terminal("t5", "error"), terminal("t6", null)]), 1);
});

test("a waiting sub-agent counts like its parent", () => {
  assert.equal(waiting([terminal("t1", "blocked"), terminal("t2", "blocked", "t1"), terminal("t3", "working")]), 2);
});

test("nothing waiting, or no terminals, counts zero", () => {
  assert.equal(waiting([]), 0);
  assert.equal(waiting([terminal("t1", "working")]), 0);
});

test("the badge shows the count, and nothing for zero", () => {
  assert.equal(badgeText(0), null);
  assert.equal(badgeText(1), "1");
  assert.equal(badgeText(12), "12");
});
