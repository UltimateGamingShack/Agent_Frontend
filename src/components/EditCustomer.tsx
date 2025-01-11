import { useLocation, useNavigate } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
interface Customer{
    customerName: string,
    email: string,
    mobileNo: string,
    dob: string
}
const EditCustomerPage:React.FC=()=>{
    const location = useLocation();
    const navigate = useNavigate();
    const {customerDetails} = location.state||{};

    const [customer, setCustomer] = useState<Customer>({
        customerName:"",
        email:"",
        mobileNo:"",
        dob:""
    })

    useEffect(()=>{
        const auth = localStorage.getItem("signedOut");
        const authInfo = auth?JSON.parse(auth):undefined;
        if(auth==="true"){
            navigate("/", {state:{message:"error"}})
        }
    },[])


useEffect(()=>{
    if(customerDetails){
        setCustomer(customerDetails);
    }else{
        alert("No Data Found");
        navigate("/display-customers")
    }
}, [customerDetails,navigate]);


const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
    setCustomer({...customer, [e.target.name]:e.target.value})}

const handleSubmit=async (event:React.FormEvent)=>{
    event.preventDefault();
    try{
        const token = localStorage.getItem("token");
        const tokenInfo = token? JSON.parse(token):undefined;
        await axios.put("http://localhost:9500/newgenagent/customers/"+customerDetails.customerId, customer, {headers:{"Authorization": `Bearer ${tokenInfo}`}});
        alert("Customer updated successfully!");
        navigate("/display-customers");
    }catch(error:any){
        console.log(error);
        if(error.response.status===403){
            navigate("/");
        }
        alert("Failed to update customer. Please try again later!");
    }
}
return(
    <>
    <NavBar />
    <div className="form-container">
        <div className="card p-4"></div>
        <div className="card-header">
            <h2 className="card-title">Edit Customer Details</h2>
        </div>
        <div className="card-body">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerName">Customer Name</label>
                    <input type="text" className="form-check" name="customerName" id="customerName" value={customer.customerName} onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-check" name="email" id="email" value={customer.email} onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="mobileNo">Mobile Number</label>
                    <input type="text" className="form-check" name="mobileNo" id="mobileNo" value={customer.mobileNo} onChange={handleChange}/>
                </div>


                <div className="form-group">
                    <label htmlFor="DOB">DOB</label>
                    <input type="date" className="form-check" name="dob" id="DOB" value={customer.dob} onChange={handleChange}/>
                </div>

                <button className="btn btn-primary">Add</button>

            </form>
        </div>
    </div>
    </>
)
}


export default EditCustomerPage;