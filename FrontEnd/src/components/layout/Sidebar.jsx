import style from './Sidebar.module.css';
import { NavLink, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();

    const isProcurementsRoute = location.pathname.startsWith('/procurements');
    const isSettingsRoute = location.pathname === '/settings';

    return (
        <div className={style.sidebar}>
            <div className={style.icon}>
                <NavLink to="/dashboard" className={style.iconItem}>
                    <i className="bi bi-pie-chart-fill"></i>
                    {location.pathname === '/dashboard' && (
                        <span className={style.activeIndicator}></span>
                    )}
                </NavLink>

                <NavLink to="/procurements" className={style.iconItem}>
                    <i className="bi bi-layout-text-window-reverse"></i>
                    {isProcurementsRoute && (
                        <span className={style.activeIndicator}></span>
                    )}
                </NavLink>

                <NavLink to="/remote-access" className={style.iconItem}>
                    <i className="bi bi-people-fill"></i>
                    {location.pathname === '/remote-access' && (
                        <span className={style.activeIndicator}></span>
                    )}
                </NavLink>

                <NavLink to="/settings" className={style.iconItem}>
                    <i className="bi bi-gear-fill"></i>
                    {isSettingsRoute && (
                        <span className={style.activeIndicator}></span>
                    )}
                </NavLink>

                <div className={style.iconExit}>
                    <div className={style.exitIndicator}></div>
                    <i className="bi bi-box-arrow-right"></i>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
