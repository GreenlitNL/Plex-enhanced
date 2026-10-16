# Instructions for AI Agents & Contributors

## 1. Core Principles (KISS & Quality)
- **Production quality without over-engineering**: Write clean, maintainable, and reliable code for real users. Avoid speculative abstractions and unnecessary complexity.
- **No band-aids or quick fixes**: Always solve problems at their root cause.
- **Explicit consent required**: Never commit or push changes unless the user explicitly instructs you to do so.

## 2. Project Architecture & Quick Commands
- **Stack**: Tampermonkey / Violentmonkey Userscript (Vanilla JavaScript).
- **Primary Source**: Single target file `plex-enhanced-player.user.js` (dev loader in `plex-enhanced-player.dev.user.js`).
- **Quick Workflow**:
  - Development: Test changes directly in the browser by loading the script or dev wrapper.
  - Validate: Syntax check via `node -c plex-enhanced-player.user.js`.

## 3. Git, Versioning & Release Protocol
1. **Session Bootstrap**: Before starting any work, ensure the branch is up to date:
   ```bash
   git pull --rebase origin main
   ```
2. **Never Touch Version Fields**: NEVER edit `// @version` in `plex-enhanced-player.user.js` manually. Semantic versioning is 100% automated in CI on push to `main`.
3. **Strict Conventional Commits**: Enforced by local git hooks:
   - `feat: <description>` → MINOR release bump (e.g. 6.4.0 → 6.5.0)
   - `fix: <description>` → PATCH release bump (e.g. 6.4.0 → 6.4.1)
   - `perf: <description>` → PATCH release bump
   - `chore:`, `docs:`, `refactor:`, `test:`, `ci:` → No release triggered
   - `feat!: <description>` or `BREAKING CHANGE:` → MAJOR release bump
4. **Push Safeguards**: A local pre-push hook prevents pushing if remote has newer release commits. If blocked, run `git pull --rebase origin main`.

## 4. Domain & Platform Rules
- **Userscript Runtime**: Runs inside Plex Web and Cinecat players across modern browsers.
- **Auto-Update Mechanism**: Userscripts auto-update by polling `@updateURL` pointing to GitHub raw content from release tags.
- **DOM Resilience**: Video players frequently mutate their DOM during stream transitions; use defensive observers and guards.
