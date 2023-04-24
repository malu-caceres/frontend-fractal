import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { createProduct } from '../api/products';

const ProductForm = ({ onProductCreated }) => {
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState(0);
    const [stock, setStock] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newProduct = { name, unitPrice, stock };
        const createdProduct = await createProduct(newProduct);
        onProductCreated(createdProduct);
        setName('');
        setUnitPrice(0);
        setStock(0);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <TextField
                label="Unit Price"
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
                required
            />
            <TextField
                label="Stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(parseFloat(e.target.value))}
                required
            />
            <Button type="submit" variant="contained" color="primary">
                Create
            </Button>
        </form>
    );
};

export default ProductForm;