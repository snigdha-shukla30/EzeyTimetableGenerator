import LeftAuthBox from "../../components/auth/LeftAuthLayout";
import RightAuthSlider from "../../components/auth/RightAuthSlider";
import EmailVerifiedForm from "../../components/auth/EmailVerified";

const EzeyVerifiedPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">

        <LeftAuthBox>
          <EmailVerifiedForm />
        </LeftAuthBox>

        <RightAuthSlider />

      </div>
    </div>
  );
};

export default EzeyVerifiedPage;
