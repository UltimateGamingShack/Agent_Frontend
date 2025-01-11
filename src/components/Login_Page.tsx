import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login_Page:React.FC=()=>{
    const loginMethods = ["MPIN", "Password"];

    const [formData, setFormData] = useState("Password");
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData(event.target.value);
    };

    const handleClick = () => {
        navigate("/");
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(formData==="Password"){
            navigate('/login_password');
        }else{
            navigate("/login-mpin")
        }
    };
    return(
        <div className="form-container mb-5">
            <div className="card p-4">
                <div className="card-body">
                    <h2 className="card-title">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label" >Please choose your preferred login mode</label>
                            <div className="d-flex flex-column gap-3">
                                {loginMethods.map((login,index) => (
                                    <div key={index} className="border p-2 rounded">
                                        <input type="radio" value={login} name="role" checked={formData===login} onChange={handleChange} className="form-check-input">
                                        </input>
                                        <label htmlFor={login} className="form-check-label ms-2">{login}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <button type="submit" className="btn btn-primary w-100">Proceed</button>

                        </div>
                        <div className="mb-4">
                            <button type="button" className="btn btn-danger w-100" id="cancelButton" name="cancel" onClick={handleClick}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login_Page;