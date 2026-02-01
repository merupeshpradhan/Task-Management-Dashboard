import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api/api";

function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const userSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);

      const res = await api.post("/users/signup", formData);
      console.log(res.data);

      // console.log("You register successfully!", res);

      const successsMsg =
        res.data?.message || "Signup successful! Please login.";
      console.log(successsMsg);

      navigate("/signin");

      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response) {
        const errorMsg =
          error.response?.data?.message ||
          "SignUp failed. Something went wrong.";

        console.log(errorMsg);
      } else {
        const errorMsg = "Something went wrong. Please try again.";

        console.log(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[99.9vh] flex items-center justify-around">
      <div className="w-[40%]">
        <img src="/Login.jpg" />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p>Login in to manage your task and track progress.</p>

        <form onSubmit={userSignUp} className="space-y-5 mt-10">
        {/* FullName */}
          <div className="firstName w-full">
            <label className="md:font-semibold text-gray-700">First Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border text-[15px] border-pink-300 rounded-md p-2 focus:border-pink-500 focus:outline-none"
            />
          </div>
          {/* Email */}
          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-pink-300 rounded-md p-1.5 focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative ">
            <label className="font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-pink-300 rounded-md p-1.5 md:p-2 focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-pink-500 mt-3 md:mt-0 text-white py-1.5 md:py-2 rounded-md md:font-semibold hover:bg-pink-600 transition cursor-pointer flex justify-center items-center gap-2 ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-3 md:mt-6 text-[14px] tracking-wide">
          Don't have an account?
          <Link
            to="/signin"
            className="text-pink-500 md:font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
