import { useLocation, useNavigate } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";

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

const CustomerPage:React.FC=()=>{

    let topVariable:string;

    const location = useLocation();
    const navigate=useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [agencyCode, setAgencyCode] = useState("");
    const [customerData, setCustomerData] = useState<customerType[]>([]);
    const [agentId, setAgentId] = useState(0);
    const message = "error";
    useEffect(()=>{
        const auth = localStorage.getItem("signedOut");
        const authInfo = auth? JSON.parse(auth):undefined;
        if(auth==="true"){
            navigate("/", {state:{message:"error"}})
        }
        localStorage.removeItem("CustomerDetails");
        const customerInfo = localStorage.getItem("AgencyCode");
        const parsedCustomerInfo = customerInfo? JSON.parse(customerInfo):undefined;
        setAgencyCode(parsedCustomerInfo);
        console.log(agencyCode);
    }, []);

    useEffect(()=>{
        setLoading(true);

        console.log(agentId);
        const token = localStorage.getItem("token");
        const tokenInfo = token? JSON.parse(token):undefined;
        const id = localStorage.getItem("agentId");
        const id2 = id? JSON.parse(id): undefined;
        axios.get("http://localhost:9500/newgenagent/customers/" + id, {headers: {"Authorization" : `Bearer ${tokenInfo}`}}).then((response)=>{
            if(response.status===200){
                setCustomerData(response.data);
            }
        })
        .catch((error) =>{
            if(error.response.status===403)
            {
                navigate("/", {state:{message:message}});
            }
            if(error.status===404){
                setCustomerData([]);
            }
            console.log(error);
        }).finally(()=>{
            setLoading(false);
    });
    }, [agencyCode])
    const getCustomers = async() => {
        const customerInfo = localStorage.getItem("agentId");
        const parsedCustomerInfo = customerInfo?JSON.parse(customerInfo):undefined;

        try{
            const token = localStorage.getItem("token");
            const tokenInfo = token? JSON.parse(token):undefined;
            setLoading(true);
            const response = await axios.get('http://localhost:9500/newgenagent/customers/'+parsedCustomerInfo, {headers:{"Authorization" : `Bearer ${tokenInfo}`}});
            if(response.status===200){
                setCustomerData(response.data);
            }
        }catch(error:any){
            console.log(error);
            if(error.response.status===403){
                navigate("/", {state:{message:message}});
            }
            if(error.response.status===404){
                setCustomerData([]);
            }
        }finally{
            setLoading(false);
        }
    }
    const deleteCustomer = async(id:number) => {
        try{
            const token = localStorage.getItem("token");
            const tokenInfo = token? JSON.parse(token):undefined;
            const response = await axios.delete("http://localhost:9500/newgenagent/customers/"+id,{headers:{"Authorization": `Bearer ${tokenInfo}`}}); 
            getCustomers();
        }catch(error:any){
            if(error.response.status===403){
                navigate("/", {state:{message:message}});
            }
            console.log(error);
        }
    }

    return(
        <React.Fragment>
            <NavBar />
        {loading && <h1>Loading...</h1>}
        <div className="table-responsive">
            {customerData.length===0?(!loading && <div><h4>No customers available.</h4></div>):(
                <div className="table-wrapper">
                    <h2 className="mb-4 text-center">Customers</h2>
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Sno</th>
                                <th>Id</th>
                                <th>Name</th>
                                <th>DOB</th>
                                <th>Email</th>
                                <th>Mobile No</th>
                                <th>Policy Type</th>
                                <th>Policy</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {
                            customerData.map((customer,role)=>{
                                return(
                                    <React.Fragment key={role}>
                                        <tbody>
                                            <tr>
                                                <td>{role+1}</td>
                                                <td>{customer.customerId}</td>
                                                <td>{customer.customerName}</td>
                                                <td>{customer.dob}</td>
                                                <td>{customer.email}</td>
                                                <td>{customer.mobileNo}</td>
                                                <td>{customer.policy?(customer.policy.policyType):("None")}</td>
                                                <td><div className="mb-2">
                                                    <button type="button" className="btn btn-primary" onClick={()=>{
                                                        localStorage.setItem("CustomerDetails", JSON.stringify(customer));
                                                        const cust = localStorage.getItem("CustomerDetails");
                                                        const parsedCust = cust?JSON.parse(cust):undefined;
                                                        setTimeout(()=> navigate("/customer-policy", {state:{customerDetails:parsedCust}}),100)}}>Policy</button>
                                                    </div></td>
                                                    <td><div>
                                                        
                                                            <div className="mb-2">
                                                                <button type="button" className="btn btn-danger" onClick={()=> deleteCustomer(customer.customerId)}>Delete Customer</button>
                                                            </div>
                                                            <div className="mb-2">
                                                                <button type="button" className="btn btn-secondary" onClick={()=> navigate("/edit-customer", {state:{customerDetails:customer}})}>Edit Customer</button>
                                                            </div>
                                                        </div></td>
                                            </tr>
                                        </tbody>
                                    </React.Fragment>
                                )
                            })
                        }
                    </table>
                </div>
            )}
            {!loading && <div className="button-container">
                <button type="button" className="btn btn-success" onClick={()=>{navigate("/add_customer", {state:{agentId:agentId}})}}>Add Customer</button>
            </div> }
        </div>
        </React.Fragment>
    )
}

export default CustomerPage;