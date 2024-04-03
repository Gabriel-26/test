import React, { useState } from "react";
import StatusPage from "./StatusPage";
import ImagePage from "./ImagePage";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { Button, message } from "antd";

const HumanFigureEvaluation = (props: any) => {
  const { patientId } = props;
  const [evaluationData, setEvaluationData] = useState({
    // Add the new body parts without specify_patient_ as needed
    patient_head: { status: "None", note: "" },
    patient_forehead: { status: "None", note: "" },
    patient_nose: { status: "None", note: "" },
    patient_mouth: { status: "None", note: "" },
    patient_neck: { status: "None", note: "" },
    patient_rightEye: { status: "None", note: "" },
    patient_leftEye: { status: "None", note: "" },
    patient_rightEar: { status: "None", note: "" },
    patient_leftEar: { status: "None", note: "" },
    patient_nape: { status: "None", note: "" },
    patient_rightBreast: { status: "None", note: "" },
    patient_leftBreast: { status: "None", note: "" },
    patient_rightLung: { status: "None", note: "" },
    patient_leftLung: { status: "None", note: "" },
    patient_rightShoulderBlade: { status: "None", note: "" },
    patient_leftShoulderBlade: { status: "None", note: "" },
    patient_stomach: { status: "None", note: "" },
    patient_abdomen: { status: "None", note: "" },
    patient_waist: { status: "None", note: "" },
    patient_rightThigh: { status: "None", note: "" },
    patient_leftThigh: { status: "None", note: "" },
    patient_rightFoot: { status: "None", note: "" },
    patient_leftFoot: { status: "None", note: "" },
    patient_rightKnee: { status: "None", note: "" },
    patient_leftKnee: { status: "None", note: "" },
    patient_rightLeg: { status: "None", note: "" },
    patient_leftLeg: { status: "None", note: "" },
    patient_rightAnkle: { status: "None", note: "" },
    patient_leftAnkle: { status: "None", note: "" },
    patient_rightCalf: { status: "None", note: "" },
    patient_leftCalf: { status: "None", note: "" },
    patient_rightShoulder: { status: "None", note: "" },
    patient_leftShoulder: { status: "None", note: "" },
    patient_rightArm: { status: "None", note: "" },
    patient_leftArm: { status: "None", note: "" },
    patient_rightForearm: { status: "None", note: "" },
    patient_leftForearm: { status: "None", note: "" },
    patient_rightWrist: { status: "None", note: "" },
    patient_leftWrist: { status: "None", note: "" },
    patient_rightHand: { status: "None", note: "" },
    patient_leftHand: { status: "None", note: "" },
  });

  const handleStatusChange = (bodyPart, newStatus) => {
    setEvaluationData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[bodyPart].status = newStatus;

      // If the status is "None," set the note to an empty string
      if (newStatus === "None") {
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
        transformedData[statusKey] = status === "None" ? "" : status;
        transformedData[`specify_${statusKey}`] = note;
      }

      transformedData["patient_id"] = patientId;

      const response = await axiosInstance.post(
        "/physicalExam/values",
        transformedData
      );

      if (response.status === 200) {
        console.log("Data saved successfully");
        message.success("Physical Exam saved successfully");
      } else {
        console.error("Failed to save data");
        message.error("Failed to save Physical Exam");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while saving data");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* StatusPage */}
      <div
        style={{
          flex: 0.5,
          overflowY: "auto",
          maxHeight: "60vh",
          padding: "0 10px",
        }}
      >
        <StatusPage
          patientId={patientId}
          setEvaluationData={setEvaluationData}
          evaluationData={evaluationData}
          handleStatusChange={handleStatusChange}
          handleNoteChange={handleNoteChange}
        />
        <Button
          type="primary"
          style={{
            backgroundColor: "#4CAF50",
            borderColor: "#4CAF50",
            marginTop: "10px",
          }}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>

      {/* ImagePage */}
      <div style={{ flex: 1, marginLeft: "0px" }}>
        <ImagePage evaluationData={evaluationData} />
      </div>
    </div>
  );
};

export default HumanFigureEvaluation;
