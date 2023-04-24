import React, { useState, useEffect } from 'react';
import {getAllProducts} from "../../api/products";
import { TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@material-ui/core';

const OrderDetailForm = ({ onAddOrderDetail }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const productList = await getAllProducts();
            setProducts(productList);
        };
        fetchProducts();
    }, []);

    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const product = products.find((p) => p.id === selectedProduct);
        const orderDetail = {
            product,
            quantity: Number(quantity),
        };
        onAddOrderDetail(orderDetail);
        setSelectedProduct('');
        setQuantity('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
                <InputLabel id="product-label">Product</InputLabel>
                <Select
                    labelId="product-label"
                    id="product-select"
                    value={selectedProduct}
                    onChange={handleProductChange}
                >
                    <MenuItem value="">
                        <em>Select a product</em>
                    </MenuItem>
                    {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                            {product.name} - {product.price}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" type="submit">
                Add Order Detail
            </Button>
        </form>
    );
};

export default OrderDetailForm;
