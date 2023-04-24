import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import OrdersList from "./components/Orders/OrdersList";

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
                    {/* Other routes can be defined here */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;
