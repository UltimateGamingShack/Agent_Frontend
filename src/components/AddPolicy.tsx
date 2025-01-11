import { useLocation, useNavigate } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";


interface Policy{
    policyId: string,
    policyType: string,
    startDate: string,
    endDate:string,
    duration:string
}

interface PolicyError{
    policyType: string,
    startDate: string,
    endDate:string,
    duration:string
}

const AddPolicy:React.FC=()=>{
    const location = useLocation();
    
    const navigate=useNavigate();
    const [formData, setFormData] = useState<Policy>({
    policyId: "",
    policyType: "",
    startDate: "",
    endDate:"",
    duration:""
    })
    const [formError, setFormError] = useState<PolicyError>({
        policyType: "",
        startDate: "",
        endDate:"",
        duration:""
        })

    const [success, setSuccess] = useState<string>("");
        const [checkPolicy, setCheckPolicy] = useState(true);
    const type = ['REGULAR', 'PREMIUM', 'PLATINUM']

    useEffect(()=>{
        const auth = localStorage.getItem("signedOut");
        const authInfo = auth? JSON.parse(auth):undefined;
        if(auth == "true"){
            navigate("/", {state:{message:"error"}})
        }
        const customerInfo = localStorage.getItem("CustomerDetails");
        const parsedCustomerInfo = customerInfo? JSON.parse(customerInfo):undefined;
        setCheckPolicy(parsedCustomerInfo.policy?(parsedCustomerInfo.policy.policyId?false:true):true)
    }, [])

    const handleChange= (event:ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLSelectElement>)=>{
    setFormData({...formData, [event.target.name]:event.target.value})
    setFormError({...formData, [event.target.name]:""})
    }

    const validate=()=>{
        const newError:PolicyError={...formError}
       
        if(!formData.policyType){
            newError.policyType="Policy type is required"
        }
        if(!formData.startDate){
            newError.startDate="Policy start date is required"
        }else if(new Date(formData.startDate) > new Date()){
            newError.startDate="Start date should be past or present"
        }

        
        if(!formData.endDate){
            newError.endDate="Policy start date is required"
        }else if(new Date(formData.endDate) <= new Date()){
            newError.endDate="End date should be future"
        }
        if(!formData.duration){
            newError.duration="Policy duration period is required"
        }
        setFormError(newError);
        return Object.keys(newError).every((key)=>!newError[key as keyof PolicyError])
    }

    const handleSubmit = async (event:React.FormEvent)=>{
        event.preventDefault();
        const isValid = validate();
        if(isValid){
            try{
                const token = localStorage.getItem("token");
                const tokenInfo = token? JSON.parse(token):undefined;
                const customerInfo = localStorage.getItem("CustomerDetails");
                const parsedCustomerInfo = customerInfo? JSON.parse(customerInfo):undefined;
                const response = await axios.post("http://localhost:9500/newgenagent/customers/"+parsedCustomerInfo.customerId+"/policy", formData, {headers: {"Authorization" : `Bearer ${tokenInfo}`}})
                if(response.status===201){
                    setSuccess("Policy added successfully");
                    setFormData({...formData, policyId:response.data});
                    parsedCustomerInfo.policy=formData;
                    parsedCustomerInfo.policy.policyId = response.data;
                    localStorage.setItem("CustomerDetails", JSON.stringify(parsedCustomerInfo));
                    navigate("/customer-policy")
                }else{
                    alert("Data not added!");
                }
            }catch(error:any){
               console.log(error);
               if(error.response.status === 403){
                    navigate("/");
               }  
               alert("Error occured! Please try again later!")
            }
        }
    }
    return(
        <>
        <NavBar/>

        {
        checkPolicy?(
            <div className="form-container mt-5">
                <h4 className="text-center mb-4">Add Policy</h4>
                <div className="card shadow-sm p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="policyType">Policy Type</label>
                            <select
                            name="policyType"
                            id="policyType"
                            value={formData.policyType}
                            onChange={handleChange}
                            className="form-control"
                            >
                                <option value="" disabled>Select Policy Type</option>
                            {type.map((t,index)=>{
                                return <option key={index} value={t}>{t}</option>
                            })}
                            </select>
                        </div>
    
                        <div className="form-group mb-3">
                            <label htmlFor="startDate">Policy start date</label>
                            <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className="form-control" />
                            {formError.startDate && <div className="text-danger">{formError.startDate}</div>}
                        </div>
    
                            
                        <div className="form-group mb-3">
                            <label htmlFor="endDate">Policy end date</label>
                            <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className="form-control" />
                            {formError.endDate && <div className="text-danger">{formError.endDate}</div>}
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="duration">Duration</label>
                            <input type="text"
                            name="duration"
                            id="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="form-control"
                            
                            />
                            {formError.duration && <div className="text-danger">{formError.duration}</div>}
                        </div>
    
                    
                        <button className="btn btn-primary">Add</button>
                    </form>
                </div>
            </div>):( <div>
        <h1 style={{color:"red"}}>Customer already has a policy!</h1>
        </div> )}

        </>
    )
}
export default AddPolicy
