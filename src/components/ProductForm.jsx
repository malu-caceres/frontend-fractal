import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, TextField } from '@material-ui/core';
import { createProduct } from '../api/products';

const ProductForm = () => {
    const history = useHistory();
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [stock, setStock] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleUnitPriceChange = (event) => {
        setUnitPrice(event.target.value);
    };

    const handleStockChange = (event) => {
        setStock(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newProduct = { name, unitPrice: Number(unitPrice), stock: Number(stock) };
        await createProduct(newProduct);
        history.push('/products');
    };

    return (
        <div>
            <Box mt={2}>
                <h1>Add Product</h1>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        fullWidth
                        value={name}
                        onChange={handleNameChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Unit Price"
                        fullWidth
                        value={unitPrice}
                        onChange={handleUnitPriceChange}
                        margin="normal"
                        type="number"
                        required
                    />
                    <TextField
                        label="Stock"
                        fullWidth
                        value={stock}
                        onChange={handleStockChange}
                        margin="normal"
                        type="number"
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Add
                    </Button>
                </form>
            </Box>
        </div>
    );
};

export default ProductForm;