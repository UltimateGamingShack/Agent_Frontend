import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import policyimg from '../images/policyimg.jpg';
interface policyType{
    policyId: number,
policyType: string,
startDate: string,
endDate: string,
duration:number
}
const PolicyPage:React.FC=()=>{
    const location = useLocation();
    const navigate = useNavigate();
    let {customerDetails} = location.state||{}

    let parsedInfo;
    const [rerender, setRerender]=useState(false);
    const[policy, setPolicy] = useState<policyType|null>();
    useEffect(()=>{
        const auth = localStorage.getItem("signedOut");
        const authInfo = auth? JSON.parse(auth):undefined;
        if(authInfo===true){
            navigate("/", {state:{message:"error"}});
        }
        const customerInfo = localStorage.getItem("CustomerDetails");
        if(customerInfo==="undefined"){
            navigate("/display-customers");
        }else{
        const parsedCustomerInfo = customerInfo? JSON.parse(customerInfo):undefined;
        customerDetails = parsedCustomerInfo;

        if(parsedCustomerInfo && parsedCustomerInfo.policy!=null && parsedCustomerInfo.policy.policy_id!=null){
            const token = localStorage.getItem("token");
            const tokenInfo = token? JSON.parse(token):undefined;
            axios.get("http://localhost:9500/newgenagent/policy/"+parsedCustomerInfo.policy.policyId, {headers: {"Authorization": `Bearer ${tokenInfo}`}}).then((response)=>{
                setPolicy(response.data);
                console.log(response);
            }).catch((error)=>{
                if(error.response.status===403){
                    navigate("/");
                }
                setPolicy(null);
            })
        }
    }
    }, [])
   
    const handleDelete = () => {
        const token = localStorage.getItem("token");
        const tokenInfo = token? JSON.parse(token):undefined;
        const customerInfo = localStorage.getItem("CustomerDetails");
        const parsedInfo = customerInfo? JSON.parse(customerInfo):undefined;

        axios.delete("http://localhost:9500/newgenagent/customers/"+parsedInfo.customerId+"/"+parsedInfo.policy.policyId, {headers:{"Authorization" : `Bearer ${tokenInfo}`}}).then((response)=>{
            parsedInfo.policy =null;
            localStorage.setItem("CustomerDetails", JSON.stringify(parsedInfo));
        }).catch((error)=>{
            console.log(error);
            if(error.response.status===403){
                navigate("/");
            }
        })
    }
    return(
        <>
        <NavBar />
        <div className="d-flex justify-content-center align-items-center vh-100">
            {policy?(
                <div style={{width: '400px'}} className="card">
                    <div className="card-header">
                        <h6 className="card-title">{policy.policyType} Policy</h6>
                    </div>
                    <div className="card-footer">
                        <p className="card-body">Start Date: {policy.startDate}</p>
                        <p className="card-body">End Date:{policy.endDate}</p>

                        <div className="row">
                            <div className="col-md-1"></div>
                            <div className="col-md-5">
                                <button className="btn btn-secondary btn-block" onClick={()=> navigate("/edit_policy", {state:{customerDetails:customerDetails}})}>Edit Policy</button>
                            </div>
                            <div className="col-md-6">
                                <button type="button" className="btn btn-danger btn-block" onClick={()=> handleDelete()}>Delete Policy</button>
                            </div>
                        </div>
                    </div>
                </div>
            ):(
                <>
                <div style={{textAlign: "center"}}>
                    <div className="mb-5">
                        <img src={policyimg} alt="Policy photo" style={{width:"400px"}} />
                    </div>
                    <div className="mb-5">
                        <button type="button" className="btn btn-success btn-block" onClick={()=> navigate("/add_policy", {state:{customerDetails:customerDetails}})}>Add Policy</button>
                    </div>
                </div>
                </>
            )}
        </div>
        </>
    )
}
export default PolicyPage;