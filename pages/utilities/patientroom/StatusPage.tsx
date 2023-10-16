import React from "react";
import { Select, Input } from "antd";

const { Option } = Select;

const StatusPage = ({
  evaluationData,
  handleStatusChange,
  handleNoteChange,
}) => {
  // Define a list of body parts and their corresponding labels
  const bodyParts = [
    "patient_head",
    "patient_forehead",
    "patient_nose",
    "patient_mouth",
    "patient_neck",
    "patient_rightEye",
    "patient_leftEye",
    "patient_rightEar",
    "patient_leftEar",
    "patient_nape",
    "patient_rightBreast",
    "patient_leftBreast",
    "patient_rightLung",
    "patient_leftLung",
    "patient_rightShoulderBlade",
    "patient_leftShoulderBlade",
    "patient_stomach",
    "patient_abdomen",
    "patient_waist",
    "patient_rightThigh",
    "patient_leftThigh",
    "patient_rightFoot",
    "patient_leftFoot",
    "patient_rightKnee",
    "patient_leftKnee",
    "patient_rightLeg",
    "patient_leftLeg",
    "patient_rightAnkle",
    "patient_leftAnkle",
    "patient_rightCalf",
    "patient_leftCalf",
    "patient_rightShoulder",
    "patient_leftShoulder",
    "patient_rightArm",
    "patient_leftArm",
    "patient_rightForearm",
    "patient_leftForearm",
    "patient_rightWrist",
    "patient_leftWrist",
    "patient_rightHand",
    "patient_leftHand",
  ];

  return (
    <div>
      <h1>Status and Notes Page</h1>
      {bodyParts.map((bodyPart) => (
        <div key={bodyPart}>
          <h2>{bodyPart.replace("patient_", "")}</h2>
          <Select
            value={evaluationData[bodyPart]?.status}
            onChange={(value) => handleStatusChange(bodyPart, value)}
            style={{ width: "200px", marginBottom: "8px" }}
          >
            <Option value="none">None</Option> {/* Add "None" option */}
            <Option value="normal">Normal</Option>
            <Option value="abnormal">Abnormal</Option>
            <Option value="needs_attention">Needs Attention</Option>
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
        </div>
      ))}
    </div>
  );
};

export default StatusPage;
