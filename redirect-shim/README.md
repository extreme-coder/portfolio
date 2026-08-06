# redirect-shim

This is **not** part of the site. It is the entire contents of a separate
Cloudflare **Pages** project named `aryansinghportfolio`, which exists only to
claim the hostname `aryansinghportfolio.pages.dev` and 301 it to the real Worker.

## Why it exists

A `pages.dev` URL was given out as the portfolio's address before the actual
deploy target was known. Cloudflare Workers cannot serve a `pages.dev` hostname —
that namespace comes from Pages *project names* — so the name has to be claimed
by a real Pages project. This directory is that project.

One file, one rule: every path 301s to the same path on the Worker, so
`aryansinghportfolio.pages.dev/work` lands on `.../work` rather than the
homepage. Query strings are carried over too.

`pages.dev` names are globally unique across all Cloudflare accounts, and a
collision is **silent** — Cloudflare appends a random suffix instead of failing,
which is how `cryptic` ended up on `cryptic-7dc.pages.dev`. The first choice here,
`aryansingh`, is taken by another account and produced `aryansingh-fts`. To test a
name before creating it, resolve it: `NXDOMAIN` means free, a reachable host
(even one erroring with `522`) means taken.

## Deploying it

Rarely needed — only if the Worker's hostname changes.

```sh
npm run deploy:redirect
```

Requires `wrangler login` and Node >= 22 (see `claude-wiki/deployment.md`).

First-time setup only, before the first deploy:

```sh
npx wrangler pages project create aryansinghportfolio --production-branch main
```

The project name **must** stay `aryansinghportfolio` — it is what produces the
hostname. `--branch main` on deploy must match `--production-branch`, or the
upload becomes a preview deployment on a hash-prefixed host and the real
hostname stays dead.

## Do not add files here

An `index.html` would be dead weight: the `/*` rule already covers `/`. Adding
static assets also risks them taking precedence over the redirect rule for their
own paths.
