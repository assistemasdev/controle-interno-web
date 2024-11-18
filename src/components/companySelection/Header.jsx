import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Drawer } from '@mui/material';
import { WhatsApp, AccountCircle, ExitToApp, Menu } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { logout } = useAuth();  
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();  
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
        SISTEMA DE CONTROLE INTERNO
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconButton color="inherit" sx={{ display: 'block' }}>
          <WhatsApp />
        </IconButton>
        <Typography variant="body1" sx={{ color: 'black', marginBottom: 2 }}>
          (88) 99309-8272
        </Typography>
        <Typography variant="body1" sx={{ color: 'black', marginBottom: 2 }}>
          IMNA
        </Typography>
        <IconButton color="inherit" sx={{ display: 'block' }}>
          <AccountCircle />
        </IconButton>
        <IconButton color="inherit" sx={{ display: 'block' }} onClick={handleLogout}>
          <ExitToApp />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#4A90E2' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SISTEMA DE CONTROLE INTERNO
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            <IconButton color="inherit">
              <WhatsApp />
            </IconButton>
            <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
              (88) 99309-8272
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
              IMNA
            </Typography>
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToApp />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
