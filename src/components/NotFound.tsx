import React from "react";

const NotFound=()=>{
    return(
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div style={{width: '400px'}} className="card">
                <div className="card-header">
                    <h2 className="card-title">Error 404!</h2>
                </div>
                <div className="card-body">
                    <h2 className="card-text">Page Not Found!</h2>
                </div>
            </div>
        </div>
    )
}