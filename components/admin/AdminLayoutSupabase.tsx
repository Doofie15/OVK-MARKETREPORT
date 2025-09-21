import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import AdminSidebar from './AdminSidebar';
import type { AdminSection } from './AdminSidebar';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider 
} from '@mui/material';
import { 
  AccountCircle, 
  Logout, 
  Menu as MenuIcon,
  ChevronLeft 
} from '@mui/icons-material';

interface AdminLayoutSupabaseProps {
  children: React.ReactNode;
  currentSection: AdminSection;
  onSignOut: () => void;
  user: User | null;
}

const AdminLayoutSupabase: React.FC<AdminLayoutSupabaseProps> = ({
  children,
  currentSection,
  onSignOut,
  user
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleClose();
    onSignOut();
  };

  const getSectionTitle = (section: AdminSection): string => {
    switch (section) {
      case 'dashboard': return 'Dashboard';
      case 'seasons': return 'Seasons Management';
      case 'auctions': return 'Auctions Management';
      case 'form': return 'Report Form';
      case 'capture': return 'Data Capture';
      default: return 'Admin Panel';
    }
  };

  const getSectionDescription = (section: AdminSection): string => {
    switch (section) {
      case 'dashboard': return 'Overview of your wool market data and recent activity';
      case 'seasons': return 'Manage wool market seasons and their configurations';
      case 'auctions': return 'View and manage auction reports and data';
      case 'form': return 'Create and edit auction reports using the form interface';
      case 'capture': return 'Capture auction data with the advanced data capture form';
      default: return 'Administrative interface for the wool market report system';
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar
        activeSection={currentSection}
        onSectionChange={() => {}} // Handled by routing now
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top App Bar */}
        <AppBar 
          position="static" 
          elevation={1}
          sx={{ 
            bgcolor: 'white', 
            color: 'text.primary',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="toggle sidebar"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              sx={{ mr: 2 }}
            >
              {sidebarCollapsed ? <MenuIcon /> : <ChevronLeft />}
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {getSectionTitle(currentSection)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getSectionDescription(currentSection)}
              </Typography>
            </Box>

            {/* User Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {user?.user_metadata?.name || user?.email || 'User'}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar 
                  sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                  src={user?.user_metadata?.avatar_url}
                >
                  {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="subtitle2">
                      {user?.user_metadata?.name || 'User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <Logout sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            overflow: 'auto',
            bgcolor: 'grey.50'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayoutSupabase;
