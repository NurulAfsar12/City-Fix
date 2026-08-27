import React from "react";
import Banner from "../../../Components/Banner/Banner";
import HeroSection from "../../../Components/Hero/HeroSection";
import HowItWorks from "../../../Components/HowItWorks/HowItWorks";
import Features from "../../../Components/Features/Features";
import Testimonials from "../../../Components/Testimonials/Testimonials";
import FAQ from "../../../Components/FAQ/FAQ";
import Awards from "../../../Components/Awards/Awards";
import CommunityChallenges from "../../../Components/CommunityChallenges/CommunityChallenges";
import StatsSection from "../../../Components/StatsSection/StatsSection";
import EmergencyContacts from "../../../Components/EmergencyContacts/EmergencyContacts";
import LatestResolvedIssues from "../../../Components/LatestResolvedIssues/LatestResolvedIssues";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <Banner />
      <StatsSection />
      <LatestResolvedIssues />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Awards />
      <EmergencyContacts />
      <CommunityChallenges />
      <FAQ />
    </div>
  );
};

export default Home;
