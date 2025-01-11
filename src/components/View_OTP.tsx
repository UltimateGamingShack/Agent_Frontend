import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const View_OTP:React.FC=()=>{
    const location = useLocation();
    const navigate = useNavigate();

    const {generatedOtp, agencyCode} = location.state||{};

    const handleOtpVerification=()=>{
        navigate("/verify_otp", {state:{generatedOtp, agencyCode}});
    }

    return(
        <div className="form-container mt-5">
            <h4 className="align-center">OTP Generated</h4>
            <div className="card shadow p-4">
                <div className="card-body">
                    <h5>Your OTP is : {generatedOtp}</h5>
                    <button className="btn btn-secondary mt-5" onClick={handleOtpVerification}>Verify Otp</button>
                </div>
            </div>
        </div>
    )
}

export default View_OTP;