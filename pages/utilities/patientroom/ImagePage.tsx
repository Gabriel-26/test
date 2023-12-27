import React from "react";
import Image from "next/image";

const ImagePage = ({ evaluationData }) => {
  // Define a list of body parts
  const bodyParts = [
    { name: "patient_head", top: 60, left: 725 },
    { name: "patient_forehead", top: 40, left: 263 },
    { name: "patient_nose", top: 100, left: 265 },
    { name: "patient_mouth", top: 125, left: 265 },
    { name: "patient_neck", top: 165, left: 265 },
    { name: "patient_rightEye", top: 85, left: 245 },
    { name: "patient_leftEye", top: 85, left: 283 },
    { name: "patient_rightEar", top: 95, left: 220 },
    { name: "patient_leftEar", top: 95, left: 305 },
    { name: "patient_nape", top: 160, left: 727 },
    { name: "patient_rightBreast", top: 260, left: 210 },
    { name: "patient_leftBreast", top: 260, left: 330 },
    { name: "patient_rightLung", top: 220, left: 210 },
    { name: "patient_leftLung", top: 220, left: 330 },
    { name: "patient_rightShoulderBlade", top: 220, left: 800 },
    { name: "patient_leftShoulderBlade", top: 220, left: 650 },
    { name: "patient_stomach", top: 410, left: 267 },
    { name: "patient_abdomen", top: 360, left: 267 },
    { name: "patient_waist", top: 380, left: 340 },
    { name: "patient_rightThigh", top: 600, left: 785 },
    { name: "patient_leftThigh", top: 600, left: 680 },
    { name: "patient_rightFoot", top: 940, left: 254 },
    { name: "patient_leftFoot", top: 940, left: 300 },
    { name: "patient_rightKnee", top: 740, left: 240 },
    { name: "patient_leftKnee", top: 740, left: 310 },
    { name: "patient_rightLeg", top: 600, left: 220 },
    { name: "patient_leftLeg", top: 600, left: 320 },
    { name: "patient_rightAnkle", top: 910, left: 238 },
    { name: "patient_leftAnkle", top: 910, left: 320 },
    { name: "patient_rightCalf", top: 840, left: 700 },
    { name: "patient_leftCalf", top: 840, left: 770 },
    { name: "patient_rightShoulder", top: 210, left: 170 }, // Define with default values
    { name: "patient_leftShoulder", top: 210, left: 365 }, // Define with default values
    { name: "patient_rightArm", top: 350, left: 130 },
    { name: "patient_leftArm", top: 350, left: 405 },
    { name: "patient_rightForearm", top: 440, left: 870 },
    { name: "patient_leftForearm", top: 440, left: 590 },
    { name: "patient_rightWrist", top: 500, left: 100 },
    { name: "patient_leftWrist", top: 500, left: 440 },
    { name: "patient_rightHand", top: 540, left: 94 },
    { name: "patient_leftHand", top: 535, left: 450 },
  ];

  return (
    <div className="relative">
      {/* <h1>Image and Body Part Colors Page</h1> */}
      <Image
        src="/images/human_figure.png" // Replace with your image path
        alt="Human Figure"
        width={1200}
        height={2048}
      />
      {bodyParts.map((bodyPart) => (
        <div
          key={bodyPart.name}
          className="absolute"
          style={{ top: `${bodyPart.top}px`, left: `${bodyPart.left}px` }}
        >
          <div
            className={`w-5 h-5 rounded-full ${
              evaluationData[bodyPart.name]?.status === "Normal"
                ? "bg-green-300 text-green-600"
                : evaluationData[bodyPart.name]?.status === "Abnormal"
                ? "bg-yellow-300 text-yellow-600"
                : evaluationData[bodyPart.name]?.status === "Needs Attention"
                ? "bg-red-300 text-red-600"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            <span className="text-lg font-bold flex justify-center items-center h-full">
              {/* {bodyPart.name.replace("patient_", "")[0].toUpperCase()} */}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImagePage;
