import React, { useState, useEffect } from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  AutoComplete,
  Spin,
  Alert,
  message,
  Pagination,
  Modal,
} from "antd";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import moment, { Moment } from "moment-timezone";
import { MdAddCircle, MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import momentGenerateConfig from "rc-picker/lib/generate/moment";

const { Title } = Typography;
const { confirm } = Modal;
const MyDatePicker = DatePicker.generatePicker<Moment>(momentGenerateConfig);

const Medication = (props: any) => {
  const [form] = Form.useForm();
  const { patientId } = props;
  const [medications, setMedications] = useState([]);
  const [dosages, setDosages] = useState({});
  const [patientMedications, setPatientMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2); // Set the number of items per page
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const residentID = localStorage.getItem("resID");

  const handleAddModalOpen = () => {
    setAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    setAddModalVisible(false);
  };
  const handleEditModalClose = () => {
    setEditModalVisible(false);
  };

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/medicines");
      const medicationsData = response.data;
      setMedications(medicationsData);
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientMedications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/patientMedicines/patient/${patientId}`
      );
      // const patientMedicationsData = response.data;
      setPatientMedications(response.data);
    } catch (error) {
      console.error("Error fetching patient medications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMedicineChange = async (selectedMedicine) => {
    try {
      const response = await axiosInstance.get(
        `/medicines/${selectedMedicine}/dosages`
      );
      const dosagesData = response.data;

      setDosages({
        ...dosages,
        [selectedMedicine]: dosagesData,
      });

      form.setFieldsValue({ dosage: undefined });
    } catch (error) {
      console.error("Error fetching dosages:", error);
    }
  };

  const handleAddMedication = async (values, selectedDate) => {
    try {
      const selectedDateTime = selectedDate;
      const currentHour = moment().tz("Asia/Manila").hours();
      const currentMinute = moment().tz("Asia/Manila").minutes();

      selectedDateTime.set({
        hour: currentHour,
        minute: currentMinute,
        second: 0,
      });

      values.patientMedicineDate = selectedDateTime.format();
      values.patient_id = patientId;

      const disabledDate = (current) => {
        // Disable dates before today
        return current && current < moment().startOf("day");
      };

      const selectedMedicine = medications.find(
        (medication) => medication.medicine_name === values.medicine_id
      );

      if (selectedMedicine) {
        const response = await axiosInstance.post("/patientMedicines", {
          ...values,
          medicine_id: selectedMedicine.medicine_id,
        });

        if (response.status === 200) {
          const formattedDate = selectedDateTime.format("YYYY-MM-DD HH:mm:ss");

          console.log("Medication saved successfully.", {
            ...values,
            patientMedicineDate: formattedDate,
          });

          form.resetFields();
          handleAddModalClose();

          const updatedMedicationsResponse = await axiosInstance.get(
            `/patientMedicines/patient/${patientId}`
          );

          const updatedMedications = updatedMedicationsResponse.data;

          setPatientMedications(updatedMedications);

          message.success("Medication added successfully!");
        } else {
          console.error("Failed to save medication.");
          message.error("Failed to save medication. Please try again.");
        }
      } else {
        console.error("Selected medicine not found.");
        message.error("Selected medicine not found. Please try again.");
      }
    } catch (error) {
      console.error("Error saving medication:", error);
      message.error("Error saving medication. Please try again.");
    }
  };

  const handleEdit = (medication) => {
    console.log("Selected Medication for Edit:", medication);
    setSelectedMedication(medication);

    // Format the date to match the desired format
    const formattedDate = moment(medication.patientMedicineDate).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    form.setFieldsValue({
      medicine_id: medication.medicine_name,
      medicine_frequency: medication.medicine_frequency,
      patientMedicineDate: moment(formattedDate), // Convert to moment object
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values, selectedDate) => {
    try {
      console.log("Values before submission:", values);
      console.log("Selected Medication before submission:", selectedMedication);
      const selectedDateTime = selectedDate;
      const currentHour = moment().tz("Asia/Manila").hours();
      const currentMinute = moment().tz("Asia/Manila").minutes();

      selectedDateTime.set({
        hour: currentHour,
        minute: currentMinute,
        second: 0,
      });

      values.patientMedicineDate = selectedDateTime.format();
      values.patient_id = patientId;

      const selectedMedicine = medications.find(
        (medication) => medication.medicine_name === values.medicine_id
      );

      if (selectedMedicine) {
        const response = await axiosInstance.put(
          `/patientMedicines/${selectedMedication.patientMedicine_id}`,
          {
            ...values,
            medicine_id: selectedMedicine.medicine_id, // Update to use medicine_id
          }
        );

        if (response.status === 200) {
          const formattedDate = selectedDateTime.format("YYYY-MM-DD HH:mm:ss");

          console.log("Medication updated successfully.", {
            ...values,
            patientMedicineDate: formattedDate,
          });

          form.resetFields();
          setEditModalVisible(false);
          const updatedMedicationsResponse = await axiosInstance.get(
            `/patientMedicines/patient/${patientId}`
          );

          const updatedMedications = updatedMedicationsResponse.data;

          setPatientMedications(updatedMedications);
          message.success("Medication updated successfully!");
        } else {
          console.error("Failed to update medication.");
          message.error("Failed to update medication. Please try again.");
        }
      } else {
        console.error("Selected medicine not found.");
        message.error("Selected medicine not found. Please try again.");
      }
    } catch (error) {
      console.error("Error updating medication:", error);
      message.error("Error updating medication. Please try again.");
    }
  };

  const handleDeleteMedication = (medicationId) => {
    confirm({
      title: "Are you sure you want to delete this medication?",
      content: "This action cannot be undone.",
      okText: "Confirm",
      okType: "danger",
      onOk() {
        axiosInstance
          .delete(`/patientMedicines/${medicationId}`)
          .then((response) => {
            if (response.status === 200) {
              message.success("Medication deleted successfully!");
              const updatedMedications = patientMedications.filter(
                (medication) => medication.patientMedicine_id !== medicationId,

                console.log("Medication ID:", medicationId)
              );
              setPatientMedications(updatedMedications);
            } else {
              console.error("Failed to delete medication.");
              message.error("Failed to delete medication. Please try again.");
            }
          })
          .catch((error) => {
            console.error("Error deleting medication:", error);
            message.error("Failed to delete medication. Please try again.");
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // const isPastDeadline = (medicationDate) => {
  //   const currentDateTime = moment().tz("Asia/Manila");
  //   return moment(medicationDate).isBefore(currentDateTime);
  // };

  useEffect(() => {
    fetchMedications();
    fetchPatientMedications();
  }, [patientId]);

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <Modal
        title="Add Medication"
        open={addModalVisible}
        onCancel={handleAddModalClose}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(values) =>
            handleAddMedication(
              values,
              form.getFieldValue("patientMedicineDate")
            )
          }
          layout="vertical"
          style={{ marginBottom: "16px" }}
          onValuesChange={(changedValues) => {
            if ("medicine" in changedValues) {
              handleMedicineChange(changedValues.medicine);
            }
          }}
        >
          <Form.Item
            label="Medicine"
            name="medicine_id"
            rules={[{ required: true, message: "Please select medicine" }]}
          >
            <AutoComplete
              placeholder="Type to search and select a medicine"
              filterOption={(inputValue, option) =>
                option?.value
                  ?.toString()
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
              onSelect={(value, option) => {
                form.setFieldsValue({
                  medicine_id: value,
                });
              }}
            >
              {medications.map((medication, index) => (
                <AutoComplete.Option
                  key={index}
                  value={medication.medicine_name}
                >
                  {medication.medicine_name}
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          </Form.Item>

          <Form.Item
            label="Frequency"
            name="medicine_frequency"
            rules={[{ required: true, message: "Please select frequency" }]}
          >
            <Select placeholder="Select frequency">
              <Select.Option value="Daily">Daily</Select.Option>
              <Select.Option value="Every other day">
                Every other day
              </Select.Option>
              <Select.Option value="BID/b.i.d. (Twice a day)">
                BID/b.i.d. (Twice a day)
              </Select.Option>
              <Select.Option value="TID/t.i.d. (Three times a day)">
                TID/t.i.d (Three times a day)
              </Select.Option>
              <Select.Option value="QID/q.i.d. (Four times a day">
                QID/q.i.d (Four times a day).
              </Select.Option>
              <Select.Option value="QHS (Every bedtime)">
                QHS (Every bedtime)
              </Select.Option>
              <Select.Option value="Q4h (Every 4 hours)">
                Q4h (Every 4 hours)
              </Select.Option>
              <Select.Option value="Q4-6h (Every 4 to 6 hours)">
                Q4-6h (Every 4 to 6 hours)
              </Select.Option>
              <Select.Option value="QWK (Every week)">
                QWK (Every week)
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Patient Medicine Date"
            name="patientMedicineDate"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <MyDatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Add Medication
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Medication"
        open={editModalVisible}
        onCancel={handleEditModalClose}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(values) =>
            handleEditSubmit(values, form.getFieldValue("patientMedicineDate"))
          }
          layout="vertical"
          style={{ marginBottom: "16px" }}
          onValuesChange={(changedValues) => {
            if ("medicine" in changedValues) {
              handleMedicineChange(changedValues.medicine);
            }
          }}
        >
          <Form.Item
            label="Medicine"
            name="medicine_id"
            rules={[{ required: true, message: "Please select medicine" }]}
          >
            <AutoComplete
              placeholder="Type to search and select a medicine"
              filterOption={(inputValue, option) =>
                option?.value
                  ?.toString()
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
              onSelect={(value, option) => {
                form.setFieldsValue({
                  medicine_id: value,
                });
              }}
            >
              {medications.map((medication, index) => (
                <AutoComplete.Option
                  key={index}
                  value={medication.medicine_name}
                >
                  {medication.medicine_name}
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          </Form.Item>

          <Form.Item
            label="Frequency"
            name="medicine_frequency"
            rules={[{ required: true, message: "Please select frequency" }]}
          >
            <Select placeholder="Select frequency">
              <Select.Option value="Daily">Daily</Select.Option>
              <Select.Option value="Every other day">
                Every other day
              </Select.Option>
              <Select.Option value="BID/b.i.d. (Twice a day)">
                BID/b.i.d. (Twice a day)
              </Select.Option>
              <Select.Option value="TID/t.i.d. (Three times a day)">
                TID/t.i.d (Three times a day)
              </Select.Option>
              <Select.Option value="QID/q.i.d. (Four times a day">
                QID/q.i.d (Four times a day).
              </Select.Option>
              <Select.Option value="QHS (Every bedtime)">
                QHS (Every bedtime)
              </Select.Option>
              <Select.Option value="Q4h (Every 4 hours)">
                Q4h (Every 4 hours)
              </Select.Option>
              <Select.Option value="Q4-6h (Every 4 to 6 hours)">
                Q4-6h (Every 4 to 6 hours)
              </Select.Option>
              <Select.Option value="QWK (Every week)">
                QWK (Every week)
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Patient Medicine Date"
            name="patientMedicineDate"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <MyDatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Update Medication
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title
            level={3}
            style={{ marginTop: "26px", display: "inline-block" }}
          >
            Patient's Medication{" "}
          </Title>
          <Button
            icon={<MdAddCircle style={{ fontSize: "22px" }} />}
            onClick={handleAddModalOpen}
            style={{ marginTop: "26px", marginLeft: "8px" }}
          ></Button>
        </div>
        {loading ? (
          <Spin size="large" />
        ) : patientMedications.length > 0 ? (
          <div>
            {patientMedications
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((medication, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ecf0f1",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "20px",
                    background: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        color: "#3498db",
                        marginBottom: "8px",
                        fontSize: "18px",
                      }}
                    >
                      {`Medicine: ${medication.medicine_name}`}
                    </p>
                    <div>
                      <Button
                        icon={<FiEdit style={{ fontSize: "20px" }} />}
                        key="edit"
                        onClick={() => handleEdit(medication)}
                      ></Button>
                      <Button
                        icon={<MdDelete style={{ fontSize: "20px" }} />}
                        key="delete"
                        onClick={() =>
                          handleDeleteMedication(medication.patientMedicine_id)
                        }
                        danger
                      ></Button>
                    </div>
                  </div>
                  {/* Display Resident ID */}
                  {/* <p style={{ marginBottom: "8px" }}>
                    {`Added by: ${residentID}`}
                  </p> */}
                  {/* Render indicator if medication date is past the deadline */}
                  {new Date(medication.patientMedicineDate) < new Date() && (
                    <p style={{ color: "red" }}>
                      {`Medication Status: Past Deadline`}
                    </p>
                  )}
                  <p style={{ marginBottom: "8px" }}>
                    {`Type: ${medication.medicine_type}`}
                  </p>
                  <p style={{ marginBottom: "8px" }}>
                    {`Frequency: ${medication.medicine_frequency}`}
                  </p>
                  {/* <p style={{ marginBottom: "8px" }}>
                    {`Patient ID: ${medication.patient_id}`}
                  </p> */}
                  <p style={{ marginBottom: "8px" }}>
                    {`Date: ${new Date(
                      medication.patientMedicineDate
                    ).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      timeZone: "Asia/Manila",
                    })}`}
                  </p>
                  <p style={{ marginBottom: "8px" }}>
                    {`Created At: ${new Date(
                      medication.created_at
                    ).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })}`}
                  </p>
                  <p style={{ marginBottom: "8px" }}>
                    {`Updated At: ${new Date(
                      medication.updated_at
                    ).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })}`}
                  </p>
                </div>
              ))}
            <Pagination
              current={currentPage}
              total={patientMedications.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              style={{
                marginTop: "16px",
                textAlign: "center",
              }}
            />
          </div>
        ) : (
          <Alert
            message="No Medications Found"
            description="There are no medications recorded for this patient."
            type="info"
            // style={{ maxWidth: "800px", margin: "auto", marginBottom: "40px" }}
          />
        )}
      </div>
    </div>
  );
};

export default Medication;
