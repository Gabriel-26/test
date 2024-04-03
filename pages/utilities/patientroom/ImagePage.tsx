import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const ImagePage = ({ evaluationData }) => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 1,
    height: 1,
  });
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageDimensions({ width: naturalWidth, height: naturalHeight });
    }
  }, []); // Define a list of body parts
  const bodyParts = [
    { name: "patient_head", top: 60, left: 725 },
    { name: "patient_forehead", top: 40, left: 270 },
    { name: "patient_nose", top: 100, left: 270 },
    { name: "patient_mouth", top: 125, left: 270 },
    { name: "patient_neck", top: 165, left: 270 },
    { name: "patient_rightEye", top: 85, left: 252 },
    { name: "patient_leftEye", top: 85, left: 287 },
    { name: "patient_rightEar", top: 95, left: 229 },
    { name: "patient_leftEar", top: 95, left: 309 },
    { name: "patient_nape", top: 160, left: 727 },
    { name: "patient_rightBreast", top: 290, left: 213 },
    { name: "patient_leftBreast", top: 290, left: 332 },
    { name: "patient_rightLung", top: 240, left: 220 },
    { name: "patient_leftLung", top: 240, left: 330 },
    { name: "patient_rightShoulderBlade", top: 220, left: 800 },
    { name: "patient_leftShoulderBlade", top: 220, left: 650 },
    { name: "patient_stomach", top: 430, left: 270 },
    { name: "patient_abdomen", top: 360, left: 270 },
    { name: "patient_waist", top: 500, left: 347 },
    { name: "patient_rightThigh", top: 670, left: 785 },
    { name: "patient_leftThigh", top: 670, left: 680 },
    { name: "patient_rightFoot", top: 1045, left: 254 },
    { name: "patient_leftFoot", top: 1045, left: 310 },
    { name: "patient_rightKnee", top: 810, left: 240 },
    { name: "patient_leftKnee", top: 810, left: 310 },
    { name: "patient_rightLeg", top: 660, left: 234 },
    { name: "patient_leftLeg", top: 660, left: 320 },
    { name: "patient_rightAnkle", top: 990, left: 258 },
    { name: "patient_leftAnkle", top: 990, left: 310 },
    { name: "patient_rightCalf", top: 840, left: 700 },
    { name: "patient_leftCalf", top: 840, left: 770 },
    { name: "patient_rightShoulder", top: 210, left: 170 }, // Define with default values
    { name: "patient_leftShoulder", top: 210, left: 374 }, // Define with default values
    { name: "patient_rightArm", top: 340, left: 155 },
    { name: "patient_leftArm", top: 340, left: 390 },
    { name: "patient_rightForearm", top: 470, left: 870 },
    { name: "patient_leftForearm", top: 470, left: 590 },
    { name: "patient_rightWrist", top: 550, left: 110 },
    { name: "patient_leftWrist", top: 550, left: 440 },
    { name: "patient_rightHand", top: 600, left: 102 },
    { name: "patient_leftHand", top: 590, left: 450 },
  ];

  return (
    <div className="relative" style={{ maxWidth: "100%" }}>
      <Image
        src="/images/human_figure.png"
        alt="Human Figure"
        width={1200}
        height={1200}
        ref={imageRef}
      />
      {bodyParts.map((bodyPart, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: `${(bodyPart.top / imageDimensions.height) * 110}%`,
            left: `${(bodyPart.left / imageDimensions.width) * 124}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className={`w-3 h-3 rounded-full ${
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
              {/* You can optionally add text or initials here */}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImagePage;
