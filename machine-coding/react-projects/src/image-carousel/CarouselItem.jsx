import React from "react";

function CarouselItem({ imageUrl, title, description, id }) {
  return (
    <div className="item">
      <title>{title}</title>
      <img src={imageUrl} alt="imageUrl" className="" />
    </div>
  );
}

export default CarouselItem;
