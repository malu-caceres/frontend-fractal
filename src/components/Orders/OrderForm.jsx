import React, { useState, useEffect } from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    MenuItem,
    Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@material-ui/core';
import { createOrder, getOrderById, updateOrder } from '../../api/orders';
import {deleteProduct, getAllProducts} from "../../api/products";
import {deleteOrderDetail} from "../../api/orderDetails";
const OrderForm = ({ order: initialOrder }) => {

    const statusOptions = ['Pending', 'InProgress', 'Completed'];
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const history = useHistory();
    const { id } = useParams();
    const [order, setOrder] = useState(initialOrder || {
        orderNumber: '',
        finalPrice: '0',
        numberOfProducts: '0',
        status: 'Pending',
    });
    const isEdit = id !== undefined;
    const [currentDate, setCurrentDate] = useState('');
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchOrder = async () => {
            const order = await getOrderById(id);
            setOrder(order);
        };

        if (isEdit) {
            fetchOrder();
        }
    }, [id, isEdit]);

    useEffect(() => {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        setCurrentDate(date);
        setOrder((prevOrder) => ({
            ...prevOrder,
            orderDetails: []
        }));
    }, []);

    const handleDeleteButtonClick = (orderDetail) => {
        setSelectedOrderDetail(orderDetail);
        setModalOpen(true);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isEdit) {
            await updateOrder(id, order);
        } else {
            await createOrder(order);
        }

        history.push('/my-orders');
    };


    const handleCloseModal = () => {
        setSelectedOrderDetail(null);
        setModalOpen(false);
    };

    const handleOrderDetailDeleted = async (deletedOrderDetail) => {
        await deleteOrderDetail(deletedOrderDetail.id);
        const remainingOrderDetails = order.orderDetails.filter((p) => p.id !== deletedOrderDetail.id);
        setOrder((prevOrder) => ({
            ...prevOrder,
            numberOfProducts: remainingOrderDetails.length,
            orderDetails: remainingOrderDetails
        }));
        handleCloseModal();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box mt={2}>
                <h1>{isEdit ? 'Edit Order' : 'Add Order'}</h1>
                <TextField
                    label="Order Number"
                    name="orderNumber"
                    value={order.orderNumber}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Date"
                    name="date"
                    value={currentDate}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Status"
                    name="status"
                    select
                    value={order.status}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                    InputProps={{
                        readOnly: !isEdit,
                    }}
                >
                    {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </TextField>
                <TableContainer>
                    <h3> Order's Products</h3>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Unit Price</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Sub Total</TableCell>
                                <TableCell>Options</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.orderDetails&&order.orderDetails.map((orderDetail) => (
                                <TableRow key={orderDetail.id}>
                                    <TableCell>{orderDetail.product.id}</TableCell>
                                    <TableCell>{orderDetail.product.name}</TableCell>
                                    <TableCell>{orderDetail.product.unitPrice}</TableCell>
                                    <TableCell>{orderDetail.quantity}</TableCell>
                                    <TableCell>{orderDetail.product.unitPrice * orderDetail.quantity}</TableCell>
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
                                            onClick={() => handleDeleteButtonClick(orderDetail)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button type="submit" variant="contained">
                    Add Order Detail
                </Button>

                <TextField
                    label="Number of Products"
                    name="numberOfProducts"
                    type="number"
                    value={order.numberOfProducts}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Final Price"
                    name="finalPrice"
                    type="number"
                    value={order.finalPrice}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                    margin="normal"
                />


                <Button type="submit" variant="contained" color="primary">
                    {isEdit ? 'Save Changes' : 'Add Order'}
                </Button>
            </Box>

            <Dialog open={modalOpen} onClose={handleCloseModal}>
                <DialogTitle>{`Delete Order Detail ${selectedOrderDetail?.id}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the detail product "{selectedOrderDetail?.product.name}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleOrderDetailDeleted(selectedOrderDetail)} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </form>
    );
};

export default OrderForm;