import React, { useState } from "react";
import StatusPage from "./StatusPage";
import ImagePage from "./ImagePage";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { Button, message } from "antd";

const HumanFigureEvaluation = (props: any) => {
  const { patientId } = props;
  const [evaluationData, setEvaluationData] = useState({
    // Add the new body parts without specify_patient_ as needed
    Head: { status: "None", note: "" },
    Forehead: { status: "None", note: "" },
    Nose: { status: "None", note: "" },
    Mouth: { status: "None", note: "" },
    Neck: { status: "None", note: "" },
    RightEye: { status: "None", note: "" },
    LeftEye: { status: "None", note: "" },
    RightEar: { status: "None", note: "" },
    LeftEar: { status: "None", note: "" },
    Nape: { status: "None", note: "" },
    RightBreast: { status: "None", note: "" },
    LeftBreast: { status: "None", note: "" },
    RightLung: { status: "None", note: "" },
    LeftLung: { status: "None", note: "" },
    RightShoulderBlade: { status: "None", note: "" },
    LeftShoulderBlade: { status: "None", note: "" },
    Stomach: { status: "None", note: "" },
    Abdomen: { status: "None", note: "" },
    Waist: { status: "None", note: "" },
    RightThigh: { status: "None", note: "" },
    LeftThigh: { status: "None", note: "" },
    RightFoot: { status: "None", note: "" },
    LeftFoot: { status: "None", note: "" },
    RightKnee: { status: "None", note: "" },
    LeftKnee: { status: "None", note: "" },
    RightLeg: { status: "None", note: "" },
    LeftLeg: { status: "None", note: "" },
    RightAnkle: { status: "None", note: "" },
    LeftAnkle: { status: "None", note: "" },
    RightCalf: { status: "None", note: "" },
    LeftCalf: { status: "None", note: "" },
    RightShoulder: { status: "None", note: "" },
    LeftShoulder: { status: "None", note: "" },
    RightArm: { status: "None", note: "" },
    LeftArm: { status: "None", note: "" },
    RightForearm: { status: "None", note: "" },
    LeftForearm: { status: "None", note: "" },
    RightWrist: { status: "None", note: "" },
    LeftWrist: { status: "None", note: "" },
    RightHand: { status: "None", note: "" },
    LeftHand: { status: "None", note: "" },
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
