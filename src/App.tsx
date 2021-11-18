import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Navbar from "./app/Navbar";
import {ScrollTop} from "./app/ScrollTop";
import {Footer} from "./app/Footer";
import Home from "./Home";
import {CategoriesList, AddCategoryForm, EditCategoryForm} from "./features/category";
import {ProductsList, AddProductForm, EditProductForm} from "./features/product";
import {PurchasesList, AddPurchaseForm, EditPurchaseForm} from "./features/purchase";
import {SalesList, AddSaleForm, EditSaleForm} from "./features/sale";
import {SuppliersList, AddSupplierForm, EditSupplierForm} from "./features/supplier";
import {TransfersList, AddTransferForm} from "./features/transfer";


function App() {
    return (
        <>
            <div className="min-vh-100">
                <Router>
                    <Navbar/>
                    <ScrollTop />
                    <Switch>
                        <Route exact path="/" component={Home} />

                        <Route exact path="/categories" component={CategoriesList} />
                        <Route exact path="/categories/create" component={AddCategoryForm} />
                        <Route exact path="/categories/:categoryId" component={EditCategoryForm} />

                        <Route exact path="/products" component={ProductsList} />
                        <Route exact path="/products/create" component={AddProductForm} />
                        <Route exact path="/products/:productId" component={EditProductForm} />

                        <Route exact path="/purchases" component={PurchasesList} />
                        <Route exact path="/purchases/create" component={AddPurchaseForm} />
                        <Route exact path="/purchases/:purchaseId" component={EditPurchaseForm} />

                        <Route exact path="/sales" component={SalesList} />
                        <Route exact path="/sales/create" component={AddSaleForm} />
                        <Route exact path="/sales/:saleId" component={EditSaleForm} />

                        <Route exact path="/suppliers" component={SuppliersList} />
                        <Route exact path="/suppliers/create" component={AddSupplierForm} />
                        <Route exact path="/suppliers/:supplierId" component={EditSupplierForm} />

                        <Route exact path="/transfers" component={TransfersList} />
                        <Route exact path="/transfers/create" component={AddTransferForm} />


                    </Switch>
                </Router>
            </div>
            <Footer/>
        </>
    );
}

export default App;
