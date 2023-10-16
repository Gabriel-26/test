import React, { useState } from "react";
import StatusPage from "./StatusPage";
import ImagePage from "./ImagePage";

const HumanFigureEvaluation = () => {
  const [evaluationData, setEvaluationData] = useState({
    // Add the new body parts without specify_patient_ as needed
    patient_head: { status: "none", note: "" },
    patient_forehead: { status: "none", note: "" },
    patient_nose: { status: "none", note: "" },
    patient_mouth: { status: "none", note: "" },
    patient_neck: { status: "none", note: "" },
    patient_rightEye: { status: "none", note: "" },
    patient_leftEye: { status: "none", note: "" },
    patient_rightEar: { status: "none", note: "" },
    patient_leftEar: { status: "none", note: "" },
    patient_nape: { status: "none", note: "" },
    patient_rightBreast: { status: "none", note: "" },
    patient_leftBreast: { status: "none", note: "" },
    patient_rightLung: { status: "none", note: "" },
    patient_leftLung: { status: "none", note: "" },
    patient_rightShoulderBlade: { status: "none", note: "" },
    patient_leftShoulderBlade: { status: "none", note: "" },
    patient_stomach: { status: "none", note: "" },
    patient_abdomen: { status: "none", note: "" },
    patient_waist: { status: "none", note: "" },
    patient_rightThigh: { status: "none", note: "" },
    patient_leftThigh: { status: "none", note: "" },
    patient_rightFoot: { status: "none", note: "" },
    patient_leftFoot: { status: "none", note: "" },
    patient_rightKnee: { status: "none", note: "" },
    patient_leftKnee: { status: "none", note: "" },
    patient_rightLeg: { status: "none", note: "" },
    patient_leftLeg: { status: "none", note: "" },
    patient_rightAnkle: { status: "none", note: "" },
    patient_leftAnkle: { status: "none", note: "" },
    patient_rightCalf: { status: "none", note: "" },
    patient_leftCalf: { status: "none", note: "" },
    patient_rightShoudler: { status: "none", note: "" },
    patient_leftShoudler: { status: "none", note: "" },
    patient_rightArm: { status: "none", note: "" },
    patient_leftArm: { status: "none", note: "" },
    patient_rightForearm: { status: "none", note: "" },
    patient_leftForearm: { status: "none", note: "" },
    patient_rightWrist: { status: "none", note: "" },
    patient_leftWrist: { status: "none", note: "" },
    patient_rightHand: { status: "none", note: "" },
    patient_leftHand: { status: "none", note: "" },
  });

  const handleStatusChange = (bodyPart, newStatus) => {
    setEvaluationData({
      ...evaluationData,
      [bodyPart]: { ...evaluationData[bodyPart], status: newStatus },
    });
  };

  const handleNoteChange = (bodyPart, newNote) => {
    setEvaluationData({
      ...evaluationData,
      [bodyPart]: { ...evaluationData[bodyPart], note: newNote },
    });
  };

  return (
    <div>
      <StatusPage
        evaluationData={evaluationData}
        handleStatusChange={handleStatusChange}
        handleNoteChange={handleNoteChange}
      />
      <ImagePage evaluationData={evaluationData} />
    </div>
  );
};

export default HumanFigureEvaluation;
