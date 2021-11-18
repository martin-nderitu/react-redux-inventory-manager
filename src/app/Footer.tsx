export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-2 py-3 bg-light">
            <div className="container-fluid">
                <span>Copyright &copy; {currentYear} React Redux Inventory Manager</span>
            </div>
        </footer>
    )
}