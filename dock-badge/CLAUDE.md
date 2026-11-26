# dock-badge

The `cria-dock-badge` mod, listed as `herdr.dev/mods/gsydler/herdr-cria--dock-badge`. `mods/cria-dock-badge/` is the mod; `RECIPE.md` and `preview.png` are what herdr.dev/mods reads. `README.md` is for people on GitHub. The repo-wide rules, checks and versioning are in `../CLAUDE.md`.

## Checks

- `node --test 'dock-badge/tests/*.test.mjs'` from the repo's top folder, and `node scripts/check-herdr.mjs dock-badge`. CI runs the tests on Linux, macOS and Windows: the counting is plain JavaScript, even though only macOS shows the badge.
- `smoke-test` skill: the running app, with the person reading the Dock, since `herdr-app shot` captures only Herdr's window.
- After a change under `mods/`, and before tagging a release (`dock-badge/vX.Y.Z`), run the `release-check` skill.

## Where logic goes

What counts and what the badge says live in `count.js`, marked "Pure, so node --test covers it", with its tests in `tests/count.test.mjs`. `main.js` only calls `herdr`: it reads `terminals()`, sets the badge, and draws an empty `div()`.

The mod name is in the layout block people add (`"mod": "cria-dock-badge"`): a rename breaks every layout that has it. The folder name (`dock-badge`) is only in the address and this repo's paths.

## Release check

What the `release-check` skill holds this mod to, besides the repo-wide steps:

- **Security:** the mod calls `setBadge` and nothing else with an effect: no `exec`, no `fetch`, no file reads or writes. Any new call of that kind is a finding until `RECIPE.md` ("Watch out") and `README.md` ("What it does on your computer") disclose it.
- **Feature list:** what counts (`count.js`), when the badge changes or clears (`main.js`'s `render()` and `close()`), and the layout block from "Install" are in `README.md` ("Features", "Install") and `RECIPE.md` ("How it behaves", "Install"), and each claim there is in the code.
- **Preview:** the mod draws nothing in the window; `preview.png` shows a drawing of the Dock icon in `assets/banner.html`. It is stale only when the banner's text or the badge's look changes.

## Smoke test

Two steps: the count (an agent and its sub-agent, updated without touching Herdr) and the clearing. The unit tests cover the rest.

- **Oracle:** `samples/expected.json` holds no `visible` lines, only `manual` steps: the person reads the Dock.
- **Set up:** install this build in `~/.config/herdr-app/mods/cria-dock-badge/`. The test layout `badge-test` is a copy of `layouts/main.json` with the block from `RECIPE.md` ("Install") as the last child of the `work` column: make it if it's missing, and switch to it. The layout without the mod is Herdr's `main`.
- **Agents that wait:** write the sub-agent's task to `/tmp/claude/ask-badge-child.txt` (wait 5 seconds, then ask a question with AskUserQuestion). Start `hc run --bg --name ask-badge claude "<task>"`, the task saying to run `hc run --bg --name ask-badge-child claude "$(cat /tmp/claude/ask-badge-child.txt)"`, wait 5 seconds, then ask a question too. `hc wait ask-badge-child` returns when both wait.
- **Ask in plain text:** while an agent shows the person a question (AskUserQuestion), its own session counts as waiting too. Ask about the Dock in a normal message, so the expected number holds.
- **Clean up:** `hc kill` and `hc rm` both agents, delete the task file, and switch the person back to the layout `herdr-app status` showed at the start. Keep `badge-test` for the next release.

## The banner

`preview.png` is the banner `scripts/banner.sh dock-badge` renders from `assets/banner.html`. There is no screenshot in it: the mod draws nothing in the window, and `herdr-app shot` can't capture the Dock. The banner draws a Dock with a generic app icon and its badge in HTML and CSS; change it there and re-render (release-check skill, `PREVIEW.md`, step 7).
