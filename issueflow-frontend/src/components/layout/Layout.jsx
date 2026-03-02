import { Sidebar } from './Sidebar';
import { Header } from './Header';
import '../../styles/layout.css';

export const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="layout-main">
                <Header />
                <main className="layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
};
