# Branch Strategy

- `main`: Production-ready code. Merges from `release/*` or `hotfix/*` only.
- `develop`: Integration branch. Merges from `feature/*`. Merged to `release/*` before production.
- `feature/*`: For new features. Branched from `develop`.
- `release/*`: For release preparation. Branched from `develop`, merged to `main` and `develop`.
- `hotfix/*`: For production fixes. Branched from `main`, merged to `main` and `develop`.

---
All pull requests must follow the guidelines in `CONTRIBUTING.md` and use the template provided in `.github/PULL_REQUEST_TEMPLATE.md`.
