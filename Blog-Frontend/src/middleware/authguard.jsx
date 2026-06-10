import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import App from "../App";

const AppGuard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const tokenAuth = localStorage.getItem('TOKS');
        if (!tokenAuth) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const tokenAuth = localStorage.getItem('TOKS');
    if (tokenAuth) {
        return <Outlet />
    }
    return null || navigate('/login', { replace: true });
}

export default AppGuard;