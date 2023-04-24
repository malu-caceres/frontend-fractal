import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { getAllProducts, deleteProduct } from '../../api/products';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const loadProducts = async () => {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
    };

    const handleProductDeleted = async (deletedProduct) => {
        await deleteProduct(deletedProduct.id);
        const remainingProducts = products.filter((p) => p.id !== deletedProduct.id);
        setProducts(remainingProducts);
        handleCloseModal();
    };

    const handleDeleteButtonClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setModalOpen(false);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div>
            <Box mt={2}>
                <h1>My Products</h1>
                <Button
                    component={Link}
                    to="/add-product"
                    variant="contained"
                    color="primary"
                >
                    Add New Product
                </Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Unit Price</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Options</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.unitPrice}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                        <Button
                                            component={Link}
                                            to={`/edit-product/${product.id}`}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteButtonClick(product)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Dialog open={modalOpen} onClose={handleCloseModal}>
                <DialogTitle>{`Delete Product ${selectedProduct?.id}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the product "{selectedProduct?.name}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleProductDeleted(selectedProduct)} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductList;