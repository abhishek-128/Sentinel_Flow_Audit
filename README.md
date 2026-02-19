
# SentinelFlow Auditor | AB Labs

A high-precision forensic tool for detecting Reasoning Drift in AI agents.

## Deployment on GitHub

1. **Create a Repository**: Create a new repository on GitHub named `sentinelflow-auditor`.
2. **Push Code**: Initialize a local git repo and push these files to the `main` branch.
3. **Configure Secrets**:
   - Go to `Settings` > `Secrets and variables` > `Actions`.
   - Add a New Repository Secret:
     - Name: `API_KEY`
     - Value: [Your Google Gemini API Key]
4. **Enable GitHub Pages**:
   - Once the Action runs for the first time, a `gh-pages` branch will be created.
   - Go to `Settings` > `Pages`.
   - Set the source to the `gh-pages` branch.

## Technical Architecture

- **Engine**: Google Gemini 3 (Pro/Flash)
- **Logic**: Deterministic Python Regex via Code Execution
- **UI**: React 19 + Recharts
- **Theming**: AB Labs Forensic Dark Mode (Surgical Red/Cyan)
