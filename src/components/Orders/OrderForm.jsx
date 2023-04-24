import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, TextField } from '@material-ui/core';
import { createOrder, getOrderById, updateOrder } from '../../api/orders';
import OrderDetailModal from './OrderDetailForm';
import {getAllProducts} from "../../api/products";
const OrderForm = ({ order: initialOrder }) => {
    const history = useHistory();
    const { id } = useParams();
    const [order, setOrder] = useState(initialOrder || {
        orderNumber: '',
    });
    const isEdit = id !== undefined;
    const [currentDate, setCurrentDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            date: date,
            finalPrice: 0,
            numberOfProducts: 0,
        }));
    }, []);

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

    const handleOpenModal = () => {
        setIsModalOpen(true);
        // Fetch the list of products when the modal is opened
        getAllProducts()
            .then((data) => setProducts(data))
            .catch((error) => console.log(error));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleProductAdded = (product) => {
        console.log(product);
        setIsModalOpen(false);
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
                    label="Final Price"
                    name="finalPrice"
                    type="number"
                    value={order.finalPrice}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    {isEdit ? 'Save Changes' : 'Add Order'}
                </Button>
            </Box>

        </form>
    );
};

export default OrderForm;