import style from './Sidebar.module.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { canAccessSettings, canManageRemoteAccess, canManageUsers, getCurrentUserRole } from '../../utils/permissions';
import { logout } from '../../services/authService';

const SIDEBAR_ACTIVE_PATH_KEY = 'licitSysSidebarActivePath';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentRole = getCurrentUserRole();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const navItems = [
        {
            to: '/dashboard',
            title: 'Dashboard',
            icon: 'bi bi-pie-chart-fill',
            isActive: location.pathname === '/dashboard',
            canShow: true,
        },
        {
            to: '/procurements',
            title: 'Licitações',
            icon: 'bi bi-layout-text-window-reverse',
            isActive: location.pathname.startsWith('/procurements'),
            canShow: true,
        },
        {
            to: '/remote-access',
            title: 'Acesso remoto',
            icon: 'bi bi-link-45deg',
            isActive: location.pathname === '/remote-access',
            canShow: canManageRemoteAccess(currentRole),
        },
        {
            to: '/users',
            title: 'Usuários',
            icon: 'bi bi-people-fill',
            isActive: location.pathname === '/users',
            canShow: canManageUsers(currentRole),
        },
        {
            to: '/settings',
            title: 'Configurações',
            icon: 'bi bi-gear-fill',
            isActive: location.pathname === '/settings',
            canShow: canAccessSettings(currentRole),
        },
    ].filter((item) => item.canShow);

    const activeIndex = navItems.findIndex((item) => item.isActive);
    const activePath = navItems[activeIndex]?.to;
    const [indicatorIndex, setIndicatorIndex] = useState(() => {
        const previousPath = sessionStorage.getItem(SIDEBAR_ACTIVE_PATH_KEY);
        const previousIndex = navItems.findIndex((item) => item.to === previousPath);

        return previousIndex >= 0 ? previousIndex : activeIndex;
    });

    useEffect(() => {
        if (activeIndex < 0) {
            return;
        }

        const animationFrame = requestAnimationFrame(() => {
            setIndicatorIndex(activeIndex);
            sessionStorage.setItem(SIDEBAR_ACTIVE_PATH_KEY, activePath);
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [activeIndex, activePath]);

    return (
        <div className={style.sidebar}>
            <div
                className={style.icon}
                style={{ '--active-index': indicatorIndex }}
            >
                {activeIndex >= 0 && (
                    <span className={style.activeIndicator}></span>
                )}

                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={style.iconItem}
                        title={item.title}
                    >
                        <i className={item.icon}></i>
                    </NavLink>
                ))}

                <button
                    type="button"
                    className={style.iconExit}
                    title="Sair"
                    aria-label="Sair do sistema"
                    onClick={handleLogout}
                >
                    <div className={style.exitIndicator}></div>
                    <i className="bi bi-box-arrow-right"></i>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
