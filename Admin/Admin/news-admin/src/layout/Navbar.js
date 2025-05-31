import React from 'react';

// ===========================
// প্রজেক্টে index.html বা public/index.html এর <head> সেকশনে যুক্ত করো:
// 
// ===========================

const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <div className="container-fluid">
            <a
                className="navbar-brand d-flex align-items-center"
                href="#"
                style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: '1.8rem',
                    letterSpacing: '1.5px',
                    userSelect: 'none',
                }}
            >
                {/* ছোট লাল ডট */}
                <span
                    style={{
                        width: '14px',
                        height: '14px',
                        backgroundColor: '#d9534f', // Bootstrap danger red
                        borderRadius: '50%',
                        display: 'inline-block',
                        marginRight: '8px',
                    }}
                ></span>
                {/* সবুজ আর লাল রঙের টেক্সট */}
                <span style={{ color: '#28a745' /* সবুজ অংশ */ }}>চট্টলার</span>
                <span style={{ color: '#d9534f', marginLeft: '6px' /* লাল অংশ */ }}>সংলাপ</span>
            </a>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">
                            Home
                        </a>
                    </li>
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            id="userDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-person-circle me-1"></i>Admin
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li>
                                <a className="dropdown-item" href="#">
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Settings
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a className="dropdown-item text-danger" href="#">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);

export default Navbar;
