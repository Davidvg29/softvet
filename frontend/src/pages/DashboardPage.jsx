import Dashboard from "../components/Dashboard/Dashboard";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";

const DashboardPage = () => {
    return ( 
        <div className="d-flex flex-column min-vh-100">
            <Header/>
            <main className="flex-grow-1">
                <Dashboard/>
            </main>
            <Footer/>
        </div>
     );
}
 
export default DashboardPage;