import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton } from '@material-ui/core';
import { Add, Edit, Delete, Save, Cancel } from '@material-ui/icons';
import ProductForm from './ProductForm.jsx';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [confirmDeleteProductId, setConfirmDeleteProductId] = useState(null);
    const [showNewProductForm, setShowNewProductForm] = useState(false);

    useEffect(() => {
        axios
            .get('http://localhost:8082/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error retrieving products: ', error);
            });
    }, []);

    const handleEditProduct = (product) => {
        setEditingProductId(product.id);
    };

    const handleSaveProduct = (product) => {
        axios
            .put(`http://localhost:8082/api/products/${product.id}`, product)
            .then(response => {
                setProducts(products.map(p => p.id === product.id ? response.data : p));
                setEditingProductId(null);
            })
            .catch(error => {
                console.error('Error updating product: ', error);
            });
    };

    const handleCancelEdit = () => {
        setEditingProductId(null);
    };

    const handleDeleteProduct = () => {
        axios
            .delete(`http://localhost:8082/api/products/${confirmDeleteProductId}`)
            .then(() => {
                setProducts(products.filter(p => p.id !== confirmDeleteProductId));
                setConfirmDeleteProductId(null);
            })
            .catch(error => {
                console.error('Error deleting product: ', error);
            });
    };

    const handleConfirmDelete = () => {
        axios
            .delete(`http://localhost:8082/api/products/${confirmDeleteProductId}`)
            .then(() => {
                setProducts(products.filter(p => p.id !== confirmDeleteProductId));
                setConfirmDeleteProductId(null);
            })
            .catch(error => {
                console.error('Error deleting product: ', error);
            });
    };

    const handleCancelDelete = () => {
        setConfirmDeleteProductId(null);
    };

    const handleCreateProduct = (product) => {
        axios
            .post('http://localhost:8082/api/products', product)
            .then(response => {
                setProducts([...products, response.data]);
                setShowNewProductForm(false);
            })
            .catch(error => {
                console.error('Error creating product: ', error);
            });
    };

    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map(product => (
                        <TableRow key={product.id}>
                            {editingProductId === product.id ? (
                                <React.Fragment>
                                    <TableCell>
                                        <input type="text" value={product.name} onChange={e => setProducts(products.map(p => p.id === product.id ? { ...p, name: e.target.value } : p))} />
                                    </TableCell>
                                    <TableCell>
                                        <input type="number" value={product.unitPrice} onChange={e => setProducts(products.map(p => p.id === product.id ? { ...p, unitPrice: e.target.value } : p))} />
                                    </TableCell>
                                    <TableCell>
                                        <input type="number" value={product.stock} onChange={e => setProducts(products.map(p => p.id === product.id ? { ...p, stock: e.target.value } : p))} />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() =>handleSaveProduct(product)}><Save /></IconButton>
                                        <IconButton onClick={handleCancelEdit}><Cancel /></IconButton>
                                    </TableCell>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.unitPrice}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditProduct(product)}><Edit /></IconButton>
                                        <IconButton onClick={() => setConfirmDeleteProductId(product.id)}><Delete /></IconButton>
                                    </TableCell>
                                </React.Fragment>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {editingProductId === null && !showNewProductForm && (
                <IconButton onClick={() => setShowNewProductForm(true)}><Add /></IconButton>
            )}
            {showNewProductForm && (
                <ProductForm onCancel={() => setShowNewProductForm(false)} onSave={handleCreateProduct} />
            )}
            {confirmDeleteProductId !== null && (
                <div>
                    <p>Are you sure you want to delete this product?</p>
                    <IconButton onClick={handleDeleteProduct}><Delete /></IconButton>
                    <IconButton onClick={handleCancelDelete}><Cancel /></IconButton>
                </div>
            )}
        </div>
    );
}

export default ProductList;