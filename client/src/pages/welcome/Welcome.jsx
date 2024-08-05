import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PF } from "../../config";
import "./welcome.scss";

const Welcome = () => {
  return (
    <>
      <Outlet />
      <main className="welcome">
        <div className="welcome-container container flow">
          <div className="welcome-logo">
            <img src={PF + "/images/logo.svg"} alt="" />
          </div>
          <div className="welcome-right-col flow-sm">
            <h1 className="fs-900 clr-neutral-800 fw-black">
              Welcome to Twittle
            </h1>
            <h2 className="fs-800 clr-neutral-800 fw-black margin-block-end-5">
              Join today.
            </h2>
            <div className="welcome-wrapper-button flow-sm">
              <Link to={"/register"}>
                <button className="welcome-button primary fs-300 bg-accent-blue clr-accent-white fw-bold radius-2">
                  Create Account
                </button>
              </Link>
              <div className="welcome-hr text-center bg-neutral-000">
                <span className="bg-neutral-000 clr-neutral-800">or</span>
              </div>
              <div className="fs-300 fw-bold flow-sm clr-neutral-800">
                <p>Already have account?</p>
                <Link to={"/login"} className="d-block">
                  <button className="welcome-button fs-300 clr-neutral-800 fw-bold radius-2">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Welcome;
