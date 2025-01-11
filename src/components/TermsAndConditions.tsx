import React from "react";

const TermsAndConditions=()=>{
    return(
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div style={{width: '400px'}} className="card">
                <div className="card-header">
                    <h2 className="card-title">Terms and Conditions</h2>
                </div>
                <div className="card-body">
                    <p className="card-text text-grey">How you data is processed: We utilize your data in order to further enhance our systems. Accepting these terms and conditions means you consent to processing of your data for such purposes.</p>
                </div>
            </div>
        </div>
    )
}

export default TermsAndConditions;