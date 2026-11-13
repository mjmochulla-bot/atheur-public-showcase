# Architecture

The showcase has no server and no runtime imports outside its own repository and declared UI dependencies. `simulation.ts` is a newly written deterministic fixture and ledger. `main.tsx` owns session state, hash navigation, forms, charts and scripted agent review. `style.css` supplies responsive layouts. No external fonts or images are fetched.

Paper entry validates finite values, cash, aggregate allocation and protective ranges. Positions are long spot only. Each market step checks stops before targets against a single synthetic quote. Closes realize P/L into cash. Equity is cash plus marked positions; samples are recorded at market steps. The demo excludes fees and execution realism. This is not an implementation of private risk or selection logic.

The private system was inspected read-only through its connected repository and historical local files. Current README, frontend entry/component/styles/package metadata and mobile package metadata informed high-level descriptions. No backend implementation was copied. Original public-data research, worker persistence and authenticated local mobile access are described only at a conceptual level.

Developer-mode milestones describe component progression without inventing completion dates. No private performance, sample counts or telemetry are reused. Agent outputs are explicitly labeled scripted examples. The frontend's browser code must be treated as public whenever deployed.
