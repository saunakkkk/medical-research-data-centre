// Private Medical Research Data Exchange Interactive dApp Component

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Chip,
  Backdrop,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CopyIcon from '@mui/icons-material/ContentCopy';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/VerifiedUser';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyIcon from '@mui/icons-material/VpnKey';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StorageIcon from '@mui/icons-material/Storage';
import ScienceIcon from '@mui/icons-material/Science';

import { useDeployedBoardContext } from '../hooks/index.js';
import { type BoardDeployment } from '../contexts/index.js';
import { type Observable } from 'rxjs';
import { type DeployedBBoardAPI, type BBoardDerivedState, type ContractAddress } from '../../../api/src/index.js';
import { State } from '../../../contract/src/index.js';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';

interface BoardProps {
  boardDeployment$?: Observable<BoardDeployment>;
  activeTab?: string;
}

export const Board: React.FC<BoardProps> = ({ boardDeployment$, activeTab = 'dashboard' }) => {
  const boardApiProvider = useDeployedBoardContext();
  const [boardDeployment, setBoardDeployment] = useState<BoardDeployment>();
  const [deployedBoardAPI, setDeployedBoardAPI] = useState<DeployedBBoardAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [boardState, setBoardState] = useState<BBoardDerivedState>();
  const [isWorking, setIsWorking] = useState(!!boardDeployment$);

  // Form Inputs
  const [datasetTitle, setDatasetTitle] = useState('');
  const [joinAddressInput, setJoinAddressInput] = useState('');
  const [researcherPkInput, setResearcherPkInput] = useState('');
  const [patientHashInput, setPatientHashInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string>();

  const onCreateBoard = useCallback(() => boardApiProvider.resolve(), [boardApiProvider]);
  const onJoinBoard = useCallback(
    (address: ContractAddress) => boardApiProvider.resolve(address),
    [boardApiProvider],
  );

  const onRegisterDataset = useCallback(async () => {
    if (!datasetTitle.trim() || !deployedBoardAPI) return;
    try {
      setIsWorking(true);
      setErrorMessage(undefined);
      await deployedBoardAPI.registerDataset(datasetTitle.trim());
      setStatusMessage(`Dataset "${datasetTitle}" registered successfully on Midnight ledger.`);
      setDatasetTitle('');
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to register dataset');
    } finally {
      setIsWorking(false);
    }
  }, [deployedBoardAPI, datasetTitle]);

  const onRequestAccess = useCallback(async () => {
    if (!deployedBoardAPI) return;
    try {
      setIsWorking(true);
      setErrorMessage(undefined);
      const datasetId = new Uint8Array(32);
      datasetId.fill(1);
      await deployedBoardAPI.requestAccess(datasetId);
      setStatusMessage('Confidential research access request submitted with ZK medical credential proof.');
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to request access');
    } finally {
      setIsWorking(false);
    }
  }, [deployedBoardAPI]);

  const onGrantPermission = useCallback(async () => {
    if (!deployedBoardAPI) return;
    try {
      setIsWorking(true);
      setErrorMessage(undefined);
      const datasetId = new Uint8Array(32);
      datasetId.fill(1);
      const researcherPk = researcherPkInput.trim()
        ? Buffer.from(researcherPkInput.trim(), 'hex')
        : (boardState?.activeResearcherPk ?? new Uint8Array(32));
      await deployedBoardAPI.grantPermission(datasetId, researcherPk);
      setStatusMessage('Research access permission granted to researcher.');
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to grant permission');
    } finally {
      setIsWorking(false);
    }
  }, [deployedBoardAPI, researcherPkInput, boardState]);

  const onSubmitAccessProof = useCallback(async () => {
    if (!deployedBoardAPI) return;
    try {
      setIsWorking(true);
      setErrorMessage(undefined);
      const datasetId = new Uint8Array(32);
      datasetId.fill(1);
      const patientHash = patientHashInput.trim()
        ? Buffer.from(patientHashInput.trim(), 'hex')
        : new Uint8Array(32);
      await deployedBoardAPI.submitAccessProof(datasetId, patientHash);
      setStatusMessage('Dataset ZK access proof submitted. Audit log updated.');
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to submit access proof');
    } finally {
      setIsWorking(false);
    }
  }, [deployedBoardAPI, patientHashInput]);

  const onRevokeAccess = useCallback(async () => {
    if (!deployedBoardAPI) return;
    try {
      setIsWorking(true);
      setErrorMessage(undefined);
      const datasetId = new Uint8Array(32);
      datasetId.fill(1);
      await deployedBoardAPI.revokeAccess(datasetId);
      setStatusMessage('Research access permission revoked by hospital admin.');
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to revoke access');
    } finally {
      setIsWorking(false);
    }
  }, [deployedBoardAPI]);

  useEffect(() => {
    if (!boardDeployment$) return;
    const sub = boardDeployment$.subscribe(setBoardDeployment);
    return () => sub.unsubscribe();
  }, [boardDeployment$]);

  useEffect(() => {
    if (!boardDeployment) return;
    if (boardDeployment.status === 'in-progress') return;
    setIsWorking(false);
    if (boardDeployment.status === 'failed') {
      setErrorMessage(boardDeployment.error.message || 'Unexpected error connecting contract');
      return;
    }
    setDeployedBoardAPI(boardDeployment.api);
    const sub = boardDeployment.api.state$.subscribe(setBoardState);
    return () => sub.unsubscribe();
  }, [boardDeployment]);

  if (!boardDeployment$) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', background: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(0,229,255,0.2)' }}>
        <SecurityIcon sx={{ fontSize: 64, color: '#00E5FF', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#F9FAFB' }}>
          Initialize Medical Data Exchange Contract
        </Typography>
        <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 4, maxWidth: 500, mx: 'auto' }}>
          Deploy a new smart contract for secure patient dataset sharing or join an existing contract using its on-chain address.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', maxWidth: 600, mx: 'auto' }}>
          <Button
            variant="contained"
            size="large"
            onClick={onCreateBoard}
            startIcon={<AddCircleIcon />}
            sx={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #0284C7 100%)',
              color: '#090D16',
              fontWeight: 700,
              py: 1.5,
              px: 3,
            }}
          >
            Deploy New Contract
          </Button>

          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            <TextField
              size="small"
              placeholder="Enter Contract Address..."
              value={joinAddressInput}
              onChange={(e) => setJoinAddressInput(e.target.value)}
              fullWidth
              sx={{ input: { color: 'white' } }}
            />
            <Button
              variant="outlined"
              onClick={() => onJoinBoard(joinAddressInput.trim())}
              disabled={!joinAddressInput.trim()}
              sx={{ borderColor: '#00E5FF', color: '#00E5FF' }}
            >
              Join
            </Button>
          </Box>
        </Box>
      </Card>
    );
  }

  const accessStateLabel = boardState ? State[boardState.state] : 'LOADING';

  return (
    <Box sx={{ width: '100%' }}>
      {/* Working & Error Overlay */}
      <Backdrop open={isWorking} sx={{ color: '#00E5FF', zIndex: 999 }}>
        <CircularProgress color="inherit" />
        <Typography sx={{ ml: 2, fontWeight: 700, color: 'white' }}>Executing Midnight ZK Proof Circuit...</Typography>
      </Backdrop>

      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(undefined)} sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {statusMessage && (
        <Alert severity="success" onClose={() => setStatusMessage(undefined)} sx={{ mb: 3 }}>
          {statusMessage}
        </Alert>
      )}

      {/* Contract Banner */}
      <Paper sx={{ p: 2.5, mb: 3, background: 'rgba(17, 24, 39, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SecurityIcon sx={{ color: '#10B981' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
              Contract Address:
            </Typography>
            <Chip
              label={deployedBoardAPI?.deployedContractAddress ? `${deployedBoardAPI.deployedContractAddress.slice(0, 16)}...${deployedBoardAPI.deployedContractAddress.slice(-8)}` : 'Loading...'}
              size="small"
              sx={{ backgroundColor: 'rgba(0,229,255,0.1)', color: '#00E5FF', fontFamily: 'monospace' }}
            />
            <IconButton
              size="small"
              onClick={() => deployedBoardAPI?.deployedContractAddress && navigator.clipboard.writeText(deployedBoardAPI.deployedContractAddress)}
            >
              <CopyIcon fontSize="small" sx={{ color: '#9CA3AF' }} />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<LockIcon sx={{ fontSize: '14px !important', color: '#10B981' }} />}
              label={`Permission: ${accessStateLabel}`}
              color={boardState?.state === State.GRANTED ? 'success' : 'default'}
              size="small"
            />
            <Chip
              icon={<HistoryIcon sx={{ fontSize: '14px !important' }} />}
              label={`Audit Proofs: ${boardState?.auditLogCount?.toString() ?? '0'}`}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#F9FAFB' }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Main Tab Views */}
      {activeTab === 'dashboard' && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Register Dataset Panel */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#00E5FF', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddCircleIcon /> Hospital Dataset Registration
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
                Hospitals securely post anonymized medical research dataset titles to the Midnight public ledger.
              </Typography>

              <TextField
                fullWidth
                label="Dataset Title"
                placeholder="e.g. Oncology Genomic Sequencing Cohort 2026"
                value={datasetTitle}
                onChange={(e) => setDatasetTitle(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={onRegisterDataset}
                disabled={!datasetTitle.trim()}
                sx={{ background: 'linear-gradient(135deg, #00E5FF 0%, #0284C7 100%)', color: '#090D16', py: 1.2, fontWeight: 700 }}
              >
                Register Medical Dataset Circuit
              </Button>
            </Card>
          </Box>

          {/* Hospital Admin Actions */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#10B981', display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedIcon /> Hospital Access Control
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
                Grant or revoke research institution dataset permissions based on verified ZK qualification proofs.
              </Typography>

              <TextField
                fullWidth
                size="small"
                label="Active Researcher Public Key (Hex)"
                placeholder="Optional override hex..."
                value={researcherPkInput}
                onChange={(e) => setResearcherPkInput(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={onGrantPermission}
                  color="success"
                  disabled={boardState?.state !== State.REQUESTED}
                  startIcon={<CheckCircleIcon />}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  Grant Permission
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={onRevokeAccess}
                  color="error"
                  disabled={boardState?.state === State.NONE || boardState?.state === State.REVOKED}
                  startIcon={<CancelIcon />}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  Revoke Permission
                </Button>
              </Box>
            </Card>
          </Box>
        </Box>
      )}

      {activeTab === 'researcher' && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Researcher Confidential Access Request */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#67E8F9', display: 'flex', alignItems: 'center', gap: 1 }}>
                <KeyIcon /> Request Research Access (ZK Proof)
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
                Researchers prove eligibility secretly using private medical credential witnesses without disclosing identities or license numbers on-chain.
              </Typography>

              <Alert severity="info" sx={{ mb: 3, backgroundColor: 'rgba(0, 229, 255, 0.08)' }}>
                Private Witness: Local secret key & medical qualification credential verified via Zero-Knowledge circuit.
              </Alert>

              <Button
                variant="contained"
                fullWidth
                onClick={onRequestAccess}
                disabled={boardState?.state === State.REQUESTED || boardState?.state === State.GRANTED}
                sx={{ background: 'linear-gradient(135deg, #67E8F9 0%, #00E5FF 100%)', color: '#090D16', py: 1.2, fontWeight: 700 }}
              >
                Submit ZK Access Request
              </Button>
            </Card>
          </Box>

          {/* Submit Patient Dataset Access Proof */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#34D399', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScienceIcon /> Submit Dataset Access Proof
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2 }}>
                Generates and publishes an immutable ZK access proof using private patient record key.
              </Typography>

              <TextField
                fullWidth
                size="small"
                label="Anonymized Patient Record Hash (Hex)"
                placeholder="0x7a8f..."
                value={patientHashInput}
                onChange={(e) => setPatientHashInput(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                fullWidth
                color="secondary"
                onClick={onSubmitAccessProof}
                disabled={boardState?.state !== State.GRANTED}
                sx={{ py: 1.2, fontWeight: 700 }}
              >
                Generate & Submit Access Proof
              </Button>
            </Card>
          </Box>
        </Box>
      )}

      {activeTab === 'datasets' && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#00E5FF', display: 'flex', alignItems: 'center', gap: 1 }}>
            <StorageIcon /> Medical Research Dataset Registry
          </Typography>
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>Dataset Title</TableCell>
                  <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>Security Level</TableCell>
                  <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>Access Status</TableCell>
                  <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>Sample Size</TableCell>
                  <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>{boardState?.datasetTitle ?? 'Genomic Oncology Cohort 2026'}</TableCell>
                  <TableCell><Chip label="Level 3 ZK-Protected" size="small" color="primary" /></TableCell>
                  <TableCell><Chip label={accessStateLabel} size="small" color={boardState?.state === State.GRANTED ? 'success' : 'warning'} /></TableCell>
                  <TableCell>14,280 Patients</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={onRequestAccess} disabled={boardState?.state === State.GRANTED}>
                      Request Access
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Cardiology Biomarker Study B</TableCell>
                  <TableCell><Chip label="Level 3 ZK-Protected" size="small" color="primary" /></TableCell>
                  <TableCell><Chip label="GRANTED" size="small" color="success" /></TableCell>
                  <TableCell>8,500 Patients</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" color="success">View Cohort</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {activeTab === 'records' && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#10B981', display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon /> Anonymized Patient Record Explorer
          </Typography>
          <Alert severity="success" sx={{ mb: 3, backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
            All patient records are protected by zero-knowledge access proofs. Patient PII is never stored or exposed.
          </Alert>
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>Anonymized ID</TableCell>
                  <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>Clinical Cohort</TableCell>
                  <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>ZK Proof Hash</TableCell>
                  <TableCell sx={{ color: '#9CA3AF', fontWeight: 700 }}>Verification Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'monospace' }}>ANON-9041-X</TableCell>
                  <TableCell>Oncology Cohort A</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', color: '#00E5FF' }}>
                    {boardState?.lastProofHash ? toHex(boardState.lastProofHash).slice(0, 16) + '...' : '0x7a8f9b2e...'}
                  </TableCell>
                  <TableCell><Chip label="ZK-Verified" size="small" color="success" icon={<CheckCircleIcon />} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'monospace' }}>ANON-9042-Y</TableCell>
                  <TableCell>Oncology Cohort A</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', color: '#00E5FF' }}>0x3c9d1a4e...</TableCell>
                  <TableCell><Chip label="ZK-Verified" size="small" color="success" icon={<CheckCircleIcon />} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {activeTab === 'zk-proofs' && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#67E8F9', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon /> Selective Disclosure & ZK Privacy Model
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2.5, backgroundColor: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00E5FF', mb: 1 }}>
                  Public Ledger State (Disclosed)
                </Typography>
                <Typography variant="body2" component="div" sx={{ color: '#9CA3AF' }}>
                  <ul>
                    <li>Dataset Title: "{boardState?.datasetTitle ?? 'Genomic Study'}"</li>
                    <li>Permission Status: {accessStateLabel}</li>
                    <li>Total Audit Proof Count: {boardState?.auditLogCount?.toString() ?? '0'}</li>
                    <li>Active Researcher Public Key Hash</li>
                    <li>Latest Dataset Access Proof Hash</li>
                  </ul>
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2.5, backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#10B981', mb: 1 }}>
                  Private Witness State (Concealed)
                </Typography>
                <Typography variant="body2" component="div" sx={{ color: '#9CA3AF' }}>
                  <ul>
                    <li>Medical License Secret Key (Never Disclosed)</li>
                    <li>Patient PII & Raw Identity Records</li>
                    <li>Dataset Encryption Keys</li>
                    <li>Researcher Secret Key</li>
                  </ul>
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#10B981', display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon /> Immutable Audit Log & On-Chain Verifier
          </Typography>
          <Paper sx={{ p: 2, mb: 3, background: 'rgba(0,0,0,0.4)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#00E5FF', mb: 1 }}>
              Audit Log Count: {boardState?.auditLogCount?.toString() ?? '0'}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#10B981' }}>
              Last Access Proof Hash: {boardState?.lastProofHash ? toHex(boardState.lastProofHash) : 'Init'}
            </Typography>
          </Paper>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 800 }}>{boardState?.datasetCount?.toString() ?? '1'}</Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>Total Registered Datasets</Typography>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#10B981', fontWeight: 800 }}>{boardState?.auditLogCount?.toString() ?? '0'}</Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>ZK Access Proofs Verified</Typography>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#67E8F9', fontWeight: 800 }}>{boardState?.state === State.GRANTED ? '1' : '0'}</Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>Active Research Grants</Typography>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};
