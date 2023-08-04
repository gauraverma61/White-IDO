import React from "react";

const SignUpSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center border border-primary-green-border  shadow-card-shadow-primary p-6 md:p-8 lg:p-10 gap-8  bg-secondary-dark">
      <div className="w-full text-center md:text-start">
        <div className=" text-primary-text text-sm mb-4">
          Never want to miss a sale?
        </div>
        <div className=" text-primary-green text-3xl">
          Sign up for our newsletter and get the latest news and updates.
        </div>
      </div>
      <div className="w-full xl:pl-2">
        <div className="flex gap-6 items-center border border-primary-green-border  py-2 px-3 md:px-8">
          <input
            placeholder="Email Address*"
            type="email"
            className=" border-none outline-none text-primary-green bg-none flex-1 bg-transparent placeholder:text-secondary-green max-w-full"
          />
          <div className="sm:flex h-[40px] w-[140px] hidden text-lg justify-center items-center cursur-pointer bg-primary-green  ">
            Subscribe
          </div>
        </div>
      </div>
      <div className="sm:hidden text-lg h-[40px] w-full flex justify-center items-center cursur-pointer bg-primary-green  ">
        Subscribe
      </div>
    </div>
  );
};

export default SignUpSection;
