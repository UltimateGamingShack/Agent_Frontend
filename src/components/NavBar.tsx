import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";

const NavBar:React.FC=({props}:any)=>{
    const [agentCode, setAgentCode] = useState("");
    useEffect(()=> {
        const customerInfo = localStorage.getItem("AgencyCode");
        const parsedCustomerInfo = customerInfo? JSON.parse(customerInfo):undefined;
        setAgentCode(parsedCustomerInfo);
    },[])

    return(
        <nav className="navbar">
            <ul className="nav-links">
                <li>
                    <Link className="nav-link" to="/agent_home">Home</Link>
                </li>
                <li>
                    <Link className="nav-link" to="/display-customers">Customer</Link>
                </li>
                <li>
                    <Link className="nav-link" to="/signout">Sign out</Link>
                </li>
            </ul>
            <Link to="/" className="signout" state={{message:"signout"}}>Sign out</Link>
        </nav>
    )
}

export default NavBar;