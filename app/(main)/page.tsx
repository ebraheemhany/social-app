import React from "react";
import LeftSection from "@/component/leftSection/leftSection";
import MainSection from "@/component/mainSection/mainSection";
import RighteSection from "@/component/righteSection/righteSection";

const Home = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[100%] md:w-[95%] lg:w-[90%] relative bg-black text-white">
        <div className="flex gap-4">
          <div className="hidden md:block md:w-[30%] lg:w-[20%]">
            <div className="fixed top-0 h-screen md:w-[25%] lg:w-[16%]">
              <LeftSection />
            </div>
          </div>
          <div className="w-[100%] md:w-[70%] lg:w-[60%] mt-22 md:mt-10">
            <MainSection />
          </div>
          <div className="w-[20%] hidden lg:block">
            <div className="fixed top-0 w-[20%]">
              <RighteSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
