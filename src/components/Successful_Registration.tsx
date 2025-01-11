import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Successful_Registration:React.FC=()=>{

    const navigate = useNavigate();
    const location = useLocation();

    const {agencyCode} = location.state||{};

    const onSubmit=()=>{
        navigate("/set_account", {state:{agencyCode}})
    }

    return(
        <div className="form-container mt-5">
            <div className="card mb-3">
                <div className="card-body">
                    <h4 className="text-center">Verification Success! Please Set Up Your Credentials!</h4>
                <div className="container">
                    <div className="text-center">
                        <button type="submit" className="btn btn-success d-inline-block me-2" onClick={onSubmit}>Set Up Your Account</button>
                    </div>
                </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Successful_Registration;