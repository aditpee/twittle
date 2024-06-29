import { PF } from "../../config";
import { Link } from "react-router-dom";

const EmailVerify = () => {
  return (
    <div className="email-verify text-left padding-inline-8 flow-sm">
      <div className="register-logo mx-auto margin-block-start-6">
        <img src={PF + "/images/logo.svg"} alt="" />
      </div>
      <div>
        <h1 className="margin-block-start-10 fs-800">
          An email has been sent to your regitered email address
        </h1>
        <p className="margin-block-start-6 fs-600">
          Please check your inbox or spam folder
        </p>
      </div>
      <div className="flow-sm">
        <p className="margin-block-start-12">
          <span className="clr-primary-000">resend email?</span> login with this
          email address
        </p>
        <Link className="d-block clr-primary-000" to={"/login"}>
          go to login page
        </Link>
      </div>
    </div>
  );
};

export default EmailVerify;
