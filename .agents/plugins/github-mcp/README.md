# GitHub MCP Server Setup

This plugin configures the official GitHub Model Context Protocol (MCP) server for this workspace.

## Configuration

1. Generate a GitHub Personal Access Token (PAT):
   - Go to [GitHub Token Settings](https://github.com/settings/tokens).
   - Create a Classic Token with `repo`, `read:org`, and `user` scopes (or a fine-grained token with repository read/write access).
2. Replace `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN` in [mcp_config.json](file:///e:/Zen/projects/portfolio/Portfolio/.agents/plugins/github-mcp/mcp_config.json) with your token.
3. Reload/restart the Antigravity IDE or check **Additional Options (...) > MCP Servers** to verify the connected tools.
