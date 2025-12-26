import React, { useState } from "react";
import "./AboutUs.css";

export default function AboutUs() {
  const images = [
    "/sas.jpg",
    "/justin.jpg",
    "/blueColor.jpg",
    "/garage.jpg",
    "/p1.jpg",
    "/p2.jpg",
    "/p3.jpg",
    "/p4.jpg",
    "/p5.jpg"
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 2) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 2 + images.length) % images.length);
  };

  // Get two images for the current slide
  const firstImage = images[current];
  const secondImage = images[(current + 1) % images.length];

  return (
    <section className="about-section">
      <div className="about-content">
        <h2>About Us</h2>
        <p>
          Welcome to Saginaw Auto Repairs — where cars breathe easier, engines smile wider, and breakdowns come to meet their match. We’re not just a repair shop… we’re the place vehicles come to feel young again.

Our team of gear-loving, coffee-powered technicians can diagnose a rattle faster than you can say “check engine light.” Whether your car needs a simple tune-up or a full-on mechanical resurrection, we’ve got the tools, the talent, and the slightly obsessive passion to get it done right.

We believe in honesty, transparency, and service so good it almost feels suspicious. No hidden fees, no confusing jargon — just straight-up, high-quality auto care that keeps you safe, confident, and cruising smoothly.

At Saginaw Auto Repairs, we don’t just fix cars.
We revive them. We respect them. We love them.
(Probably a little too much… but hey, your secret is safe with us.)
        </p>
        <p>
          From routine maintenance to complex repairs, we pride ourselves on our
          professionalism, transparency, and excellent customer service.
        </p>
      </div>

      {/* TWO IMAGE SLIDER */}
      <div className="two-card-slider">
        <button className="slider-btn left" onClick={prevSlide}>
          ❮
        </button>

        <div className="card-pair">
          <div className="slider-card">
            <img src={firstImage} alt="slide1" />
          </div>

          <div className="slider-card">
            <img src={secondImage} alt="slide2" />
          </div>
        </div>

        <button className="slider-btn right" onClick={nextSlide}>
          ❯
        </button>
      </div>
    </section>
  );
}
