import React from "react";
import "./ThermalHero2D.css";

export default function ThermalHero2D() {
  return (
    <section className="parallax-test">
      <div className="parallax-stage">

        <img
          src="/thermal-layers/background.png"
          alt=""
          className="parallax-layer base-layer"
        />

        <img
          src="/thermal-layers/house-body.png"
          alt=""
          className="parallax-layer house-layer"
        />

        <img
          src="/thermal-layers/roof-panels.png"
          alt=""
          className="parallax-layer roof-layer"
        />

        <img
          src="/thermal-layers/foreground.png"
          alt=""
          className="parallax-layer foreground-layer"
        />

      </div>
    </section>
  );
}