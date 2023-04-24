import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { getAllOrder, deleteOrder } from '../../api/orders';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const loadOrders = async () => {
        const allOrders = await getAllOrder();
        setOrders(allOrders);
    };

    const handleOrderDeleted = async (deletedOrder) => {
        await deleteOrder(deletedOrder.id);
        const remainingOrders = orders.filter((p) => p.id !== deletedOrder.id);
        setOrders(remainingOrders);
        handleCloseModal();
    };

    const handleDeleteButtonClick = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setModalOpen(false);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div>
            <Box mt={2}>
                <h1>My Orders</h1>
                <Button
                    component={Link}
                    to="/add-order"
                    variant="contained"
                    color="primary"
                >
                    Add New Order
                </Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Order Number</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Number of Products</TableCell>
                                <TableCell>Final Price</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Options</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.orderNumber}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.numberOfProducts}</TableCell>
                                    <TableCell>{order.finalPrice}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>
                                        <Button
                                            component={Link}
                                            to={`/add-order/${order.id}`}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteButtonClick(order)}
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
                <DialogTitle>{`Delete Order ${selectedOrder?.id}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the order "{selectedOrder?.orderNumber}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleOrderDeleted(selectedOrder)} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OrdersList;