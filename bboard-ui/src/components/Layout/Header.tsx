// Private Medical Research Data Exchange Header

import React, { useState } from 'react';
import { AppBar, Box, Typography, Button, Chip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab = 'dashboard', onTabChange }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const networkEnv = (import.meta.env.VITE_NETWORK || 'undeployed').toUpperCase();

  const handleWalletToggle = () => {
    if (walletConnected) {
      setWalletConnected(false);
      setWalletAddress(null);
    } else {
      setWalletConnected(true);
      setWalletAddress('mn_addr_preprod1q9x...f8a2');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Hospital Dashboard' },
    { id: 'researcher', label: 'Researcher Portal' },
    { id: 'datasets', label: 'Dataset Registry' },
    { id: 'records', label: 'Anonymous Patient Records' },
    { id: 'zk-proofs', label: 'Selective Disclosure' },
    { id: 'audit', label: 'Audit Log & Verification' },
    { id: 'analytics', label: 'Research Analytics' },
  ];

  return (
    <AppBar
      position="sticky"
      data-testid="header"
      sx={{
        backgroundColor: 'rgba(9, 13, 22, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        px: { xs: 2, md: 4 },
        py: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        {/* Logo & Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }} data-testid="header-logo">
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00E5FF 0%, #10B981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)',
            }}
          >
            <ShieldIcon sx={{ color: '#090D16', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #FFFFFF, #00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              Private Medical Research Data Exchange
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LockIcon sx={{ fontSize: 12, color: '#10B981' }} /> Midnight ZK Confidential Credentials & Access Proofs
            </Typography>
          </Box>
        </Box>

        {/* Network & Wallet Controls */}
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, alignItems: 'center' }}>
          <Chip
            label={`Network: ${networkEnv}`}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
              color: '#00E5FF',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              fontWeight: 600,
            }}
          />
          {walletConnected ? (
            <Button
              variant="outlined"
              size="small"
              onClick={handleWalletToggle}
              startIcon={<CheckCircleIcon sx={{ color: '#10B981' }} />}
              sx={{
                borderColor: '#10B981',
                color: '#10B981',
                '&:hover': { borderColor: '#059669', backgroundColor: 'rgba(16, 185, 129, 0.1)' },
              }}
            >
              Lace Wallet Connected ({walletAddress})
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={handleWalletToggle}
              startIcon={<AccountBalanceWalletIcon />}
              sx={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #0284C7 100%)',
                color: '#090D16',
                fontWeight: 700,
                '&:hover': { background: 'linear-gradient(135deg, #67E8F9 0%, #00E5FF 100%)' },
              }}
            >
              Connect Lace Wallet
            </Button>
          )}
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 0.5 }}>
        {navItems.map((item) => (
          <Button
            key={item.id}
            size="small"
            onClick={() => onTabChange?.(item.id)}
            sx={{
              color: activeTab === item.id ? '#00E5FF' : '#9CA3AF',
              borderBottom: activeTab === item.id ? '2px solid #00E5FF' : '2px solid transparent',
              borderRadius: 0,
              px: 2,
              py: 0.8,
              fontSize: '0.85rem',
              fontWeight: activeTab === item.id ? 700 : 500,
              whiteSpace: 'nowrap',
              '&:hover': { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.03)' },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </AppBar>
  );
};
