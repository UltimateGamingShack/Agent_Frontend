import { useLocation, useNavigate } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";


interface AddDetails{
    customerName: string,
    email: string,
    dob: string,
    mobileNo:string,
    policy_id:string,
    agent_id:string
}

interface AddDetailsError{
    customerName: string,
    email:string,
    dob:string,
    mobileNo:string
}

const Add_Customer:React.FC=()=>{
    const location = useLocation();
    const {agentId} = location.state||{}
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        customer_id: 1,
        customerName:"",
        agentId:0,
        email:"",
        dob:"",
        mobileNo:"",
        policy:undefined
    })
    const [formError, setFormError] = useState<AddDetailsError>({
        customerName:"",
        email:"",
        dob:"",
        mobileNo:""
    })

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

    const handleChange= (event:ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData, [event.target.name]:event.target.value})
    setFormError({...formData, [event.target.name]:""})
    }

    const validation=()=>{
        const newError:AddDetailsError={...formError}
        const cust_name=/^[a-zA-Z\s]+$/.test(formData.customerName)
        if(!formData.customerName){
            newError.customerName="Customer name is required"
        }else if(!cust_name){
            newError.customerName="Enter valid name"
        }

        const emailValidation = /\S+@\S+\.\S+/.test(formData.email)
        if(!formData.email){
            newError.email="Email is required"
        }else if(!emailValidation){
            newError.email="Enter valid email"
        }
        const mobileValidation=/^\d{10}$/.test(formData.mobileNo)
        if(!formData.mobileNo){
            newError.mobileNo="Mobile number is required"
        }else if(!mobileValidation){
            newError.mobileNo="Please enter a valid mobile number"
        }
        if(!formData.dob){
            newError.dob="Date of birth is required"
        }else if(new Date(formData.dob)>= new Date()){
            newError.dob="Date of birth should be in past"
        }
        setFormError(newError);
        return Object.keys(newError).every((key)=>!newError[key as keyof AddDetailsError])
    }

    const handleSubmit = async (event:React.FormEvent)=>{
        event.preventDefault();
        const isValid = validation();
        if(isValid){
            try{
                const token = localStorage.getItem("token");
                const tokenInfo = token? JSON.parse(token):undefined;
                const resp = await axios.get(`http://localhost:9500/newgenagent/customers/customer/mobile/${formData.mobileNo}`, {headers: {"Authorization" : `Bearer ${tokenInfo}`}})
                if(resp.status===200){
                    alert("Customer already exists. Please Login.")
                    console.log("Success");
                }
            }catch(error:any){
               if(error.response&&error.response.status===404){
                try{const token = localStorage.getItem("token");
                    const tokenInfo = token? JSON.parse(token):undefined;
                    const response = await axios.post(`http://localhost:9500/newgenagent/customers`, {customerName: formData.customerName,policy:formData.policy,dob:formData.dob, mobileNo:formData.mobileNo,email:formData.email,agentId:agenId}, {headers: {"Authorization" : `Bearer ${tokenInfo}`}})
                
                    if(response.status===201){
                        setSuccess("Customer added successfully");
                        console.log("Customer added");
                        alert("Customer added successfully");
                        navigate("/display-customers")
                    }else{
                        alert("Data not added")
                    }
                }catch(error){
                    console.error("Error adding customer", error)
                    alert("Error adding customer!")
                }
               }     
            }
        }
    }
    return(
        <>
        <NavBar/>
        <div className="form-container mt-5">
            <h4>Add Customer</h4>
            <div className="card shadow-sm p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="customerName">Customer Name</label>
                        <input type="text"
                        name="customerName"
                        id="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter customer name"
                        />
                        {formError.customerName && <div className="text-danger">{formError.customerName}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="form-check" />
                        {formError.email && <div className="text-danger">{formError.email}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="mobileNo">Mobile Number</label>
                        <input type="text"
                        name="mobileNo"
                        id="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter mobile number"
                        />
                        {formError.mobileNo && <div className="text-danger">{formError.mobileNo}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="DOB">Date of Birth</label>
                        <input type="date"
                        name="dob"
                        id="DOB"
                        value={formData.dob}
                        onChange={handleChange}
                        className="form-control"
                        />
                        {formError.dob && <div className="text-danger">{formError.dob}</div>}
                    </div>
                <div className="button-container">
                    <button className="btn btn-primary">Submit</button>
                </div>
                </form>
            </div>
        </div>
        </>
    )
}
export default Add_Customer
