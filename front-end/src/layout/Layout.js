import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
    return (
        <div className="container-fluid bg-dark text-light" style={{"height": "100vh"}}>
            <Menu />
            <Routes />
        </div>
    );
}

export default Layout;
