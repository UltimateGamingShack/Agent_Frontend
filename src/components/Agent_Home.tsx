import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import agentImg from "../images/agenthome.jpg"
import axios from "axios";

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

const message = "Error"
let agentName = ""
const Agent_Home:React.FC=()=>{
    useEffect(()=>{
            const auth = localStorage.getItem("signedOut");
            const authInfo = auth? JSON.parse(auth):undefined;
            if(auth == "true"){
                navigate("/", {state:{message:"error"}})
            }
            const fetchData = async() =>{
                try{
                    
            const customerInfo = localStorage.getItem("CustomerDetails");
            const parsedCustomerInfo = customerInfo? JSON.parse(customerInfo):undefined;
            const token = localStorage.getItem("token");
            const tokenInfo = token? JSON.parse(token):undefined;
            const response = await axios.get("http://localhost:9500/newgenagent/agent/auth/"+parsedCustomerInfo);
            if(response.status===200){
                localStorage.setItem('agentId', JSON.stringify(response.data.agentId));
                localStorage.setItem('agentName', JSON.stringify(response.data.agentName))
                agentName = response.data.agentName;
                setAgentId(response.data.agentId);
            }
                }
                catch(error:any){
                    if(error.response.status===403){
                        navigate("/", {state:{message:message}});
                    }
                    console.log(error);
                }
            }
            fetchData();
        }, [])
        const [agentId, setAgentId] = useState(0);
        const location = useLocation();
        const {agencyCode} = location.state||{};
        const [customerData, setCustomerData] = useState<customerType[]>([]);
        const navigate = useNavigate();

        return(
            <>
            <NavBar />
            <div className="container mt-4">
            <h3 className="text-center">Welcome Agent {agentName}</h3>
            <img src={agentImg} className="img-fluid" alt="An agent shaking hand with a customer" />
            </div>
            </>
        )
}

export default Agent_Home;