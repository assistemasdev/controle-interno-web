import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmationModal = ({ open, onClose, onConfirm, userName }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Excluir Usuário</DialogTitle>
      <DialogContent>
        <p>Você tem certeza que deseja excluir o usuário <strong>{userName}</strong>?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
