import React, { useState } from "react";
import StatusPage from "./StatusPage";
import ImagePage from "./ImagePage";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { Button, message } from "antd";

const HumanFigureEvaluation = (props: any) => {
  const { patientData, updatePatientData, patientId } = props;
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
    patient_rightShoulder: { status: "none", note: "" },
    patient_leftShoulder: { status: "none", note: "" },
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
    setEvaluationData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[bodyPart].status = newStatus;

      // If the status is "none," set the note to an empty string
      if (newStatus === "none") {
        updatedData[bodyPart].note = "";
      }

      return updatedData;
    });
  };

  const handleNoteChange = (bodyPart, newNote) => {
    setEvaluationData((prevData) => {
      const updatedData = { ...prevData };

      // Remove the status from specify_patient_bodypart
      const specifyBodyPart = `specify_${bodyPart}`;
      updatedData[specifyBodyPart] = { note: newNote }; // Remove status

      return updatedData;
    });
  };

  const handleSave = async () => {
    try {
      // Transform the local state into the structure expected by the server
      const transformedData = {};

      for (const [bodyPart, { status, note }] of Object.entries(
        evaluationData
      )) {
        const statusKey = bodyPart;
        transformedData[statusKey] = status === "none" ? "" : status;
        transformedData[`specify_${statusKey}`] = note;
      }

      transformedData["patient_id"] = patientId;

      const response = await axiosInstance.post(
        "/physicalExam/values",
        transformedData
      );

      if (response.status === 200) {
        console.log("Data saved successfully");
        message.success("Data saved successfully");
      } else {
        console.error("Failed to save data");
        message.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while saving data");
    }
  };

  return (
    <div>
      <StatusPage
        patientId={patientId}
        setEvaluationData={setEvaluationData}
        evaluationData={evaluationData}
        handleStatusChange={handleStatusChange}
        handleNoteChange={handleNoteChange}
      />
      <Button
        type="primary"
        style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
        onClick={handleSave}
      >
        Save
      </Button>{" "}
      <ImagePage evaluationData={evaluationData} />
    </div>
  );
};

export default HumanFigureEvaluation;
