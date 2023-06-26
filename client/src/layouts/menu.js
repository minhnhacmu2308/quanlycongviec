import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';

const Menu = () => {
  const history = useHistory();

  // useEffect(() => {
  //   // Kiểm tra xem đã có token trong localStorage hay chưa
  //   const token = localStorage.getItem('token');
  //   if (token != null)
  //   {
  //     const decoded = jwt.decode(token);
  //     console.log('decoded', decoded)
  //   }

  // }, []);
  return (
    <aside className="left-sidebar">
      {/* Sidebar scroll*/}
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <a href="./" className="text-nowrap logo-img">
            <img
              src="../assets/images/logos/dark-logo.svg"
              width={180}
              alt=""
            />
          </a>
          <div
            className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
            id="sidebarCollapse"
          >
            <i className="ti ti-x fs-8" />
          </div>
        </div>
        {/* Sidebar navigation*/}
        <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
          <ul id="sidebarnav">
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-4" />
              <span className="hide-menu">Home</span>
            </li>
            <li className="sidebar-item">
              <Link
                className="sidebar-link"
                to={"/"}
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-layout-dashboard" />
                </span>
                <span className="hide-menu">My Task</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link
                className="sidebar-link"
                to={"/management-user"}
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-layout-dashboard" />
                </span>
                <span className="hide-menu">Management User</span>
              </Link>
            </li>
          </ul>

        </nav>
        {/* End Sidebar navigation */}
      </div>
      {/* End Sidebar scroll*/}
    </aside>
  );
};

export default Menu;
