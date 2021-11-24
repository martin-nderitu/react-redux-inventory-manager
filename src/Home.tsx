const Home = () => {
    return (
        <div className="container-fluid pt-3">
            <div className="card border-0 rounded-0 text-white bg-success">
                <div className="card-body">
                    <h2 className="card-title">React Redux Inventory Manager</h2>
                    <p className="card-text">Manage your inventory conveniently</p>
                </div>
            </div>

            <div className="card border-0 rounded-0 text-white bg-success">
                <div className="card-body">
                    <h3 className="card-title">Features</h3>
                </div>
            </div>

            <div className="card-group">
                <div className="card border-0 rounded-0 text-white bg-success">
                    <div className="card-body">
                        <h5 className="card-title">Manage products, categories & transfers</h5>
                        <p className="card-text">
                            Create, read, update and delete products, product categories and
                            product transfers
                        </p>
                    </div>
                </div>

                <div className="card border-0 rounded-0 text-white bg-success">
                    <div className="card-body">
                        <h5 className="card-title">Manage purchases & suppliers</h5>
                        <p className="card-text">
                            Create, read, update and delete purchases and suppliers
                        </p>
                        <p className="card-text">
                            Purchases module is used to add stock to the system
                        </p>
                    </div>
                </div>

                <div className="card border-0 rounded-0 text-white bg-success">
                    <div className="card-body">
                        <h5 className="card-title">Manage sales</h5>
                        <p className="card-text">
                            Create, read, update and delete product sales
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
