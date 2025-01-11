import React, { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";

interface RenewType{
    policyId: number|undefined,
    duration: number
}

interface customerType{
    customerId:number,
    customerName: string,
    email: string,
    dob: string,
    mobileNo:string,
    agentId:string,
    policy: policyTypeType
}

interface policyTypeType{
    policyId: number,
    policyType: string,
    startDate: string,
    endDate:string,
    duration:number
}

const EditPolicy:React.FC=()=>{
    const location = useLocation();
    const navigate = useNavigate();
    const {customerDetails} = location.state||{};

    const [policy, setPolicy] = useState<policyTypeType>();
    const [durn, setDurn] = useState<RenewType>({
    policyId:policy?.policyId,
    duration:1
}
    )
let parsedInfo:customerType;
useEffect(()=>{
    const auth = localStorage.getItem("signedOut");
        const authInfo = auth? JSON.parse(auth):undefined;
        if(auth==="true"){
            navigate("/", {state:{message:"error"}})
        }
        const customerInfo = localStorage.getItem("CustomerDetails");
        const parsedInfo = customerInfo? JSON.parse(customerInfo):undefined;
        setPolicy({...parsedInfo.policy});
},[])

const handleChange = (e:ChangeEvent<HTMLInputElement>) =>{
    setDurn({...durn, [e.target.name]:e.target.value});
}

const handleSubmit = async (event:React.FormEvent)=>{
    event.preventDefault();
    try{
        await axios.put(`http://localhost:9500/newgenagent/policy/renew/${policy?.policyId}`, {renewDuration:durn.duration, policyId:policy?.policyId})
        alert('Policy updated successfully');
        navigate("/customer-policy");
    }catch(error){
        console.log(error);
        alert("Failed to update customer");
    }
}
return(
    <>
    <NavBar />

    <div className="form-container">
        <div style={{width: '400px'}} className="card">
            <div className="card-header">
                <h2>Edit Policy</h2>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="duration" className="form-label">Renewal Duration</label>
                        <input type="text" className="form-control" name="duration" id="duration" value={durn.duration} onChange={handleChange}/>
                    </div>

                    <button className="btn btn-primary" type="submit">Submit</button>
                </form>
            </div>
        </div>
    </div>
    </>
)
}

export default EditPolicy;