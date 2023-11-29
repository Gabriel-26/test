import React, { useEffect, useState } from "react";
import { Select, Input, Collapse } from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance";

const { Panel } = Collapse;
const { Option } = Select;

const StatusPage = ({
  patientId,
  evaluationData, // Assuming you have patientId as a prop
  handleStatusChange,
  handleNoteChange,
  setEvaluationData, // Add setEvaluationData as a prop
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/physicalExam/values/getPE/${patientId}`
        );
        console.log("Response data:", response.data);

        // Process the response data to create a map of attribute names to values
        const responseDataMap = response.data.reduce((acc, item) => {
          const attributeName = item.attribute_Name;
          const isSpecifyAttribute = attributeName.startsWith("specify_");

          acc[attributeName] = isSpecifyAttribute
            ? { note: item.value || "" } // Set the note based on the value from the API
            : { status: item.value, note: item.specify_value || "" };

          return acc;
        }, {});

        setEvaluationData(responseDataMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId, setEvaluationData]);

  useEffect(() => {
    console.log("Evaluation Data:", evaluationData);
  }, [evaluationData]);

  return (
    <div>
      <h1>Status and Notes Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Collapse accordion>
          {bodyParts.map((bodyPart) => (
            <Panel key={bodyPart} header={bodyPart.replace("patient_", "")}>
              <Select
                value={
                  evaluationData[bodyPart] !== undefined &&
                  evaluationData[bodyPart].status
                    ? evaluationData[bodyPart].status
                    : "none"
                }
                onChange={(value) => {
                  console.log("Select Value:", value);
                  handleStatusChange(bodyPart, value);
                }}
                style={{ width: "200px", marginBottom: "8px" }}
              >
                <Option value="none">None</Option>
                <Option value="normal">Normal</Option>
                <Option value="abnormal">Abnormal</Option>
                <Option value="needs_attention">Needs Attention</Option>
              </Select>
              <Input.TextArea
                value={evaluationData[`specify_${bodyPart}`]?.note || ""}
                onChange={(e) => {
                  console.log("TextArea Value:", e.target.value);
                  // Updated handleNoteChange to remove the status from evaluationData
                  handleNoteChange(bodyPart, e.target.value);
                }}
                placeholder={`Add a note for ${bodyPart.replace(
                  "patient_",
                  ""
                )}...`}
                rows={3}
              />
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};

export default StatusPage;
