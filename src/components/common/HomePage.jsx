import React from "react";
import AgentHero from "./homecommon/AgentHero";
import Agentfilter from "./homecommon/Agentfilter";
import AgentPropertyList from "./homecommon/AgentPropertyList";
import AgentSlider from "./homecommon/AgentSlider";
import HomeLoans from "./homecommon/HomeLoans";
import FAQSection from "../FAQSection";
import PartnersSlider from "./homecommon/PartnersSlider";

const HomePage = () => {
  return (
    <div>

      <Agentfilter></Agentfilter>
      <AgentPropertyList></AgentPropertyList>

      <PartnersSlider></PartnersSlider>
      <AgentSlider></AgentSlider>
      <FAQSection></FAQSection>
      {/* <HomeLoans></HomeLoans> */}
    </div>
  );
};

export default HomePage;
