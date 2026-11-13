# Public export security review — 2026-11-13

This release was assembled using explicit source-file and directory allowlists into a new Git repository. No original Atheur Git history, backend source, runtime records, environment files, credentials, certificates, executables or Sites hosting identity was copied.

Eight automated tests and TypeScript/Vite production build passed. Production dependency audit reported no known vulnerabilities. A source/build/history pattern scan found no matches. Manual source review confirms all application data is synthetic and agent decisions are scripted; the learning section contains high-level architecture only, with future work marked proposed. Pattern scans are not a guarantee against every possible secret.

The production page was inspected in-browser at desktop width. Comprehensive assistive-technology and cross-browser certification are not claimed. No live service or private engine is connected. Production CSP blocks network connections. Public source and deployed assets are inspectable and copyable; intellectual property protection comes from excluding proprietary implementation.
