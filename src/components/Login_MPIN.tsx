import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MPINLogin{
    agencyCode: string,
    mpin:string
}

const Login_MPIN:React.FC=()=>{
    const [formData, setFormData] = useState<MPINLogin>({
        agencyCode:"",
        mpin:""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (event:ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData, [event.target.name]:event.target.value})
    }

    const handleLogin = async()=>{
        try{
            const response = await axios.post("http://locahost:9500/newgenagent/agent/auth/loginMpin", formData);
            if(response.status===201){
                alert("Login successful!");
                localStorage.setItem("signedOut", JSON.stringify("false"));
                localStorage.setItem("AgencyCode", JSON.stringify(formData.agencyCode));
                localStorage.setItem("token", JSON.stringify(response.data.token));
                navigate("/agent_home", {state:{agencyCode:formData.agencyCode}});
            }else{
                console.log(response);
                setError("Invalid MPIN, please try again");
            }
        }catch(error){
            console.log(error);
            setError("An error occurred. Please try again later");
        }
    }
        return(
            <div className="form-container mt-5">
                <div className="card p-4">
                    <h4>Enter your details for login</h4>
                    <form>
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="agencyCode">Agency Code</label>
                                <input type="text" name="agencyCode" className="form-check" id="agencyCode" value={formData.agencyCode} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mpin">MPIN</label>
                                <input type="password" name="mpin" className="form-check" id="mpin" value={formData.mpin} onChange={handleChange} />
                            </div>

                <button type="button" onClick={handleLogin} className="btn btn-primary">Login</button>
                {error && <div className="text-danger">{error}</div> }
                        </div>
                    </form>
                </div>
            </div>
        )
    }


export default Login_MPIN;