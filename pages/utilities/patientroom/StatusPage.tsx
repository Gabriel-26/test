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

  const formatBodyPart = (bodyPart) => {
    const formattedPart = bodyPart.replace("patient_", "");
    const spacedPart = formattedPart
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
      .toLowerCase(); // Convert to lowercase
    return spacedPart.charAt(0).toUpperCase() + spacedPart.slice(1);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/physicalExam/values/getPE/${patientId}`
        );

        if (!Array.isArray(response.data)) {
          console.error("Error: Response data is not an array.", response.data);
          setEvaluationData({});
          return;
        }

        const responseDataMap = response.data.reduce((acc, item) => {
          const attributeName = item.attribute_Name;
          if (!attributeName) {
            console.error(
              "Error: Missing attribute_Name property in response item.",
              item
            );
            return acc;
          }

          const isSpecifyAttribute = attributeName.startsWith("specify_");
          const value = item.value || "";
          const specifyValue = item.specify_value || "";

          if (isSpecifyAttribute) {
            acc[attributeName] = { note: value };
          } else {
            acc[attributeName] = { status: value, note: specifyValue };
          }

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

  return (
    <div>
      <h1>Status and Notes Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Collapse accordion>
          {bodyParts.map((bodyPart) => (
            <Panel key={bodyPart} header={formatBodyPart(bodyPart)}>
              <Select
                value={
                  evaluationData && evaluationData[bodyPart]
                    ? evaluationData[bodyPart].status || "None"
                    : "None"
                }
                onChange={(value) => {
                  handleStatusChange(bodyPart, value);
                }}
                style={{ width: "200px", marginBottom: "8px" }}
              >
                <Option value="None">None</Option>
                <Option value="Normal">Normal</Option>
                <Option value="Abnormal">Abnormal</Option>
                <Option value="Needs Attention">Needs Attention</Option>
              </Select>
              <Input.TextArea
                value={evaluationData[`specify_${bodyPart}`]?.note || ""}
                onChange={(e) => {
                  handleNoteChange(bodyPart, e.target.value);
                }}
                placeholder={`Add a note for ${formatBodyPart(bodyPart)}...`}
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
