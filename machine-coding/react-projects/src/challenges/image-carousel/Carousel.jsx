import React from "react";
import CarouselItem from "./CarouselItem";
const carouselData = [
  {
    id: 1,
    imageUrl: "https://via.placeholder.com/800x400?text=Image+1",
    title: "Beautiful Sunset",
    description: "A breathtaking view of the sunset over the mountains.",
  },
  {
    id: 2,
    imageUrl: "https://via.placeholder.com/800x400?text=Image+2",
    title: "Forest Trail",
    description: "A peaceful trail through a dense green forest.",
  },
  {
    id: 3,
    imageUrl: "https://via.placeholder.com/800x400?text=Image+3",
    title: "City Lights",
    description: "A stunning skyline view of the city at night.",
  },
  {
    id: 4,
    imageUrl: "https://via.placeholder.com/800x400?text=Image+4",
    title: "Ocean Waves",
    description: "Waves crashing against the rocky shoreline.",
  },
  {
    id: 5,
    imageUrl: "https://via.placeholder.com/800x400?text=Image+5",
    title: "Desert Dunes",
    description: "Golden sand dunes stretching into the horizon.",
  },
];

function Carousel() {
  return (
    <div className="carousel-container">
      {carouselData.map((carousel) => {
        return <CarouselItem {...carousel} key={carousel.id} />;
      })}
    </div>
  );
}

export default Carousel;
