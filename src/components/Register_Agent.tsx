import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface FormValues{
    agencyCode: string,
    consent: boolean
}
interface FormErrors{
    agencyCode: string,
    consent:string;
}

const Register_Agent:React.FC=()=>{
    const [formData, setFormData] = useState<FormValues>({
        agencyCode:"",
        consent:false
    })
    const [errors, setErrors] = useState<FormErrors>({
        agencyCode:"",
        consent:""
    })

    const [generatedOtp, setGeneratedOtp] = useState<number|null>(null);
    const [formValidated, setFormValidated] = useState<boolean>(false);
    const navigate = useNavigate();
    const validateForm = () => {
        const newErrors: FormErrors = {
            agencyCode: "",
            consent: ""
        };

        if(!formData.agencyCode){
            newErrors.agencyCode = "Agency code is required";
        }else if(formData.agencyCode.length!=10){
            newErrors.agencyCode = "Agency code must be exactly 10 digits long";
        }else if(!/^\d+$/.test(formData.agencyCode)){
            newErrors.agencyCode = "Agency code must be numeric";
        }

        if(!formData.consent){
            newErrors.consent = "You must agree to the terms and conditions to proceed!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).every((key) => !newErrors[key as keyof FormErrors]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox"?checked:value,
        });
    };

    const onSubmit = async (e: React.FormEvent)=>{
        e.preventDefault();

        const isValid = validateForm();
        if(isValid){
        try{
            const response = await axios.get(`http://localhost:9500/newgenagent/agent/auth/${formData.agencyCode}`)

            if(response.status===200){
                alert("Agent already exists! Please login.")
                console.log("Success");
                navigate("/login-page");
            }
        }catch(error:any){
            if(error.response && error.response.status===404){
                try{
                const response = await axios.get("http://vjeemys-48:7000/otp");
                const otp = response.data;
                const agencyCode = formData.agencyCode;
                setFormValidated(true);
                localStorage.setItem("AgencyCode", JSON.stringify(formData.agencyCode));
                navigate("/view_otp", {state:{generatedOtp:otp, agencyCode:agencyCode}});
            }catch{
                console.error("Error fetching OTP:", error);
            }
        }
        if(error.response.status===404){
            console.error("Error fetching OTP:", error);
            const response = await axios.get("http://vjeemys:7000/otp");
            const otp = response.data;
            const agencyCode = formData.agencyCode;
            setFormValidated(true);

            localStorage.setItem("AgencyCode", JSON.stringify(formData.agencyCode));
            navigate("/view_otp", {state:{generatedOtp:otp, agencyCode:agencyCode}});
        }else{
            alert("Backend issue!");
        }
        }
    }
    };
    const handleProceedToOtpVerification=()=>{
        navigate("/verify_otp", {state:{generatedOtp}});

    }

    return(
        <div className="form-container mt-4">
            <h4 className="text-center">Verify your identity</h4>
            <div className="card p-4">
                <div className="card-body">
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="agencyCode">Agency Code:</label>
                            <input type="text" id="agencyCode" name="agencyCode" value={formData.agencyCode} className="form-control" placeholder="Enter agency code" onChange={handleInputChange} />
                            {errors.agencyCode && <div className="text-danger">{errors.agencyCode}</div> }
                        </div>
                        <div className="mb-3 form-check">
                            <label htmlFor="consent" className="form-check-label">I agree to the <Link to="/terms-and-conditions" target="_blank">terms and conditions</Link></label>
                            <input type="checkbox" id="consent" name="consent" checked={formData.consent} className="form-check-input" onChange={handleInputChange} />
                            {errors.consent && <div className="text-danger">{errors.consent}</div> }
                        </div>
                        <button type="submit" className="btn btn-primary text-center" onSubmit={onSubmit}>Request OTP</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Register_Agent;