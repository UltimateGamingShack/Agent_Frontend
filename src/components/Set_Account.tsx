import React, { ChangeEvent, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";


interface SetUpDetails{
    agentName: string,
    role: string,
    password: string,
    confirmPassword:string,
    mpin:string,
    confirmMPIN:string,
    agencyCode:string
}

interface SetUpError{
    passwordError: string,
    mpinError:string,
    agentNameError:string,
}

const errorMessages:any = {
    passwordError: "Password is required",
    passwordConfirmError: "Passwords do not match",
    passwordInvalidError: "Required valid password",
    MPINError: "MPIN is required",
    MPINInvalidError: "Required valid MPIN",
    MPINConfirmError: "MPIN do not match",
    AgentInvalidNameError: "Please enter a valid name"
}

const Set_Account:React.FC=()=>{
    const location = useLocation();
    const {agencyCode} = location.state||{}
    
    const navigate=useNavigate();

    const [formData, setFormData] = useState<SetUpDetails>({
        agentName: "",
        role:"Agent",
        password:"",
        confirmPassword:"",
        mpin:"",
        confirmMPIN:"",
        agencyCode:agencyCode
    })

    const [errors, setErrors] = useState<SetUpError>({
        passwordError:"",
        mpinError:"",
        agentNameError:""

    })



    const handleChange= (event:ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData, [event.target.name]:event.target.value})
        setErrors({...errors, [event.target.name]:""})
        setSuccess("");    
    }

    const validation=()=>{
        const newError:SetUpError={...errors}
        let isValid = true;

        const password=/^(?=.[0-9])(?=. *[a-z])(?=.[A-Z])(?=.[#$%^&+=()!@~]).{8,}$/.test(formData.password);

        const name=/^[a-zA-Z\s]+$/.test(formData.agentName)
        if(!formData.agentName ||formData.agentName.length<=2){
            newError.agentNameError=errorMessages.AgentInvalidNameError;
        }

        if(!formData.password || !formData.confirmPassword){
            newError.passwordError=errorMessages.passwordError;
            isValid = false;
            console.log("password checked");
        }else if(formData.password.length<8 || !password){
            newError.passwordError=errorMessages.passwordInvalidError;
            isValid = false;

        }
        else if(formData.password!==formData.confirmPassword){
            newError.passwordError = errorMessages.passwordConfirmError;
            isValid = false;

        }

        const digit = /\d/.test(formData.mpin);

        if(!formData.mpin || !formData.confirmMPIN){
            newError.mpinError=errorMessages.MPINError;
            isValid = false;
        }else if(formData.password.length!=4 || !password){
            newError.mpinError=errorMessages.MPINInvalidError;
            isValid = false;

        }
        else if(formData.mpin!==formData.confirmMPIN){
            newError.mpinError = errorMessages.MPINConfirmError;
            isValid = false;

        }


        
        setErrors(newError);
        return isValid;
    }

    const [success, setSuccess] = useState<string>("");
    let agenId=0;
    useEffect(()=>{
        const auth = localStorage.getItem("signedOut");
        const authInfo = auth? JSON.parse(auth):undefined;
        const id = localStorage.getItem("agentId");
        agenId= id? JSON.parse(id):undefined;
        if(auth == "true"){
            navigate("/", {state:{message:"error"}})
        }
    })


    

    const onSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        const isValid = validation();
        if(isValid){
            console.log("validated");
            try{
                const response = await axios.post("http://localhost:9500/newgenagent/agent/auth/register", {agentName:formData.agentName, agencyCode:formData.agencyCode, role:formData.role,password:formData.password,mpin:formData.mpin})
                if(response.status===201){
                    setSuccess("Account setup successful!");
                    setErrors({agentNameError:"", passwordError:"", mpinError:""});
                    alert("Setup details successful");
                    navigate("/login-page");
                }
            }catch(error){
                setSuccess("");
                alert("No response!");
                console.log("Errorr!");
            }
        }
        console.log("After form data ", formData);
    }
    return(
        <>
        <div className="form-container mt-5">
            <h5>Please Enter Your Details, Agent Code : {agencyCode}</h5>
            <div className="card shadow-sm p-4">
                <div className="card-body">
                <form>
                    <div className="mb-3">
                        <label htmlFor="agent_name">Agent Name</label>
                        <input type="text"
                        name="agentName"
                        id="agent_name"
                        value={formData.agentName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter agent name"
                        />
                        {errors.agentNameError && <div className="text-danger">{errors.agentNameError}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Enter password"/>
                        {errors.passwordError && <div className="text-danger">{errors.passwordError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control" placeholder="Confirm password"/>
                        {errors.passwordError && <div className="text-danger">{errors.passwordError}</div>}
                    </div>
                   
                    <div className="mb-3">
                        <label htmlFor="mpin">MPIN</label>
                        <input type="password" name="mpin" id="mpin" value={formData.mpin} onChange={handleChange} className="form-control" placeholder="Enter MPIN"/>
                        {errors.mpinError && <div className="text-danger">{errors.mpinError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmMPIN">Confirm MPIN</label>
                        <input type="password" name="confirmMPIN" id="confirmMPIN" value={formData.confirmMPIN} onChange={handleChange} className="form-control" placeholder="Confirm MPIN"/>
                        {errors.mpinError && <div className="text-danger">{errors.mpinError}</div>}
                    </div>

                
                    <button className="btn btn-secondary" type="button" onClick={onSubmit}>Submit</button>
                    {success?(<div className="text-success">{success}</div>):("")}
                
                </form>
            </div>
        </div>
        </div>
        </>
    )
}
export default Set_Account;
