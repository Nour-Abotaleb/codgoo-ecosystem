import { Link } from "react-router-dom";

import { AuthTemplate, RegisterForm } from "@features/auth";

export const RegisterRoute = () => (
  <AuthTemplate
    title="Create an account"
    subtitle="Please enter your data to create an account."
    bottomSlot={
      <span className="text-base md:text-lg text-black text-center">
        You already have an account?{" "}
        <Link to="/login" className="font-medium text-[#584ABC] hover:text-indigo-500 underline">
          Log in
        </Link>
      </span>
    }
  >
    <RegisterForm />
  </AuthTemplate>
);


