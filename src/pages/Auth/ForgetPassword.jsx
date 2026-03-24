import LeftAuthBox from "../../components/auth/LeftAuthLayout";
import RightAuthSlider from "../../components/auth/RightAuthSlider";
import ForgotPasswordForm from "../../components/auth/ForgetPasswordForm";

const EzeyForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <LeftAuthBox>
          <ForgotPasswordForm />
        </LeftAuthBox>

        <RightAuthSlider />

      </div>
    </div>
  );
};

export default EzeyForgotPasswordPage;
