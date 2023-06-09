import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProductList from "./components/Product/ProductList";
import OrdersList from "./components/Orders/OrdersList";
import ProductForm from "./components/Product/ProductForm";
import OrderForm from "./components/Orders/OrderForm";

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route exact path="/products">
                        <ProductList />
                    </Route>
                    <Route exact path="/my-orders">
                        <OrdersList />
                    </Route>
                    <Route path="/add-product/:id?" exact>
                        <ProductForm />
                    </Route>
                    <Route path="/add-order/:id?" exact>
                        <OrderForm />
                    </Route>
                    {/* Other routes can be defined here */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;
