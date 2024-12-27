'use client'
import React, { useEffect, useRef } from 'react';

const Confetti = () => {
  const canvasRef = useRef(null);
  let W = window.innerWidth;
  let H = window.innerHeight;
  const maxConfettis = 150;
  const particles = [];

  const possibleColors = ["#F8F7D7", "#038f4b"];

  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  function ConfettiParticle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H - H;
    this.r = randomFromTo(11, 33);
    this.d = Math.random() * maxConfettis + 11;
    this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function (context) {
      context.beginPath();
      context.font = "bold 40px Gilroy";
      context.fillStyle = this.color;
      context.fillText("♦", this.x, this.y);
      context.fill();
    };
  }

  const Draw = (context) => {
    requestAnimationFrame(() => Draw(context));

    context.clearRect(0, 0, W, H);

    particles.forEach(particle => {
      particle.tiltAngle += particle.tiltAngleIncremental;
      particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 8;
      particle.tilt = Math.sin(particle.tiltAngle) * 15;

      if (particle.y <= H) {
        particle.draw(context);
      }

      if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
        particle.x = Math.random() * W;
        particle.y = -30;
        particle.tilt = Math.floor(Math.random() * 10) - 20;
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = W;
    canvas.height = H;

    for (let i = 0; i < maxConfettis; i++) {
      particles.push(new ConfettiParticle());
    }

    Draw(context);

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="confetti-container">
      <canvas ref={canvasRef} />
      <div className="popup">
        
        <h1>¡Muchas Gracias por tu compra!</h1>
      
      </div>
    </div>
  );
};

export default Confetti