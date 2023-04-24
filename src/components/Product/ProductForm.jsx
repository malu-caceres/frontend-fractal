import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, TextField } from '@material-ui/core';
import { createProduct, getProductById, updateProduct } from '../../api/products';

const ProductForm = ({ product: initialProduct }) => {
    const history = useHistory();
    const { id } = useParams();
    const [product, setProduct] = useState(initialProduct || {
        name: '',
        unitPrice: '',
        stock: '',
    });
    const isEdit = id !== undefined;

    useEffect(() => {
        const fetchProduct = async () => {
            const product = await getProductById(id);
            setProduct(product);
        };

        if (isEdit) {
            fetchProduct();
        }
    }, [id, isEdit]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isEdit) {
            await updateProduct(id, product);
        } else {
            await createProduct(product);
        }

        history.push('/products');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box mt={2}>
                <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
                <TextField
                    label="Name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Unit Price"
                    name="unitPrice"
                    type="number"
                    value={product.unitPrice}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={product.stock}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    {isEdit ? 'Save Changes' : 'Add Product'}
                </Button>
            </Box>
        </form>
    );
};

export default ProductForm;