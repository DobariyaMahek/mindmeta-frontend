import React, { useEffect, useRef } from "react";
import "./Callmodel.css";

import Boy1 from "../../../public/static/dashboardimages/boy1.png";
import Boy2 from "../../../public/static/dashboardimages/boy2.png";
import Boy3 from "../../../public/static/dashboardimages/boy3.png";
import Boy4 from "../../../public/static/dashboardimages/boy4.png";
import Callingperson from "../../../public/static/dashboardimages/callingperson.jfif";

export default function Callmodelmain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const meterWidth = 8;
    const gap = 2;
    const cwidth = canvas.width;
    const cheight = canvas.height;
    const meterNum = Math.floor(cwidth / (meterWidth + gap));

    let audioContext, analyser, audioInput;

    const startRecording = () => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          audioContext = new (window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.msAudioContext)();
          audioInput = audioContext.createMediaStreamSource(stream);
          analyser = audioContext.createAnalyser();
          audioInput.connect(analyser);

          drawSpectrum();
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    };

    const drawSpectrum = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, cheight);
      gradient.addColorStop(1, "#a467af");
      gradient.addColorStop(0.3, "#ff0");
      gradient.addColorStop(0, "#f00");

   const drawMeter = () => {
     const array = new Uint8Array(analyser.frequencyBinCount);
     analyser.getByteFrequencyData(array);

     ctx.clearRect(0, 0, cwidth, cheight);

     // Adjust wave radius based on the average volume
     const avgVolume = array.reduce((a, b) => a + b, 0) / array.length;
     const maxRadius = 50 + avgVolume; // Controls wave size based on volume

     // Draw concentric circles with decreasing opacity for outer rings
     for (let i = 0; i < meterNum; i++) {
       const value = array[i];
       const radius = (i + 1) * (maxRadius / meterNum); // Calculate radius for each circle
       const opacity = 1 - i / meterNum; // Decrease opacity for outer rings

       ctx.beginPath();
       ctx.arc(cwidth / 2, cheight / 2, radius, 0, 2 * Math.PI);
       ctx.strokeStyle = `rgba(255, 100, 132, ${opacity * 2})`; // Apply calculated opacity to color
       ctx.lineWidth = 5; // Adjust line width if needed
       ctx.stroke();
     }

     requestAnimationFrame(drawMeter); // Continuously call drawMeter for animation
   };


      requestAnimationFrame(drawMeter);
    };

    startRecording();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  return (
    <div className="callmodel-main">
    {/* <div className="callmodel-main callmodel-main-dark"> */}
      <div className="callmodel-main-box">
        <div className="calling-person-div-main">
          <div className="calling-person-div">
            <div className="calling-person-name">
              <p>Lisa</p>
            </div>
            <div className="calling-person-time">
              <span>00 : 00</span>
            </div>
            <div className="calling-person-active-dot">
              <div className="calling-person-active-inner-dot"></div>
            </div>
            <div className="calling-person-div-with-ring">
              <canvas
                ref={canvasRef}
                width="300"
                height="300"
                className="voice-wave-canvas"
              ></canvas>
              <div className="calling-person-div-with-ring-image">
                <img src={Callingperson} alt="Callingperson" />
              </div>
              <div className="calling-person-with-ring-big"></div>
              <div className="calling-person-with-ring-small">
                <div className="calling-person-with-ring-small-inner"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="callmodel-main-box-pera">
          <p>
            James, your son Matt’s son and your grandson Jason is turning 4 on
            Monday the 5th of November. Do you remember the day Jason was born?
            You were so worried about Matt’s wife Elisa when she was in labour.
            Let me show you Jason’s pictures to refresh your memory.
          </p>
        </div>
        <div className="callmodel-container">
          <div className="callmodel-main-box-grd-main">
            <div className="callmodel-main-box-grd-box">
              <img src={Boy1} alt="Boy1" />
              <div className="callmodel-main-box-grd-box-content">
                <h2>Jason (Birthday boy)</h2>
                <p>Mal’s son</p>
              </div>
            </div>
            <div className="callmodel-main-box-grd-box">
              <img src={Boy2} alt="Boy2" />
              <div className="callmodel-main-box-grd-box-content">
                <h2>Phillips (Phil)</h2>
                <p>Tom’s son</p>
              </div>
            </div>
            <div className="callmodel-main-box-grd-box">
              <img src={Boy3} alt="Boy3" />
              <div className="callmodel-main-box-grd-box-content">
                <h2>Hannah (Princes)</h2>
                <p>Mal’s daughter</p>
              </div>
            </div>
            <div className="callmodel-main-box-grd-box">
              <img src={Boy4} alt="Boy4" />
              <div className="callmodel-main-box-grd-box-content">
                <h2>Aron (James)</h2>
                <p>Adam’s Son</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
