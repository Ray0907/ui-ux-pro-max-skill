# @ray0907/uipro-cli

Community-maintained CLI to install UI/UX Pro Max skill for AI coding assistants.

This package is published from the community-maintained fork at `Ray0907/ui-ux-pro-max-skill`.

## Installation

```bash
npm install -g @ray0907/uipro-cli
```

## Usage

```bash
# Install for specific AI assistant
uipro init --ai claude      # Claude Code
uipro init --ai cursor      # Cursor
uipro init --ai windsurf    # Windsurf
uipro init --ai antigravity # Antigravity
uipro init --ai copilot     # GitHub Copilot
uipro init --ai kiro        # Kiro
uipro init --ai codex       # Codex (Skills)
uipro init --ai roocode     # Roo Code
uipro init --ai qoder       # Qoder
uipro init --ai gemini      # Gemini CLI
uipro init --ai trae        # Trae
uipro init --ai opencode    # OpenCode
uipro init --ai continue    # Continue (Skills)
uipro init --ai all         # All assistants

# Options
uipro init --offline        # Compatibility flag; installs bundled templates
uipro init --force          # Overwrite existing files

# Other commands
uipro versions              # List available versions
uipro update                # Refresh skill files from installed CLI package
```

## How It Works

`uipro init` generates assistant-specific files from the templates bundled with the installed CLI package. To get newer templates and data, update the package first:

```bash
npm install -g @ray0907/uipro-cli@latest
uipro init --ai codex
```

## Development

```bash
# Install dependencies
bun install

# Run locally
bun run src/index.ts --help

# Build
bun run build

# Sync bundled CLI assets from the source skill
npm run sync:assets

# Verify bundled assets are current before publishing
npm run check:assets

# Link for local testing
bun link
```

## License

CC-BY-NC-4.0
