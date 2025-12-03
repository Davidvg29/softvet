import Dashboard from "../components/Dashboard/Dashboard";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import HeaderApp from "../components/HeaderApp";
const DashboardPage = () => {
    return ( 
        <div className="d-flex flex-column min-vh-100">
            <HeaderApp/>
            <main className="flex-grow-1">
                <Dashboard/>
            </main>
            <Footer/>
        </div>
     );
}
 
export default DashboardPage;