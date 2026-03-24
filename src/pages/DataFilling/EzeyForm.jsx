import React, { useState } from "react";
import { StepNavigation } from "../../components/Steps/StepsNavigation";
import { ERPConnectionScreen } from "../../components/Steps/ERPconnectionscreen";
import { LoadchartScreen } from "../../components/Steps/LoadchartScreen";
import { ManualEntryScreen } from "../../components/Steps/ManualEntryScreen";

const EzeyForm = () => {
  const [currentStep, setCurrentStep] = useState(3);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  return (
    <div className="min-h-screen relative bg-[url('/whitestepsbg.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden">

      {/* Logo */}
      <div className="absolute top-10 left-14 z-20">
        <h1 className="text-5xl font-serif text-gray-800 tracking-wide drop-shadow-sm">
          Ezey
        </h1>
      </div>

      {/* CARD — HARD STUCK TO SIDEBAR */}
      <div className="absolute right-[420px] inset-y-0 flex items-center z-10">
        {currentStep === 1 && <ERPConnectionScreen onNext={handleNext} />}
        {currentStep === 2 && <LoadchartScreen onNext={handleNext} />}
        {currentStep === 3 && <ManualEntryScreen />}
      </div>

      {/* SIDEBAR */}
      <StepNavigation
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

    </div>
  );
};

export default EzeyForm;



