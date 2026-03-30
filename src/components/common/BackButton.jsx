import { useNavigate } from "react-router-dom";
import {  X } from "lucide-react";


function BackButton({ className, ...props }) {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.stopPropagation(); // Prevent bubbling if used inside another clickable
    if (window.history.length > 1) {
      navigate(-1);      // peeche jao
    } else {
      navigate("/form"); // warna dashboard/form bhej do
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={className}
      {...props}
    >
      <X size={20} color="#265768" strokeWidth={2.5} />
    </button>
  );
}

export default BackButton;
