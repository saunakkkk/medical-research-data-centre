// Private Medical Research Data Exchange Premium Header & Navigation

import React from 'react';
import { AppBar, Box, Typography, Button, Chip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import StorageIcon from '@mui/icons-material/Storage';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab = 'dashboard', onTabChange }) => {


  const navItems = [
    { id: 'dashboard', label: 'Hospital Dashboard', icon: <LocalHospitalIcon fontSize="small" /> },
    { id: 'researcher', label: 'Researcher Portal', icon: <SchoolIcon fontSize="small" /> },
    { id: 'datasets', label: 'Dataset Registry', icon: <StorageIcon fontSize="small" /> },
    { id: 'records', label: 'Anonymous Patient Records', icon: <VisibilityOffIcon fontSize="small" /> },
    { id: 'zk-proofs', label: 'Selective Disclosure', icon: <VpnKeyIcon fontSize="small" /> },
    { id: 'audit', label: 'Audit Log & Verification', icon: <HistoryIcon fontSize="small" /> },
    { id: 'analytics', label: 'Research Analytics', icon: <AssessmentIcon fontSize="small" /> },
  ];

  return (
    <AppBar
      position="sticky"
      data-testid="header"
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        px: { xs: 2, md: 4 },
        py: 1.5,
      }}
    >
      {/* Top Header Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        {/* Logo & Application Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }} data-testid="header-logo">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: '#FFF7ED',
              border: '1px solid #FFEDD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(249, 115, 22, 0.15)',
            }}
          >
            <ShieldIcon sx={{ color: '#F97316', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: '#EA580C', letterSpacing: '-0.02em', fontSize: '1.25rem' }}
            >
              Private Medical Research Data Exchange
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}
            >
              <LockIcon sx={{ fontSize: 13, color: '#10B981' }} /> Midnight ZK Confidential Credentials & Dataset Access
              Proofs
            </Typography>
          </Box>
        </Box>

        {/* Network & Wallet Controls */}
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, alignItems: 'center' }}>
          <Chip
            label="Midnight Demo"
            size="small"
            icon={<ShieldIcon sx={{ fontSize: '14px !important', color: '#6366F1 !important' }} />}
            sx={{
              backgroundColor: '#EEF2FF',
              color: '#4F46E5',
              border: '1px solid #C7D2FE',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
          <Button
            variant="outlined"
            size="small"
            disabled
            startIcon={<AccountBalanceWalletIcon />}
            sx={{
              borderColor: '#D1D5DB',
              color: '#9CA3AF',
              backgroundColor: '#F9FAFB',
              fontWeight: 600,
              py: 0.8,
              px: 2,
              cursor: 'not-allowed',
              '&.Mui-disabled': {
                borderColor: '#D1D5DB',
                color: '#9CA3AF',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            Midnight Wallet (Demo Build)
          </Button>
        </Box>
      </Box>

      {/* Modern Premium Navigation Bar */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 2,
          overflowX: 'auto',
          py: 0.5,
          px: 0.5,
          backgroundColor: '#FAFAFA',
          borderRadius: 3,
          border: '1px solid #E5E7EB',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              size="small"
              onClick={() => onTabChange?.(item.id)}
              startIcon={React.cloneElement(item.icon, {
                sx: { color: isActive ? '#F97316' : '#6B7280', transition: 'color 0.2s' },
              })}
              sx={{
                color: isActive ? '#EA580C' : '#4B5563',
                backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                borderRadius: 2,
                px: 2,
                py: 0.9,
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                border: isActive ? '1px solid #FFEDD5' : '1px solid transparent',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: '#EA580C',
                  backgroundColor: isActive ? '#FFFFFF' : '#FFF7ED',
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>
    </AppBar>
  );
};
