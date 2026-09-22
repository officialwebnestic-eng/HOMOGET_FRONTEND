import React from "react";

import AgentHero from "./homecommon/AgentHero";
import Agentfilter from "./homecommon/Agentfilter";
import AgentPropertyList from "./homecommon/AgentPropertyList";
import AgentSlider from "./homecommon/AgentSlider";
import HomeLoans from "./homecommon/HomeLoans";
import FAQSection from "../FAQSection";
import PartnersSlider from "./homecommon/PartnersSlider";
import OffPlan from "../OffPlan";
import SEO from "../Seo/SEO";

const HomePage = () => {
  return (
    <div>
      {/* Dynamic SEO — Global Dubai real estate keywords, no off-plan focus */}
      <SEO
        title="Luxury Property for Sale in Dubai | Villas, Apartments & Investments"
        description="Explore exclusive luxury properties in Dubai. From Palm Jumeirah villas to Downtown apartments, find your ideal home or investment with HOMOGET."
        keywords={[
          "Dubai real estate",
          "luxury property Dubai",
          "buy property in Dubai",
          "Dubai apartments for sale",
          "property investment in Dubai",
           "off-plan property in Dubai",
            "off-plan project in Dubai",
          "Dubai villas",
          "property investment Dubai",
          "real estate agency Dubai",
          "homes for sale in Dubai",
          "Palm Jumeirah property",
          "Downtown Dubai apartments",
          "Dubai Marina homes",
          "luxury real estate Dubai",
        ]}
        url="/"
        ogTitle="Luxury Property for Sale in Dubai | Villas, Apartments & Investments - HOMOGET"
        ogDescription="Discover exclusive luxury properties, villas, and apartments across Dubai. Connect with verified real estate experts on HOMOGET."
        twitterTitle="Luxury Property for Sale in Dubai | HOMOGET"
        twitterDescription="Browse premium villas, apartments, and investment properties in Dubai through HOMOGET."
      />

      <AgentHero />
      <Agentfilter />
      <AgentPropertyList />
      <OffPlan />
      <PartnersSlider />
      <AgentSlider />
      <FAQSection />
      {/* <HomeLoans /> */}
    </div>
  );
};

export default HomePage;