import { Button } from "../../Components/ui/Button";

const EmailVerifiedForm = () => {

  const handleSubmit = () => {
    console.log("Send verification link");
  };

  return (
    <>
    
      <div className="mb-8 text-center">
        <p className="text-md text-[#4A9FB5] text-left mb-8">Ezey</p>

        <h1
          className="mb-3"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: "28px",
            lineHeight: "120%",
            color: "#265768",
          }}
        >
          Email Verification
        </h1>

        
      </div>

     
      <div className="mb-10 flex justify-center">
        <img
          src="/open-mail.png"  
          alt="Email Verified"
          className="w-[180px] h-auto"
        />
      </div>

      <div className="mb-8 text-center">
        

        <p
          style={{
            fontFamily: "sans-serif",
            fontWeight: 400,
           fontSize: "1vw",
            lineHeight: "150%",
            color: "#7A8C94",
          }}
        >
          We have sent you a verification link to your given gmail
          please open your gmail to verify .
        </p>
      </div>


      
      <div className="flex justify-center mb-6">
        <Button variant="primary" onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </>
  );
};

export default EmailVerifiedForm;





