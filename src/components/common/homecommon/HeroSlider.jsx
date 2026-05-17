import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { EffectFade, Autoplay } from "swiper/modules";

const HeroSlider = () => {
  const slides = [
    {
      img: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Luxury Living in the Hills",
      subtitle: "Spacious homes with a view",
   
    },
    {
      img: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=800",
      title: "Urban Smart Apartments",
      subtitle: "Modern designs & smart tech",
      
    },
    {
      img: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Beachside Paradise",
      subtitle: "Wake up to the sound of waves",
  
    },
  ];

  return (
    <div className="w-full h-[400px] relative overflow-hidden">
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        className="h-full w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="h-full w-full bg-cover bg-center flex items-center justify-center text-white text-center"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div className="  bg-transparent bg-opacity-50 p-8 rounded-xl">
                <h2 className="text-4xl font-bold">{slide.title}</h2>
                {/* <h2 className="text-4xl font-bold">Location:{slide.location}</h2> */}
                <p className="text-xl mt-2">{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
