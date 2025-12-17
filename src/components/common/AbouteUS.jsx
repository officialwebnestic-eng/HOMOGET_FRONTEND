import React from 'react'
import { motion } from 'framer-motion'
import AgentSlider from './homecommon/AgentSlider'
import AgentHero from './homecommon/AgentHero'
 import Hero from "../aboutus/Hero"
 import Mission from "../aboutus/Mission"
 import Team from "../aboutus/Team"
 import Benefits from "../aboutus/Benefit"
 import Milestones from "../aboutus/Milestone"
 import Values from "../aboutus/Values"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.6, ease: 'easeOut' }
  })
}

const AboutUs = () => {
  return (
    <>
    
<div className="overflow-hidden">
<Hero />
<Mission />
<Values />
<Team />
<Benefits />
<Milestones />

</div>
    </>
  )
}

export default AboutUs
