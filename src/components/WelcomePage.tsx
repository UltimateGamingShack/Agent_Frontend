import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Welcome_Page = () =>{
    const languages = ["English", "French", "Spanish", "German"];
    const roles = ["Agent", "DO", "CLIA", "LICA"];


    useEffect(()=>{
        localStorage.setItem("signedOut", JSON.parse("true"));
        localStorage.removeItem("CustomerDetails");
        localStorage.removeItem("agentId");
        localStorage.removeItem("AgencyCode");
        localStorage.removeItem("token");
        localStorage.removeItem("agentName");

        
    }, [])

    const [formData, setFormData] = useState({
        language: 'English',
        role: 'Agent'
    })

    const navigate = useNavigate();

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({...prevData, role:event.target.value}));
    };

    const handleLanguageChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prevData) => ({...prevData, language:event.target.value}));     
    };

    const handleSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        navigate("/register-agent");
    };

    return(
        <>
        <div className="form-container">
            <div className="card" style ={{width:'400px'}}>
                <div className="card-body">
                    <h2 className="card-title">Hello,</h2>
                    <h2 className="card-title">Welcome</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="languageSelect" className="form-label">Select your language</label>
                            <select value={formData.language} onChange={handleLanguageChange} id="languageSelect" className="form-select">
                                {languages.map((language,index)=>(
                                    <option value={language} key={index} disabled={language!=="English"}>{language}</option>
                                ))}
                            </select>

                        </div>

                        <div className="mb-4">
                            <label htmlFor="role" className="form-label">Please select your user role</label>
                            <div className="d-flex flex-column gap-3">
                                {roles.map((role,index) => (
                                    <div key={index} className="border p-2 rounded">
                                        <input type="radio" value={role} name="role" id="role" checked={formData.role===role} onChange={handleRoleChange} disabled ={role!=="Agent"} className="form-check-input"/>
                                        <label htmlFor={role} className="form-check-label">{role}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <button type="submit" className="btn btn-primary w-100">Get Started</button>
                                <div className="mb-4">

                                </div>
                                <p>Already Existing Users, Please <Link className='' to='/login-page'>Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default Welcome_Page