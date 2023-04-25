import React, { useState, useEffect } from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel,
    MenuItem, Select,
    Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@material-ui/core';
import { createOrder, getOrderById, updateOrder } from '../../api/orders';
import {deleteOrderDetail, updateOrderDetail, createOrderDetail} from "../../api/orderDetails";
import {getAllProducts} from "../../api/products";
const OrderForm = ({ order: initialOrder }) => {
    // GENERAL
    const [order, setOrder] = useState(initialOrder || {
        orderNumber: '',
        finalPrice: '0',
        numberOfProducts: '0',
        status: 'Pending',
    });
    const isEdit = id !== undefined;
    const statusOptions = ['Pending', 'InProgress', 'Completed'];
    const [currentDate, setCurrentDate] = useState('');
    const history = useHistory();
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');

    //MODALS
    const [modalDeleteOrderDetailOpen, setModalDeleteOrderDetailOpen] = useState(false);
    const [modalUpdateOrderDetailOpen, setModalUpdateOrderDetailOpen] = useState(false);
    const [modalAddOrderDetailOpen, setModalAddOrderDetailOpen] = useState(false);

    // ADD ORDER DETAILS
    const [newOrderDetails, setNewOrderDetails] = useState([]);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
    const [selectedProductQuantity, setSelectedProductQuantity] = useState('');

    // FUNCTIONS
    useEffect(() => {
        const fetchProducts = async () => {
            const productList = await getAllProducts();
            setProducts(productList);
        };
        fetchProducts();
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

    // HANDLE BUTTONS
    const handleDeleteOrderDetailButtonClick = (orderDetail) => {
        setSelectedOrderDetail(orderDetail);
        setModalDeleteOrderDetailOpen(true);
    };

    const handleAddOrderDetailButtonClick = () => {
        setModalAddOrderDetailOpen(true);
    };

    const handleUpdateOrderDetailButtonClick = (orderDetail) => {
        setSelectedOrderDetail(orderDetail);
        setModalUpdateOrderDetailOpen(true);
    };

    // HANDLE INPUTS
    // GENERAL
    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
    };
    const handleProductQuantityChange = (event) => {
        setSelectedProductQuantity(event.target.value);
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value,
        }));
    };
    const handleCloseModal = () => {
        setModalDeleteOrderDetailOpen(false);
        setModalUpdateOrderDetailOpen(false);
        setModalAddOrderDetailOpen(false);
    };


    // ORDER DETAILS ACTIONS
    const handleOrderDetailInputChange = (event) => {
        if (modalUpdateOrderDetailOpen){
            setSelectedOrderDetail((prevOrderDetail) => ({
                ...prevOrderDetail,
                orderId: order.id,
                productId: selectedOrderDetail.product.id,
                quantity: parseInt(event.target.value),
            }));
        }
        if (modalAddOrderDetailOpen){
            setSelectedOrderDetail((prevOrderDetail) => ({
                ...prevOrderDetail,
                orderId: order.id,
                productId: selectedProduct,
                quantity: parseInt(event.target.value),
            }));
        }
    };

    const handleOrderDetailCreated = async () => {
        if (isEdit){
            let newOrderDetail = {
                orderId: order.id,
                productId: selectedProduct.id,
                quantity: parseInt(selectedProductQuantity)
            }
            newOrderDetail = await createOrderDetail(newOrderDetail);
            order.orderDetails.push(newOrderDetail)
            // UPDATE MAIN ORDER INFO
            let newFinalPrice = 0
            order.orderDetails.map((orderDetail) => (
                newFinalPrice += orderDetail.product.unitPrice * orderDetail.quantity
            ))
            setOrder((prevOrder) => ({
                ...prevOrder,
                numberOfProducts: order.orderDetails.length,
                finalPrice: newFinalPrice
            }));
            handleCloseModal();
        }
        let newOrderDetail = {
            productId: selectedProduct.id,
            product: selectedProduct,
            quantity: parseInt(selectedProductQuantity)
        }
        newOrderDetails.push(newOrderDetail)
        // UPDATE MAIN ORDER INFO
        let newFinalPrice = 0
        newOrderDetails.map((orderDetail) => (
            newFinalPrice += orderDetail.product.unitPrice * orderDetail.quantity
        ))
        setOrder((prevOrder) => ({
            ...prevOrder,
            numberOfProducts: newOrderDetails.length,
            finalPrice: newFinalPrice,
            orderDetails: newOrderDetails
        }));
        handleCloseModal();
    };
    const handleOrderDetailUpdated = async (updatedOrderDetail) => {
        updatedOrderDetail.orderId = order.id
        updatedOrderDetail.productId = updatedOrderDetail.product.id
        await updateOrderDetail(updatedOrderDetail.id, updatedOrderDetail);

        const changedObject = order.orderDetails.find(o => o.id === selectedOrderDetail.id)
        const changedIndex = order.orderDetails.indexOf(changedObject)

        order.orderDetails[changedIndex]=updatedOrderDetail

        let newFinalPrice = 0
        order.orderDetails.map((orderDetail) => (
            newFinalPrice += orderDetail.product.unitPrice * orderDetail.quantity
        ))
        setOrder((prevOrder) => ({
            ...prevOrder,
            numberOfProducts: order.orderDetails.length,
            finalPrice: newFinalPrice
        }));

        handleCloseModal();
    };

    const handleOrderDetailDeleted = async (deletedOrderDetail) => {
        await deleteOrderDetail(deletedOrderDetail.id);
        const remainingOrderDetails = order.orderDetails.filter((p) => p.id !== deletedOrderDetail.id);
        let newFinalPrice = 0
        remainingOrderDetails.map((orderDetail) => (
            newFinalPrice += orderDetail.product.unitPrice * orderDetail.quantity
        ))
        setOrder((prevOrder) => ({
            ...prevOrder,
            numberOfProducts: remainingOrderDetails.length,
            orderDetails: remainingOrderDetails,
            finalPrice: newFinalPrice
        }));
        handleCloseModal();
    };

    return (
        <form onSubmit={handleSubmit}>
            {/*MAIN BOX*/}
            <Box mt={2}>
                <h1>{isEdit ? 'Edit Order' : 'Add Order'}</h1>
                {/*ORDER FIELDS*/}
                <TextField
                    label="Order Number"
                    name="orderNumber"
                    value={order.orderNumber}
                    onChange={handleInputChange}
                    InputProps={{
                        readOnly: order.status === "Completed"
                    }}
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
                        readOnly: order.status === "Completed" || !isEdit,
                    }}
                >
                    {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </TextField>
                <TableContainer>
                    {/*ORDER DETAIL INFO*/}
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
                            {order.orderDetails && order.orderDetails.map((orderDetail) => (
                                <TableRow key={orderDetail.id}>
                                    <TableCell>{orderDetail.product.id}</TableCell>
                                    <TableCell>{orderDetail.product.name}</TableCell>
                                    <TableCell>{orderDetail.product.unitPrice}</TableCell>
                                    <TableCell>{orderDetail.quantity}</TableCell>
                                    <TableCell>{orderDetail.product.unitPrice * orderDetail.quantity}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUpdateOrderDetailButtonClick(orderDetail)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteOrderDetailButtonClick(orderDetail)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button
                            variant="contained"
                            onClick={() => handleAddOrderDetailButtonClick()}
                    >
                        Add Order Detail
                    </Button>
                </TableContainer>

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

            {/*MODALS*/}
            {/*ADD ORDER DETAIL MODAL*/}
            <Dialog open={modalAddOrderDetailOpen && order.status !== "Completed"} onClose={handleCloseModal}>
                <DialogTitle>{`Add Order Detail`}</DialogTitle>
                <DialogContent>
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
                            <MenuItem key={product.id} value={product}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Quantity"
                        name="numberOfProducts"
                        type="number"
                        value={selectedProductQuantity}
                        onChange={handleProductQuantityChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleOrderDetailCreated()} color="secondary" autoFocus>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/*UPDATE ORDER DETAIL MODAL*/}
            <Dialog open={modalUpdateOrderDetailOpen && order.status !== "Completed"} onClose={handleCloseModal}>
                <DialogTitle>{`Update Order Detail ${selectedOrderDetail?.id}`}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={selectedOrderDetail?.product.name}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Quantity"
                        name="numberOfProducts"
                        type="number"
                        value={selectedOrderDetail?.quantity}
                        onChange={handleOrderDetailInputChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleOrderDetailUpdated(selectedOrderDetail)} color="secondary" autoFocus>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>


            {/*DELETE ORDER DETAIL MODAL*/}
            <Dialog open={modalDeleteOrderDetailOpen && order.status !== "Completed"} onClose={handleCloseModal}>
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