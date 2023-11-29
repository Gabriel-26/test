import React, { useState } from "react";
import { Select, Input, Collapse } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import Image from "next/image";

const { Panel } = Collapse;
const { Option } = Select;

const HumanFigureEvaluationPage = (props: any) => {
  const { patientData, updatePatientData, patientId } = props; // Destructure patientData and updatePatientData props
  const [evaluationData, setEvaluationData] = useState({
    head: { patient_head: 0, specify_patient_head: "" },
    forehead: { patient_forehead: 0, specify_patient_forehead: "" },
    nose: { patient_nose: 0, specify_patient_nose: "" },
    mouth: { patient_mouth: 0, specify_patient_mouth: "" },
    neck: { patient_neck: 0, specify_patient_neck: "" },
    rightEye: { patient_rightEye: 0, specify_patient_rightEye: "" },
    leftEye: { patient_leftEye: 0, specify_patient_leftEye: "" },
    rightEar: { patient_rightEar: 0, specify_patient_rightEar: "" },
    leftEar: { patient_leftEar: 0, specify_patient_leftEar: "" },
    nape: { patient_nape: 0, specify_patient_nape: "" },
    rightBreast: {
      patient_rightBreast: 0,
      specify_patient_rightBreast: "",
    },
    leftBreast: { patient_leftBreast: 0, specify_patient_leftBreast: "" },
    rightLung: { patient_rightLung: 0, specify_patient_rightLung: "" },
    leftLung: { patient_leftLung: 0, specify_patient_leftLung: "" },
    rightShoulderBlade: {
      patient_rightShoulderBlade: 0,
      specify_patient_rightShoulderBlade: "",
    },
    leftShoulderBlade: {
      patient_leftShoulderBlade: 0,
      specify_patient_leftShoulderBlade: "",
    },
    stomach: { patient_stomach: 0, specify_patient_stomach: "" },
    abdomen: { patient_abdomen: 0, specify_patient_abdomen: "" },
    waist: { patient_waist: 0, specify_patient_waist: "" },
    rightThigh: { patient_rightThigh: 0, specify_patient_rightThigh: "" },
    leftThigh: { patient_leftThigh: 0, specify_patient_leftThigh: "" },
    rightFoot: { patient_rightFoot: 0, specify_patient_rightFoot: "" },
    leftFoot: { patient_leftFoot: 0, specify_patient_leftFoot: "" },
    rightKnee: { patient_rightKnee: 0, specify_patient_rightKnee: "" },
    leftKnee: { patient_leftKnee: 0, specify_patient_leftKnee: "" },
    rightLeg: { patient_rightLeg: 0, specify_patient_rightLeg: "" },
    leftLeg: { patient_leftLeg: 0, specify_patient_leftLeg: "" },
    rightAnkle: { patient_rightAnkle: 0, specify_patient_rightAnkle: "" },
    leftAnkle: { patient_leftAnkle: 0, specify_patient_leftAnkle: "" },
    rightCalf: { patient_rightCalf: 0, specify_patient_rightCalf: "" },
    leftCalf: { patient_leftCalf: 0, specify_patient_leftCalf: "" },
    rightShoulder: {
      patient_rightShoulder: 0,
      specify_patient_rightShoulder: "",
    },
    leftShoulder: {
      patient_leftShoulder: 0,
      specify_patient_leftShoulder: "",
    },
    rightArm: { patient_rightArm: 0, specify_patient_rightArm: "" },
    leftArm: { patient_leftArm: 0, specify_patient_leftArm: "" },
    rightForearm: {
      patient_rightForearm: 0,
      specify_patient_rightForearm: "",
    },
    leftForearm: {
      patient_leftForearm: 0,
      specify_patient_leftForearm: "",
    },
    rightWrist: { patient_rightWrist: 0, specify_patient_rightWrist: "" },
    leftWrist: { patient_leftWrist: 0, specify_patient_leftWrist: "" },
    rightHand: { patient_rightHand: 0, specify_patient_rightHand: "" },
    leftHand: { patient_leftHand: 0, specify_patient_leftHand: "" },
  });

  const bodyPartsWithPositions = [
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

  const currentHandleStatusChange = (bodyPart, newStatus) => {
    let mappedStatus = 0;
    if (newStatus === "1") {
      mappedStatus = 1;
    } else if (newStatus === "2") {
      mappedStatus = 2;
    } else if (newStatus === "3") {
      mappedStatus = 3;
    }

    setEvaluationData((prevData) => ({
      ...prevData,
      [bodyPart]: {
        ...prevData[bodyPart],
        [`patient_${bodyPart}`]: mappedStatus,
      },
    }));
  };

  const handleNoteChange = (bodyPart, newNote) => {
    setEvaluationData({
      ...evaluationData,
      [bodyPart]: {
        ...evaluationData[bodyPart],
        [`specify_patient_${bodyPart}`]: newNote,
      },
    });
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...evaluationData,
        patient_id: patientId, // Add patientId to the data
      };

      const response = await axiosInstance.post(
        "/physicalExam/values",
        dataToSend
      );

      if (response.status === 200) {
        console.log("Data saved successfully");
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div>
      <h1>Status and Notes Page</h1>
      <Collapse accordion>
        {bodyParts.map((bodyPart) => (
          <Panel key={bodyPart} header={bodyPart.replace("patient_", "")}>
            <Select
              value={
                evaluationData[bodyPart] &&
                evaluationData[bodyPart][`patient_${bodyPart}`]
                  ? evaluationData[bodyPart][`patient_${bodyPart}`].toString()
                  : "0"
              }
              onChange={(value) => currentHandleStatusChange(bodyPart, value)}
              style={{ width: "200px", marginBottom: "8px" }}
            >
              <Option value="0">None</Option>
              <Option value="1">Normal</Option>
              <Option value="2">Abnormal</Option>
              <Option value="3">Needs Attention</Option>
            </Select>

            <Input.TextArea
              value={evaluationData[bodyPart]?.note}
              onChange={(e) => handleNoteChange(bodyPart, e.target.value)}
              placeholder={`Add a note for ${bodyPart.replace(
                "patient_",
                ""
              )}...`}
              rows={3}
            />
          </Panel>
        ))}
      </Collapse>
      <button onClick={handleSave}>Save</button>

      <div className="relative">
        <h1>Image and Body Part Colors Page</h1>
        <Image
          src="/images/human_figure.png" // Replace with your image path
          alt="Human Figure"
          width={1200}
          height={2048}
        />
        {bodyPartsWithPositions.map((bodyPart) => (
          <div
            key={bodyPart.name}
            className="absolute"
            style={{ top: `${bodyPart.top}px`, left: `${bodyPart.left}px` }}
          >
            <div
              className={`w-5 h-5 rounded-full ${
                evaluationData[bodyPart.name]?.[`patient_${bodyPart.name}`] ===
                1
                  ? "bg-green-300 text-green-600"
                  : evaluationData[bodyPart.name]?.[
                      `patient_${bodyPart.name}`
                    ] === 2
                  ? "bg-yellow-300 text-yellow-600"
                  : evaluationData[bodyPart.name]?.[
                      `patient_${bodyPart.name}`
                    ] === 3
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
    </div>
  );
};

export default HumanFigureEvaluationPage;
