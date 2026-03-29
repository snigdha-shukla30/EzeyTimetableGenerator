import React from "react";

const LeftAuthBox = ({ children }) => {
  return (
    <div className="relative w-full h-[86vh] mt-[1vh] rounded-[0.7vw] p-[0.07vw] bg-gradient-to-b from-[rgba(38,87,104,0.5)] to-[rgba(75,172,206,0.5)]">
      
      <div className="bg-[#F8F8F8] rounded-[0.6vw] px-[2vw] py-[2vh] flex flex-col justify-between h-full">
        
        {/* 🔥 FIXED WIDTH ISSUE */}
        <div className="w-full max-w-[31vw] mx-auto">
          {children}
        </div>

        <div className="mt-[2vh] flex items-center justify-between text-[0.75vw] text-[#A0AEC0]">
          <span>
            Copyright : Ezey. All Right Reserved.
          </span>

          <div>
            <a href="#" className="text-[#4BACCE] hover:underline">
              Terms & Conditions
            </a>
            <span className="mx-[0.3vw] text-[#CBD5E0]">|</span>
            <a href="#" className="text-[#4BACCE] hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeftAuthBox;