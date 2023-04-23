import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@material-ui/core';

function ProductForm({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [error, setError] = useState(null);

  const handleCreateProduct = () => {
    const newProduct = {
      name,
      unitPrice,
      stock,
    };

    axios
        .post('http://localhost:8082/api/products', newProduct)
        .then(response => {
          onSuccess(response.data);
          onClose();
        })
        .catch(error => {
          console.error('Error creating product: ', error);
          setError('Error creating product');
        });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
      <Dialog open={true} onClose={handleCancel}>
        <DialogTitle>Create New Product</DialogTitle>
        <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={name}
              onChange={e => setName(e.target.value)}
          />
          <TextField
              margin="dense"
              label="Unit Price"
              type="number"
              fullWidth
              value={unitPrice}
              onChange={e => setUnitPrice(Number(e.target.value))}
          />
          <TextField
              margin="dense"
              label="Stock"
              type="number"
              fullWidth
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
          />
          {error && <p>{error}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateProduct} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default ProductForm;