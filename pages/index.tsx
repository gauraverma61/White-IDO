import HomeComp from "@components/Home";
import NewHome from "@components/NewHome";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className=" text-2xl">
      {/* <HomeComp /> */}
      <NewHome />
    </div>
  );
};

export default Home;
