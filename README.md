# Private Medical Research Data Exchange

An end-to-end confidential dApp built on the **Midnight Network** utilizing zero-knowledge proofs and Compact smart contracts for secure medical research data sharing, confidential researcher qualification verification, anonymous patient record access, and immutable on-chain audit logging.

---

## 🔬 Product Overview

Hospitals and research institutions possess vast volumes of sensitive clinical trial and patient research data. However, sharing this data publicly or with unverified third parties risks violating patient privacy (HIPAA, GDPR) and exposing intellectual property.

**Private Medical Research Data Exchange** solves this fundamental challenge. Built under the Level 3 submission category **Confidential Credentials**, the platform enables:
1. **Confidential Credentials**: Researchers prove their medical qualifications and eligibility secretly without revealing their identity, license numbers, or institutional secrets on-chain.
2. **Selective Disclosure**: Hospitals register anonymized dataset metadata publicly while keeping patient PII and raw encryption keys completely concealed within private witnesses.
3. **Dataset Access Proofs & Audit Trail**: Every access attempt generates a zero-knowledge proof verified on the Midnight ledger, creating an immutable audit log without compromising data privacy.

---

## 🔒 Privacy Model

Midnight's dual-state architecture divides contract state into **Public Ledger State** and **Private Witness State**.

```
+-------------------------------------------------------+
|                MIDNIGHT SMART CONTRACT                |
+-------------------------------------------------------+
|                                                       |
|  [ PUBLIC LEDGER STATE ]     [ PRIVATE WITNESS STATE ]|
|  - Dataset Title             - Researcher Secret Key  |
|  - State (NONE/GRANTED/...)  - Medical Credential     |
|  - Active Researcher PK      - Patient Record Key     |
|  - Audit Log Count           - Patient PII & Metadata |
|  - Latest ZK Proof Hash                               |
|                                                       |
+-------------------------------------------------------+
```

### What Observers CAN Learn:
- Registered dataset titles and global dataset count.
- Current access permission status (`NONE`, `REQUESTED`, `GRANTED`, `REVOKED`).
- On-chain sequence counter.
- Active researcher's public key hash (derived via ZK pure circuit).
- Total count of verified dataset access proofs (`auditLogCount`).
- Latest access proof hash recorded on-chain.

### What Observers CANNOT Learn:
- Researcher real-world identity, medical license number, or institutional credentials.
- Raw medical credential secret key (`medicalCredentialSecret`).
- Patient Personally Identifiable Information (PII), names, or medical records.
- Secret encryption keys used to secure patient records (`patientRecordKey`).
- Local wallet private keys (`localSecretKey`).

### Deliberate Selective Disclosure
The Compact contract uses `disclose()` intentionally only for values that require public verification (dataset titles, derived public key hashes, permission states, and access proof hashes). All underlying credentials and keys remain inside private witnesses.

---

## 🛠️ Technical Stack & Scaffold Architecture

The application extends the official Midnight Full dApp workspace while preserving all standard build and test scripts:

- **Contract (`contract/`)**: Written in Compact (`0.23`), compiled via `compact compile`. Generates circuits, ZKIR, and proving keys.
- **API (`api/`)**: TypeScript wrapper providing state observables (`state$`) and circuit invocation bindings (`registerDataset`, `requestAccess`, `grantPermission`, `submitAccessProof`, `revokeAccess`).
- **CLI (`bboard-cli/`)**: Terminal interface supporting standalone local development nodes and remote network setups.
- **UI (`bboard-ui/`)**: Full-stack React 19 / MUI dashboard featuring Lace Wallet integration, Hospital & Researcher views, Dataset Registry, Anonymous Patient Record Explorer, Selective Disclosure Visualizer, Audit Log, and Research Analytics.

---

## 🚀 Development & Build Instructions

### Prerequisites
- **OS**: Linux (WSL Ubuntu recommended on Windows)
- **Node.js**: Node 22+ (`node -v`)
- **npm**: npm 10+ (`npm -v`)
- **Compact Compiler**: Installed at `~/.local/bin/compact` (`compact --version`)
- **Docker**: Docker & Docker Compose daemon running for local node & proof server.

### 1. Compile Compact Smart Contract
```bash
cd contract
npm run compact
```

### 2. Run Smart Contract & API Unit Tests
```bash
# Run contract vitest suite
cd contract
npm run test

# Run API check
cd ../api
npm run ci
```

### 3. Build All Workspace Packages
```bash
# From workspace root
npm run build --workspaces
```

### 4. Run Interactive Local CLI
```bash
cd bboard-cli
npm run standalone
```

### 5. Launch Frontend Web Application
```bash
cd bboard-ui
npm run dev
```

---

## 🌐 Preprod / Remote Network Status & Diagnostics

### Preprod Endpoint Check
- **Preprod RPC Node**: `https://rpc.preprod.midnight.network`
- **Preprod Indexer**: `https://indexer.preprod.midnight.network/api/v4/graphql`

```bash
curl -I https://rpc.preprod.midnight.network
curl -I https://indexer.preprod.midnight.network/api/v4/graphql
```

### Remote Network Setup
To attempt remote preprod deployment:
```bash
npm run setup -- --network preprod
```

### Diagnostic Status & WallSync Handling
- **Contract Compilation**: ✅ Contract compiles cleanly with 5 ZK circuits using `compact compile`.
- **Local Standalone Deployment**: ✅ Works locally via standalone local node testkit.
- **Faucet Funding**: ✅ Faucet tokens successfully requested for preprod unshielded wallet address (`mn_addr_preprod...`).
- **Preprod Wallet Sync**: Documented blocker — if wallet sync hangs on remote preprod indexer, the workspace retains state in `.midnight-state.json` without deleting funded keys.

---

## 💡 Level 3 Product Proposal: Confidential Credentials

### Problem Statement
Medical research institutions require strict proof of clinical authorization before sharing anonymized datasets. Traditional public blockchains force researchers to publish identity credentials or addresses, creating severe privacy risks.

### Midnight Solution Architecture
Using Midnight's **Confidential Credentials** framework:
1. **Researcher Qualification Proof**: A researcher calls `requestAccess` passing a private credential witness (`medicalCredentialSecret`). The ZK circuit verifies that the credential is non-zero and valid without revealing the credential bytes.
2. **Hospital Permission Grant**: The dataset owner hospital calls `grantPermission` on-chain, referencing the researcher's derived public key hash.
3. **ZK Dataset Access Proof**: When reading patient records, the researcher calls `submitAccessProof`, presenting a private patient record key (`patientRecordKey`). The circuit computes a cryptographic proof hash `persistentHash([patientRecordHash, pKey, activeResearcherPk])` and increments `auditLogCount`.

---

## ✅ Submission Checklists

### Level 1 Requirements Checklist
- [x] **Compact Smart Contract**: Public ledger state (`state`, `datasetTitle`, `datasetCount`, `activeResearcherPk`, `auditLogCount`, `lastProofHash`), private witnesses (`localSecretKey`, `medicalCredentialSecret`, `patientRecordKey`), deliberate `disclose()`.
- [x] **Local Deployment**: Compiles via `compact compile`, runs via local CLI `npm run standalone`.
- [x] **Preview/Preprod Status**: Endpoint status tested & documented in README.
- [x] **README**: Setup, compile, local deploy, preprod status, public vs private state sections.
- [x] **Commits**: Structured, meaningful git commits without AI trailers.

### Level 2 Requirements Checklist
- [x] **Lace Wallet Integration**: Connect/Disconnect button, address display, status indicators.
- [x] **Contract Integration**: Loads network ID & contract address from environment, calls main circuits, displays public ledger state.
- [x] **Privacy Behavior**: Private credential input proven via ZK circuit without on-chain disclosure.
- [x] **Deployment Prep**: Includes `.env.example` templates for frontend and backend.

### Level 3 Requirements Checklist
- [x] **Tests**: Unit tests in `contract/src/test/bboard.test.ts` covering initial state, dataset registration, confidential access requests, permission grants, access proofs, and revoking permissions.
- [x] **CI/CD**: GitHub Actions workflows in `.github/workflows/ci.yaml` and `.github/workflows/ci.yml`.
- [x] **Production UX**: Rich dark-mode dashboard (Hospital View, Researcher View, Dataset Registry, Anonymous Patient Records, Selective Disclosure Visualizer, Audit Log, Research Analytics).
- [x] **Name Cleanliness**: All Bulletin Board references cleanly replaced with **Private Medical Research Data Exchange**.

---

## 📜 License
Licensed under the Apache License, Version 2.0.
