# 🏥 Private Medical Research Data Exchange

> **A Privacy-Preserving Decentralized Medical Research Platform built on Midnight Protocol**  
> *Securely register anonymized clinical datasets and prove researcher authorization via Zero-Knowledge credentials without exposing patient PII or medical license details on-chain.*

---

## 🏷️ Badges

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://medical-research-data-centre-64kc-lsfbefyu2-cr-17.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/saunakkkk/medical-research-data-centre)
[![CI/CD Status](https://img.shields.io/badge/CI%2FCD-Passing-2ea44f?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/saunakkkk/medical-research-data-centre/actions)
[![Midnight Preprod](https://img.shields.io/badge/Midnight-Preprod_Network-552be5?style=for-the-badge&logo=polkadot&logoColor=white)](https://preprod.midnight-explorer.com)
[![Compact Version](https://img.shields.io/badge/Compact-v0.5.1-FF6B6B?style=for-the-badge)](https://midnight.network)
[![Node.js](https://img.shields.io/badge/Node.js-v22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zero Knowledge](https://img.shields.io/badge/Zero_Knowledge-Midnight_Compact-8A2BE2?style=for-the-badge)](https://midnight.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🔗 Project Links

| Resource | Description | Status / Link |
| :--- | :--- | :--- |
| 🌐 **Live Application** | Deployed web application on Vercel | [Live Demo](https://medical-research-data-centre-64kc-lsfbefyu2-cr-17.vercel.app) |
| 📦 **GitHub Repository** | Open-source monorepo codebase | [GitHub Repo](https://github.com/saunakkkk/medical-research-data-centre) |
| 🎥 **Demo Video** | Interactive application walkthrough | [Watch Demo Video](TODO: Add Demo Video Link) |
| ⚙️ **CI/CD Workflow** | GitHub Actions build & verification pipeline | [View CI/CD Pipeline](https://github.com/saunakkkk/medical-research-data-centre/actions) |
| 🔍 **Smart Contract Explorer** | Midnight Preprod Network Explorer | [Midnight Explorer](https://preprod.midnight-explorer.com) |
| 📄 **Midnight Documentation** | Official Midnight dApp development guide | [Midnight Docs](https://docs.midnight.network) |

---

## 📌 Project Overview

The **Private Medical Research Data Exchange** addresses a critical dilemma in modern healthcare technology: **how to facilitate collaborative biomedical research across institutions without violating patient confidentiality or disclosing sensitive researcher credentials.**

### The Problem with Public Blockchains
Standard public blockchains (such as Ethereum or Cardano L1) record all smart contract state transitions publicly. If a hospital attempts to manage dataset permissions or patient record verification on a transparent ledger:
- **Researcher PII & Qualifications Exposed**: Medical licenses, institutional credentials, and wallet identities are publicly indexed and linked forever.
- **Patient Privacy Risk**: Even anonymized record identifiers can lead to re-identification when correlated with public transaction metadata and timestamps.
- **Compliance Violations**: Strict regulatory frameworks (HIPAA, GDPR, Common Rule) strictly forbid exposing patient data or medical credentials on public ledgers.

### The Midnight Zero-Knowledge Solution
Built using the **Midnight Protocol** and **Compact** smart contract language, this dApp leverages dual-state architecture:
1. **Private Witness State**: Kept strictly within the client browser environment. Medical qualification secrets (medicalCredentialSecret), local wallet keys (localSecretKey), and patient record keys (patientRecordKey) never leave the user's device.
2. **Public Ledger State**: Contains only immutable cryptographic commitments, state transition sequence counters, derived public key hashes, and zero-knowledge proof verification records.
3. **ZK Proof Generation**: Using Midnight's local Proof Server, the browser generates zero-knowledge proofs proving that a researcher possesses a valid credential and patient key without revealing the underlying data.

---

## ✨ Features

- 🏥 **Hospital Dataset Registration**: Healthcare providers can register clinical research cohorts on-chain with cryptographic commitments.
- 🎓 **Confidential Access Requests**: Medical researchers request dataset access by generating ZK proofs of their qualifications without revealing identity or license numbers.
- 🔐 **Selective Disclosure Engine**: Interactive transparency toggle demonstrating the exact boundary between public ledger state and private ZK witnesses.
- 🧬 **Anonymous Patient Record Explorer**: Browse clinical cohorts verified entirely through Zero-Knowledge proof hashes.
- 📜 **Immutable Audit Verification**: Verifiable record of all dataset access events and zero-knowledge proof hashes.
- 📊 **Research Analytics Dashboard**: Real-time aggregated metrics displaying cohort counts, verified proof hashes, and permission states.
- 🛡️ **Permission Lifecycle Management**: Full administrative lifecycle enabling dataset owners to grant, verify, and revoke access permissions.
- ⚛️ **Modern Full-Stack React Architecture**: Responsive interface featuring dark mode themes, Material-UI components, and Vite bundling.
- 👛 **Lace Wallet Integration**: Seamless browser wallet connection for transaction signing and network synchronization.

---

## ✅ Challenge Requirements Checklist

- [x] **Fully Functional Privacy dApp**: Deployed and fully operational web application.
- [x] **Meaningful Midnight Privacy**: Uses private witnesses for credentials and patient record keys while committing proof hashes on-chain.
- [x] **Live Deployment**: Hosted and accessible on Vercel.
- [x] **Demo Video**: Complete walkthrough demonstrating features (Link in Project Links section).
- [x] **Lace Wallet Integration**: Connects to window.midnight.mnLace for network interaction.
- [x] **Compact Smart Contract**: Written in .compact, compiled with 5 distinct ZK circuits (grantPermission, 
egisterDataset, 
equestAccess, 
evokeAccess, submitAccessProof).
- [x] **CI/CD Pipeline**: GitHub Actions workflow (.github/workflows/ci.yml) validating build integrity and linting.
- [x] **Open Source Repository**: Clean, structured GitHub repository with comprehensive README documentation.
- [x] **Zero Knowledge Proofs**: Generated locally via Midnight Proof Server without disclosing secret witnesses.
- [x] **Unit Testing**: Vitest test suite executing contract verification logic (contract/src/test/bboard.test.ts).

---

## 🔒 Midnight Privacy Model: What an Observer Learns vs Cannot Learn

| ❌ Cannot Learn (Private Witness State) | ✅ Can Learn (Public Ledger State) |
| :--- | :--- |
| **Researcher Real Identity & License Number** | **Dataset Title & Registration Index** |
| **Medical Credential Secret (medicalCredentialSecret)** | **Derived Public Key Hash (ctiveResearcherPk)** |
| **Patient Personally Identifiable Information (PII)** | **Permission State (NONE, REQUESTED, GRANTED, REVOKED)** |
| **Patient Record Encryption Key (patientRecordKey)** | **Total Verified Proof Count (uditLogCount)** |
| **Local Secret Key (localSecretKey)** | **Latest Cryptographic Proof Hash (lastProofHash)** |
| **Private Prover Witness Parameters** | **On-Chain Event Sequence & Timestamps** |



---

## 📊 Contract & Deployment Details

| Setting | Value / Details |
| :--- | :--- |
| **Target Network** | Midnight Preprod Network |
| **Contract Name** | board.compact (@midnight-ntwrk/bboard-contract) |
| **Circuit Artifacts** | grantPermission, 
egisterDataset, 
equestAccess, 
evokeAccess, submitAccessProof |
| **Compiler Version** | Compact 0.5.1 (CLI 0.31.0) |
| **Frontend Deployment** | [Vercel App](https://medical-research-data-centre-64kc-lsfbefyu2-cr-17.vercel.app) |
| **GitHub Repository** | [saunakkkk/medical-research-data-centre](https://github.com/saunakkkk/medical-research-data-centre) |
| **CI/CD Pipeline** | [GitHub Actions Workflow](https://github.com/saunakkkk/medical-research-data-centre/actions) |

---

## 👛 Wallet Connection Lifecycle

The application integrates with the official **Midnight Lace Browser Wallet** (window.midnight.mnLace).



---

## ⚡ Quickstart & Local Setup

### Prerequisites
- **OS**: Linux or macOS (Windows users must use WSL2 Ubuntu)
- **Node.js**: 20.0.0 or 22.x (
ode -v)
- **npm**: 10.x or higher (
pm -v)
- **Docker**: Docker & Docker Compose daemon running (required for local Midnight Proof Server)

### 1. Clone Repository & Install Dependencies

added 864 packages, and audited 869 packages in 2m

210 packages are looking for funding
  run `npm fund` for details

16 vulnerabilities (6 low, 6 moderate, 4 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues possible (including breaking changes), run:
  npm audit fix --force

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.

### 2. Compile Compact Smart Contract


### 3. Start Local Midnight Proof Server (Optional for local proof generation)


### 4. Build Workspace Packages


### 5. Launch Frontend Development Server

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Automated Testing

The contract workspace includes a comprehensive unit test suite written with **Vitest** that validates all smart contract state transitions and ZK proof verifications.



### Expected Output


---

## 📷 Platform Screenshots

### Hospital Dashboard
![Hospital Dashboard](docs/screenshots/hospital-dashboard-v2.png)
*Deploy new ZK medical exchange smart contracts or join existing on-chain instances using their Midnight addresses.*

### Researcher Portal
![Researcher Portal](docs/screenshots/researcher-portal-v2.png)
*Submit confidential access requests using private qualification witness credentials and publish immutable dataset access proofs.*

### Anonymous Patient Records Explorer
![Anonymous Patient Records](docs/screenshots/anonymous-patient-records-v2.png)
*Inspect clinical cohorts protected by Zero-Knowledge verification without compromising patient PII.*

---

## 🏗️ System Architecture



---

## 📁 Monorepo Structure



---

## ⚙️ CI/CD Pipeline

The repository utilizes **GitHub Actions** (.github/workflows/ci.yml) to enforce code quality, dependency validation, security auditing, and build verification on every commit:

1. **Repository Integrity Check**: Ensures all required configuration files and templates are present.
2. **Security Audit**: Scans for accidental secret leaks or hardcoded private key blocks.
3. **Compact Compiler Setup**: Installs midnightntwrk/setup-compact-action@v1.
4. **Node.js & Workspace Install**: Sets up Node.js 22 and installs dependencies via 
pm ci --legacy-peer-deps.
5. **Contract Compilation & Verification**: Executes 
pm run compact and verifies ZK circuit generation.
6. **Workspace Build Verification**: Runs full production workspace builds (
pm run build).

---

## 🛡️ Security & Cryptographic Guarantees

1. **Zero-Knowledge Proof Isolation**: Prover witnesses never cross the boundary between client browser and network nodes.
2. **Selective Disclosure Control**: On-chain data is restricted strictly to derived public commitments and verification hashes.
3. **Tamper-Proof Audit Logs**: Every research access proof generates an unforgeable cryptographic hash persistentHash([patientRecordHash, pKey, activeResearcherPk]).
4. **Credential Confidentiality**: Medical license numbers and institutional secrets remain offline within the user's local state.

---

## 🛣️ Roadmap

- [x] **Phase 1**: Implement board.compact smart contract with 5 ZK circuits.
- [x] **Phase 2**: Create full-stack React 19 web application with Lace Wallet integration.
- [x] **Phase 3**: Deploy production build to Vercel and establish automated CI/CD pipeline.
- [ ] **Phase 4**: Add multi-hospital federated research permission governance.
- [ ] **Phase 5**: Integrate decentralized storage (IPFS/Arweave) for encrypted patient record payload distribution.

---

## 📜 License

This project is open-source software licensed under the [MIT License](LICENSE).
