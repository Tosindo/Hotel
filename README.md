# Idle Hotel

An incremental horror game about running a hotel that maybe shouldn't be run.

You inherit a building, start renting out rooms, and gradually expand into something
worse. It's early days — **very much in development** — and the horror is admittedly
still a bit missing. The plan is for it to arrive.

## Play

Both versions are hosted on GitHub Pages:

- **[Play the current version](https://tosindo.github.io/Hotel/)** — the old, more
  complete build. This is the one to play right now.
- **[New engine preview](https://tosindo.github.io/Hotel/new-engine/)** — a rewrite
  built on a new computation engine. **Very incomplete.** It's a technical preview of
  where the game is heading, not a playable version.

## The two versions

The `main` branch (this one) is the original build. It runs on the older
store-and-update approach and has the most content: rooms, staff, buildings, and
upgrades.

The `new-engine` branch replaces that with a dependency-graph computation engine — units
declare what they depend on, and values are recomputed through the graph instead of being
pushed around manually. That makes adding content far more tractable, which is why the
rewrite is happening. It is currently missing most of the actual game, and its save
format is not compatible with this version.

## Credits

- **Art:** all human made.
- **Code:** written with AI assistance.
- **Audio:** "Crumpling Piece of Paper.wav" by F.M.Audio, licensed
  [CC BY 4.0](https://freesound.org/s/561145/).

## Development

Requires [Bun](https://bun.sh) (or npm).

```bash
bun install
bun run dev      # dev server
bun run build    # production build
bun run lint
```

The deploy serves from a subpath on GitHub Pages, so the base path is configurable:

```bash
BASE_PATH=/Hotel/ bun run build
```
