import React, { useState, useEffect } from "react";
import {
  Divider,
  Typography,
  Card,
  Grid,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextField,
} from "@mui/material";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PatientHistory = ({ patientData }) => {
  const { patient_id = "" } = patientData;

  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null); // Entry being edited
  const [editedValue, setEditedValue] = useState("");
  // Function to fetch patient history
  const fetchPatientHistory = async (patientID) => {
    try {
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const phrResponse = await axiosInstance.get(
        `/attributeValues/getPHR/${patientID}`
      );

      const phrData = phrResponse.data;
      console.log(phrData);
      setPatientHistory(phrData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient history data:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patient_id) {
      console.log("Fetching patient history for patient ID:", patient_id);
      fetchPatientHistory(patient_id);
    }
  }, [patient_id]);

  // Group entries by formCat_name
  const groupedHistory = patientHistory.reduce((acc, entry) => {
    const { formCat_name } = entry;
    if (!acc[formCat_name]) {
      acc[formCat_name] = [];
    }
    acc[formCat_name].push(entry);
    return acc;
  }, {});

  const booleanAttributes = [
    "malignancy",
    "surgeries",
    "tobacco",
    "recDrugs",
    "phr_height",
    "phr_weight",
    "phr_BMI",
    "phr_bodyHabitusWNL",
    "phr_bodyHabitusCathetic",
    "phr_bodyHabitusObese",
    "phr_liverAndSpleenPalpableAndWNL",
    "phr_medRecords",
    "phr_vaccinationStatus",
    "phr_assessment",
    "alcohol",
    "historyOfPresentIllness",
    "nasalMucosaSeptumTurbinatesWNL",
    "nasalMucosaSeptumTurbinatesEdeOrEryPresent",
    "mallampati1",
    "mallampati2",
    "mallampati3",
    "mallampati4",
    "dentionAndGumsWNL",
    "dentionAndGumsDentalCanes",
    "dentionAndGumsGingivitis",
    "oropharynxWNL",
    "oropharynxEdeOrEryPresent",
    "oropharynxOralUlcers",
    "oropharynxOralPetachie",
    "neckWNL",
    "neckLymphadenopathy",
    "thyroidWNL",
    "thyroidThyromegaly",
    "thyroidNodulesPalpable",
    "thyroidNeckMass",
    "jugularVeinsWNL",
    "jugularVeinsEngorged",
    "chestExpansionAndSymmetrical",
    "respiratoryEffortWNL",
    "chestPercussionHyperResonance",
    "AuscultationWNL",
    "AuscultationBronchialBreathSounds",
    "AuscultationEgophony",
    "AuscultationRhonchi",
    "AuscultationRales",
    "AuscultationWheezes",
    "AuscultationRub",
    "respiratoryEffortAccessoryMuscleUse",
    "respiratoryEffortIntercostalRetractions",
    "respiratoryEffortParadoxicMovements",
    "tactileFremitusWNL",
    "tactileFremitusIncreased",
    "tactileFremitusDecreased",
    "chestPercussionWNL",
    "chestPercussionDullnessToPercussion",
    "heartSoundsClearS1",
    "heartSoundsClearS2",
    "heartSoundsNoMurmur",
    "heartSoundsGallopAudible",
    "heartSoundsRubAudible",
    "heartSoundsMurmursPresent",
    "heartSoundsSystolic",
    "heartSoundsDiastolic",
    "abdomenWNL",
    "massPresent",
    "organomegalySpleen",
    "bowelSoundsNormaoactive",
    "bowelSoundsUp",
    "bowelSoundsDown",
    "unableToPalpateLiver",
    "unableToPalpateSpleen",
    "organomegalyLiver",
    "kidneyPunchSignNegative",
    "kidneyPunchSignPositive",
    "IfPositiveR",
    "IfPositiveL",
    "extremitiesWNL",
    "extremitiesClubbing",
    "extremitiesCyanosis",
    "extremitiesPetachiae",
    "skinWNL",
    "skinRash",
    "skinEccymosis",
    "skinNodules",
    "skinUlcer",
    "allergies",
    "PMH_CHF",
    "PMH_otherIllness",
    "PMH_Asthma",
    "PMH_HTN",
    "PMH_Thyroid",
    "PMH_Diabetes",
    "PMH_HepaticRenal",
    "PMH_Tuberculosis",
    "PMH_Psychiatric",
    "PMH_CAD",
  ];

  const formatAttributeName = (categoryAtt_name, attributeVal_values) => {
    // Hardcoded attribute names for a more professional appearance

    const attributeNames = {
      bpSitting: "Blood Pressure (Sitting)",
      bpStanding: "Blood Pressure (Standing)",
      bpLying: "Blood Pressure (Lying)",
      chiefComplaint: "Chief Complaint",
      nonVerbalPatient: "Non Verbal Patient",
      endTime: "End Time",
      startTime: "Start Time",
      hrRegular: "Heart Rate (Regular)",
      hrIrregular: "Heart Rate (Irregular)",
      rr: "Respiratory Rate",
      "T*": "Temperature",
      "Sp-02": "Oxygen Saturation",
      malignancy: "Malignancy",
      assessment: "Assessment",
      height: "Height",
      weight: "Weight",
      BMI: "BMI",
      vaccinationStatus: "Vaccination History",
      historyOfPresentIllness: "History of Present Illness",
      specifyMalignancy: "Additional Information on Malignancy",
      surgeries: "Surgeries",
      specifySurgeries: "Additional Information on Surgeries",
      tobacco: "Tobacco Use",
      tobaccoPacks: "Packs of Tobacco per Day",
      vaccinationHistory: "Vaccination History",
      tobaccoQuit: "Tobacco Quit",
      recDrugs: "Recreational Drugs",
      specifyRecDrugs: "Additional Information on Recreational Drugs",
      alcohol: "Alcohol Consumption",
      alcoholDrinksFrequencyDay: "Alcohol Drinks per Day",
      alcoholDrinksFrequencyWeek: "Alcohol Drinks per Week",
      noOfAlcoholDrinks: "Number of Alcohol Drinks",
      specifyFamilialDisease: "Additional Information on Familial Disease",
      specifyCivilStatus: "Additional Information on Civil Status",
      specifyPertinentHistory: "Additional Information on Pertinent History",
      nasalMucosaSeptumTurbinatesWNL:
        "Nasal Mucosa, Septum, Turbinates - Within Normal Limits",
      nasalMucosaSeptumTurbinatesEdeOrEryPresent:
        "Nasal Mucosa, Septum, Turbinates - Edema or Erythema Present",
      mallampati1: "Mallampati Class 1",
      mallampati2: "Mallampati Class 2",
      mallampati3: "Mallampati Class 3",
      mallampati4: "Mallampati Class 4",
      dentionAndGumsWNL: "Dentition and Gums - Within Normal Limits",
      dentionAndGumsDentalCanes: "Dentition and Gums - Dental Caries Present",
      dentionAndGumsGingivitis: "Dentition and Gums - Gingivitis Present",
      oropharynxWNL: "Oropharynx - Within Normal Limits",
      oropharynxEdeOrEryPresent: "Oropharynx - Edema or Erythema Present",
      oropharynxOralUlcers: "Oropharynx - Oral Ulcers Present",
      oropharynxOralPetachie: "Oropharynx - Oral Petechiae Present",
      neckWNL: "Neck - Within Normal Limits",
      neckLymphadenopathy: "Neck - Lymphadenopathy Present",
      thyroidWNL: "Thyroid - Within Normal Limits",
      thyroidThyromegaly: "Thyroid - Thyromegaly Present",
      thyroidNodulesPalpable: "Thyroid - Nodules Palpable",
      thyroidNeckMass: "Thyroid - Neck Mass Present",
      jugularVeinsWNL: "Jugular Veins - Within Normal Limits",
      jugularVeinsEngorged: "Jugular Veins - Engorged",
      chestExpansionAndSymmetrical: "Chest Expansion - Symmetrical",
      respiratoryEffortWNL: "Respiratory Effort - Within Normal Limits",
      chestPercussionHyperResonance: "Chest Percussion - Hyperresonance",
      AuscultationWNL: "Auscultation - Within Normal Limits",
      AuscultationBronchialBreathSounds:
        "Auscultation - Bronchial Breath Sounds Present",
      AuscultationEgophony: "Auscultation - Egophony Present",
      AuscultationRhonchi: "Auscultation - Rhonchi Present",
      AuscultationRales: "Auscultation - Rales Present",
      AuscultationWheezes: "Auscultation - Wheezes Present",
      AuscultationRub: "Auscultation - Rub Present",
      RespiratoryAdditionalFindings: "Respiratory Additional Findings",
      respiratoryEffortAccessoryMuscleUse:
        "Respiratory Effort - Accessory Muscle Use Present",
      respiratoryEffortIntercostalRetractions:
        "Respiratory Effort - Intercostal Retractions Present",
      respiratoryEffortParadoxicMovements:
        "Respiratory Effort - Paradoxical Movements Present",
      tactileFremitusWNL: "Tactile Fremitus - Within Normal Limits",
      tactileFremitusIncreased: "Tactile Fremitus - Increased",
      tactileFremitusDecreased: "Tactile Fremitus - Decreased",
      chestPercussionWNL: "Chest Percussion - Within Normal Limits",
      chestPercussionDullnessToPercussion:
        "Chest Percussion - Dullness to Percussion Present",
      heartSoundsClearS1: "Heart Sounds - Clear S1",
      heartSoundsClearS2: "Heart Sounds - Clear S2",
      heartSoundsNoMurmur: "Heart Sounds - No Murmur",
      heartSoundsGallopAudible: "Heart Sounds - Gallop Audible",
      heartSoundsRubAudible: "Heart Sounds - Rub Audible",
      heartSoundsMurmursPresent: "Heart Sounds - Murmurs Present",
      heartSoundsSystolic: "Heart Sounds - Systolic Murmur",
      heartSoundsDiastolic: "Heart Sounds - Diastolic Murmur",
      grade: "Grade",
      CardiovascularAdditionalFindings: "Cardiovascular Additional Findings",
      abdomenWNL: "Abdomen - Within Normal Limits",
      massPresent: "Mass Present",
      organomegalySpleen: "Organomegaly - Spleen",
      DREFindings: "DRE Findings",
      specifyMassPresent: "Additional Information on Mass Present",
      bowelSoundsNormaoactive: "Bowel Sounds - Normoactive",
      bowelSoundsUp: "Bowel Sounds - Up",
      bowelSoundsDown: "Bowel Sounds - Down",
      unableToPalpateLiver: "Unable to Palpate Liver",
      unableToPalpateSpleen: "Unable to Palpate Spleen",
      organomegalyLiver: "Organomegaly - Liver",
      kidneyPunchSignNegative: "Kidney Punch Sign - Negative",
      kidneyPunchSignPositive: "Kidney Punch Sign - Positive",
      IfPositiveR: "If Positive - Right",
      IfPositiveL: "If Positive - Left",
      extremitiesWNL: "Extremities - Within Normal Limits",
      extremitiesClubbing: "Extremities - Clubbing",
      extremitiesCyanosis: "Extremities - Cyanosis",
      extremitiesPetachiae: "Extremities - Petechiae",
      capillaryRefillTime: "Capillary Refill Time",
      skinWNL: "Skin - Within Normal Limits",
      skinRash: "Skin - Rash Present",
      skinEccymosis: "Skin - Ecchymosis Present",
      skinNodules: "Skin - Nodules Present",
      skinUlcer: "Skin - Ulcer Present",
      allergies: "Allergies",
      specifyAllergies: "Additional Information on Allergies",
      PMH_CHF: "PMH - Congestive Heart Failure",
      PMH_otherIllness: "PMH - Other Illness",
      PMH_specifyOtherIllness: "PMH - Specify Other Illness",
      specifyPrevHospitalization:
        "Additional Information on Previous Hospitalization",
      maintenanceMeds: "Maintenance Medications",
      specifyMaintenanceMeds:
        "Additional Information on Maintenance Medications",
      PMH_Asthma: "PMH - Asthma",
      PMH_HTN: "PMH - Hypertension",
      PMH_Thyroid: "PMH - Thyroid Disorders",
      PMH_Diabetes: "PMH - Diabetes",
      PMH_HepaticRenal: "PMH - Hepatic/Renal Disorders",
      PMH_Tuberculosis: "PMH - Tuberculosis",
      PMH_Psychiatric: "PMH - Psychiatric Disorders",
      PMH_CAD: "PMH - Coronary Artery Disease",
      // ... (add more attribute names as needed)
    };

    // Extracting the relevant part from categoryAtt_name

    // Extracting the relevant part from categoryAtt_name
    const attributeName = categoryAtt_name.replace(/^phr_/, "");

    // Check if the attribute is in the list of boolean attributes
    // if (booleanAttributes.includes(attributeName)) {
    //   // Map the attribute value to "Yes" or "No"
    //   return `${attributeName}: ${attributeVal_values === "1" ? "Yes" : "No"}`;
    // }

    // Use the hardcoded name if available, otherwise use the original name
    return attributeNames[attributeName] || attributeName;
  };

  const startEditing = (entry) => {
    // Convert 1 or 0 to "Yes" or "No" if it's a boolean attribute
    const editedValue = booleanAttributes.includes(
      entry.categoryAtt_name.replace(/^phr_/, "")
    )
      ? entry.attributeVal_values === "1"
        ? "Yes"
        : "No"
      : entry.attributeVal_values;
    setEditedValue(editedValue);
    setEditingEntry(entry);
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditedValue("");
    setEditingEntry(null);
  };

  // Function to save edited value
  const saveEditedValue = async () => {
    try {
      const token = localStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // Convert "Yes" or "No" back to 1 or 0 if it's a boolean attribute
      const valueToSave = booleanAttributes.includes(
        editingEntry.categoryAtt_name.replace(/^phr_/, "")
      )
        ? editedValue === "Yes"
          ? "1"
          : "0"
        : editedValue;

      await axiosInstance.put(
        `/attributeValues/${patient_id}/updateField/${editingEntry.attributeVal_id}`,
        {
          attributeVal_values: valueToSave,
        }
      );

      // Refresh patient history data after edit
      await fetchPatientHistory(patient_id);

      // Reset edit state
      cancelEditing();
    } catch (error) {
      console.error("Error updating patient history:", error);
      // Handle error...
    }
  };

  return (
    <Card style={{ padding: "20px", margin: "20px", borderRadius: "15px" }}>
      {Object.keys(groupedHistory).length === 0 ? (
        <Typography variant="body1">
          There is no data on this patient.
        </Typography>
      ) : (
        Object.keys(groupedHistory).map((formCatName, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" style={{ color: "#007bff" }}>
                {formCatName}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {groupedHistory[formCatName].map((historyEntry, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Box
                      p={2}
                      bgcolor="#f7f7f7"
                      borderRadius="8px"
                      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                    >
                      {editingEntry &&
                      editingEntry.attributeVal_id ===
                        historyEntry.attributeVal_id ? (
                        <>
                          <TextField
                            label={formatAttributeName(
                              historyEntry.categoryAtt_name,
                              historyEntry.attributeVal_values
                            )}
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            fullWidth
                          />
                          <Button
                            onClick={saveEditedValue}
                            variant="contained"
                            style={{
                              backgroundColor: "#0096FF	",
                              // "&:hover": { backgroundColor: "orange" },
                            }}
                          >
                            Save
                          </Button>
                          <Button onClick={cancelEditing} variant="outlined">
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2">
                            <strong>
                              {formatAttributeName(
                                historyEntry.categoryAtt_name,
                                historyEntry.attributeVal_values
                              )}
                              :
                            </strong>{" "}
                            {/* Display "Yes" or "No" for boolean attributes */}
                            {booleanAttributes.includes(
                              historyEntry.categoryAtt_name.replace(/^phr_/, "")
                            )
                              ? historyEntry.attributeVal_values === "1"
                                ? "Yes"
                                : "No"
                              : historyEntry.attributeVal_values}
                          </Typography>
                          <Button
                            onClick={() => startEditing(historyEntry)}
                            variant="outlined"
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
            <Divider style={{ margin: "15px 0", backgroundColor: "#e0e0e0" }} />
          </Accordion>
        ))
      )}
    </Card>
  );
};

export default PatientHistory;
