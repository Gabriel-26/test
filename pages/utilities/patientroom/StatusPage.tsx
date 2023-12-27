import React, { useState } from "react";
import StatusPage from "./StatusPage";
import ImagePage from "./ImagePage";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { Button, message } from "antd";

const HumanFigureEvaluation = (props: any) => {
  const { patientData, updatePatientData, patientId } = props;

  // Define all body parts
  const bodyParts = [
    "head",
    "forehead",
    "nose",
    "mouth",
    "neck",
    "rightEye",
    "leftEye",
    "rightEar",
    "leftEar",
    "nape",
    "rightBreast",
    "leftBreast",
    "rightLung",
    "leftLung",
    "rightShoulderBlade",
    "leftShoulderBlade",
    "stomach",
    "abdomen",
    "waist",
    "rightThigh",
    "leftThigh",
    "rightFoot",
    "leftFoot",
    "rightKnee",
    "leftKnee",
    "rightLeg",
    "leftLeg",
    "rightAnkle",
    "leftAnkle",
    "rightCalf",
    "leftCalf",
    "rightShoulder",
    "leftShoulder",
    "rightArm",
    "leftArm",
    "rightForearm",
    "leftForearm",
    "rightWrist",
    "leftWrist",
    "rightHand",
    "leftHand",
  ];

  // Initialize evaluationData for all body parts
  const initialEvaluationData = bodyParts.reduce((acc, bodyPart) => {
    acc[`patient_${bodyPart}`] = { status: "none", note: "" };
    acc[`specify_patient_${bodyPart}`] = { note: "" };
    return acc;
  }, {});

  const [evaluationData, setEvaluationData] = useState(initialEvaluationData);

  const handleStatusChange = (bodyPart, newStatus) => {
    setEvaluationData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[`patient_${bodyPart}`].status = newStatus;

      // If the status is "none," set the note to an empty string
      if (newStatus === "none") {
        updatedData[`patient_${bodyPart}`].note = "";
      }

      return updatedData;
    });
  };

  const handleNoteChange = (bodyPart, newNote) => {
    setEvaluationData((prevData) => {
      const updatedData = { ...prevData };

      // Remove the status from specify_patient_bodypart
      updatedData[`specify_patient_${bodyPart}`] = { note: newNote }; // Remove status

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
