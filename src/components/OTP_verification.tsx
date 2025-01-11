import { useLocation, useNavigate } from "react-router-dom"; import axios from "axios";
import { useEffect, useState } from "react";
interface OtpState{
agencyCode:string,
otp:string
}
const OtpVerificationComponent: React. FC = () => {
const location = useLocation();
const {generatedOtp, agencyCode}= location.state||{}
const [enteredOtp, setEnteredOtp] = useState<string>("");
 const[receivedotp, setReceivedOtp]=useState<string>(generatedOtp)
const [timer, setTimer] = useState<number>(120);
const [resendCount, setResendCount] = useState<number>(0); 
const [error, setError] = useState<string>(""); 
const [successMsg, setSuccessMsg]=useState<string>("");
 const [wrongAttempts, setWrongAttempts] =useState<number>(0); 
 const [otp, setOtp]=useState<string>("");
 const navigate = useNavigate();

 useEffect(() => {
    if(timer>0){
    const interval=setInterval(()=>{
    setTimer(prevTimer=>(prevTimer-1)); }, 1000);
     return()=>clearInterval(interval);
    }else{
        setOtp("");
        setError("Otp expired. Please request a new OTP!");
    }
},[timer]);

const handleSubmit = () => {
    if(!generatedOtp){
        setError("OTP is missing, please request a new OTP!");
        return;
    }
    if(enteredOtp.trim() === String(receivedotp).trim()){
        alert("OTP verified successfully!");
        setSuccessMsg("OTP verified successfully!");
        navigate("/success_page", {state:{agencyCode}});
        setError("");
    }else{
        setWrongAttempts((prev) => prev +1);
        setError("Invalid OTP! Please try again!");
        setSuccessMsg("");
        if(wrongAttempts+1>=3){
            alert("Number of attempts exceeded. Please restart the process.");
            setError("You have exceeded the maximum limit of attempts. Please resend the OTP");
            navigate("/register-agent", {replace:true});
        }else{
            setError("Incorrect OTP, please try again!");
        }
    }
};

const handleOtpChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setEnteredOtp(e.target.value);
    setError("");
};

const resendOtp = async () => {
    if(resendCount<3){
        try{
            const response = await axios.get("http://vjeemys-48:7000/otp");
            const newOtp = response.data;
            alert(`New OTP:${newOtp}`);
            if(!newOtp){
                throw new Error("Failed to Sign up!");
            }
            setReceivedOtp(newOtp);
            setSuccessMsg("A new OTP has been sent: " + newOtp);
            setResendCount(resendCount+1);
            setWrongAttempts(0);
            setTimer(120);
        }catch(error){
            setError("Failed to resend OTP");
        }
    }else if(resendCount>=2){
        setError("You have reached the maximum number of OTP resend attempts!");
    }
};

return(
    <div className="form-container mt-5">
        <h4>verify OTP</h4>
        <div className="card p-4">
            <div className="card-body">
                <label htmlFor="otp" className="form-label">Enter OTP:</label>
                <input type="text" name="otp" id="otp" value={enteredOtp} onChange={handleOtpChange} placeholder="Enter OTP" className="form-control mb-3" />
                {error && <div className="text-danger">{error}</div> }
            </div>
        </div>

            <div className="text-center mb-4">
                <button className="btn btn-success d-inline-block me-2" onClick={handleSubmit}>Verify OTP</button>
<button type="submit" className="btn btn-secondary d-inline-block" onClick={resendOtp} disabled={resendCount>=2}>Resend OTP</button> 
               {(<p className="text-muted">You can resend the otp in {timer} seconds</p>) }
            </div>
            {resendCount>=2 && (
                <div className="text-danger mt-3">You have reached the max number of resend attempts!</div>
            )}
    </div>
)
}

export default OtpVerificationComponent;