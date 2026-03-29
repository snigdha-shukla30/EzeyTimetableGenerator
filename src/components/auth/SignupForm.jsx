import React, { useState } from "react";
import { Mail, Lock, User, ChevronDown } from "lucide-react";
import { signupAPI } from "../../api/api";

import { Button } from "../../Components/ui/Button";
import { InputField } from "../../Components/ui/InputField";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password || !confirmPassword || !accountType) {
      alert("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await signupAPI({
        name,
        email,
        password,
        accountType,
      });

      if (res.success) {
        alert("Signup successful");
      } else {
        alert(res.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="mb-[2vh] text-center">
        <p className="text-[1vw] text-[#4A9FB5] text-left mb-[2vh]">Ezey</p>

        <h1
          className="mb-[1vh]"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: "2vw",
            lineHeight: "120%",
            color: "#265768",
          }}
        >
          Welcome to Ezey
        </h1>

        <p className="text-[1vw] text-[#7A8C94]">
          Start your experience with Ezey by signing in
        </p>
        <p className="text-[1vw] text-[#7A8C94]">or signing up</p>
      </div>

      {/* NAME */}
      <div className="mb-[1.5vh]">
        <InputField
          width="100%"
          height="5.2vh"
          label="Full Name*"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          icon={User}
        />
      </div>

      {/* EMAIL */}
      <div className="mb-[1.5vh]">
        <InputField
          width="100%"
          height="5.2vh"
          label="Email Address / Institution Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email Address or Institution Id"
          icon={Mail}
        />
      </div>

      {/* PASSWORD */}
      <div className="mb-[1.5vh]">
        <InputField
          width="100%"
          height="5.2vh"
          label="Create Password*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
          icon={Lock}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="mb-[2vh]">
        <InputField
          width="100%"
          height="5.2vh"
          label="Re-Enter Password*"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••••"
          icon={Lock}
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
        />
      </div>

      {/* ACCOUNT TYPE */}
      <div className="mb-[3vh] flex justify-center">
        <div className="relative w-[12vw] text-md">
          
          {/* LEFT ICON */}
          <User className="absolute left-[0.8vw] top-1/2 -translate-y-1/2 text-[#A0AEC0] w-[1vw] h-[1vw]" />

          {/* SELECT */}
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="appearance-none w-full h-[5vh] pl-[2.5vw] pr-[2.8vw] rounded-[1vw] border-[0.1vw] border-[#DFDFDF] text-[0.8vw] text-[#7A8C94] bg-white"
          >
            <option value="">Account Type</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          {/* RIGHT ARROW ICON */}
          <ChevronDown className="absolute right-[1.2vw] top-1/2 -translate-y-1/2 text-[#A0AEC0] w-[1vw] h-[1vw] pointer-events-none" />
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-center mb-[2vh]">
        <Button
          variant="primary"
          onClick={handleSubmit}
          className={loading ? "opacity-70 pointer-events-none" : ""}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </div>

      {/* FOOTER */}
      <p className="text-center text-[0.8vw] text-[#7A8C94] mb-[2vh]">
        Already a user ?{" "}
        <span className="text-[#4BACCE] cursor-pointer">
          Sign In
        </span>
      </p>
    </>
  );
};

export default SignupForm;