import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProductList from "./components/Product/ProductList";
import OrdersList from "./components/Orders/OrdersList";
import ProductForm from "./components/ProductForm";

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
                    <Route path="/add-product" component={ProductForm} />
                    {/* Other routes can be defined here */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;
