 import React from 'react'
  import AgentHero from './homecommon/AgentHero'
import Agentfilter from './homecommon/Agentfilter'
import AgentPropertyList from './homecommon/AgentPropertyList'
import AgentSlider from './homecommon/AgentSlider'
import HomeLoans from './homecommon/HomeLoans'
 
 const HomePage = () => {
   return (
     <div>
       {/* <AgentHero></AgentHero> */}
       <Agentfilter></Agentfilter>
       <AgentPropertyList></AgentPropertyList>
       <AgentSlider></AgentSlider>
       <HomeLoans></HomeLoans>



     </div>
   )
 }
 
 export default HomePage
 