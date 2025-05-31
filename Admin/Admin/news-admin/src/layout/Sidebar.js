import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => (
    <div
        className="d-flex flex-column bg-dark text-white vh-100 p-3"
        style={{ width: '240px', minWidth: '240px' }}
    >
        <h3 className="mb-4 text-center text-primary fw-bold">
            <i className="bi bi-speedometer2 me-2"></i> Admin Panel
        </h3>

        <nav className="nav nav-pills flex-column">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    'nav-link text-white d-flex align-items-center mb-2 rounded ' +
                    (isActive ? 'bg-primary' : 'text-white-50')
                }
                end
            >
                <i className="bi bi-newspaper me-2 fs-5"></i> News
            </NavLink>

            <NavLink
                to="/categories"
                className={({ isActive }) =>
                    'nav-link text-white d-flex align-items-center mb-2 rounded ' +
                    (isActive ? 'bg-primary' : 'text-white-50')
                }
            >
                <i className="bi bi-tags-fill me-2 fs-5"></i> Categories
            </NavLink>

           
        </nav>
    </div>
);

export default Sidebar;
