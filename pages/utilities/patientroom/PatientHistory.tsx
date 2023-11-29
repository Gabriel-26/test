import React, { useState, useEffect } from "react";
import { Divider, Typography, Card, Grid, Box } from "@mui/material";
import axiosInstance from "../../../src/components/utils/axiosInstance";

const PatientHistory = ({ patientData }) => {
  const { patient_id = "" } = patientData;

  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientHistory = async (patientID) => {
      try {
        const token = sessionStorage.getItem("authToken");
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        const phrResponse = await axiosInstance.get(
          `/attributeValues/getPHR/${patientID}`
        );

        const phrData = phrResponse.data;

        setPatientHistory(phrData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient history data:", error);
        setError(error);
        setLoading(false);
      }
    };

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

  const formatAttributeName = (categoryAtt_name) => {
    // Hardcoded attribute names for a more professional appearance
    const attributeNames = {
      bpSitting: "Blood Pressure (Sitting)",
      bpStanding: "Blood Pressure (Standing)",
      bpLying: "Blood Pressure (Lying)",
      hrRegular: "Heart Rate (Regular)",
      hrIrregular: "Heart Rate (Irregular)",
      rr: "Respiratory Rate",
      "T*": "Temperature",
      "Sp-02": "Oxygen Saturation",
      malignancy: "Malignancy",
      specifyMalignancy: "Specify Malignancy",
      surgeries: "Surgeries",
      specifySurgeries: "Specify Surgeries",
      tobacco: "Tobacco Use",
      tobaccoPacks: "Packs of Tobacco per Day",
      vaccinationHistory: "Vaccination History",
      tobaccoQuit: "Tobacco Quit",
      recDrugs: "Recreational Drugs",
      specifyRecDrugs: "Specify Recreational Drugs",
      alcohol: "Alcohol Consumption",
      alcoholDrinksFrequencyDay: "Alcohol Drinks per Day",
      alcoholDrinksFrequencyWeek: "Alcohol Drinks per Week",
      noOfAlcoholDrinks: "Number of Alcohol Drinks",
      specifyFamilialDisease: "Specify Familial Disease",
      specifyCivilStatus: "Specify Civil Status",
      specifyPertinentHistory: "Specify Pertinent History",
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
      specifyMassPresent: "Specify Mass Present",
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
      specifyAllergies: "Specify Allergies",
      PMH_CHF: "PMH - Congestive Heart Failure",
      PMH_otherIllness: "PMH - Other Illness",
      PMH_specifyOtherIllness: "PMH - Specify Other Illness",
      specifyPrevHospitalization: "Specify Previous Hospitalization",
      maintenanceMeds: "Maintenance Medications",
      specifyMaintenanceMeds: "Specify Maintenance Medications",
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
    const attributeName = categoryAtt_name.replace(/^phr_/, "");

    // Use the hardcoded name if available, otherwise use the original name
    return attributeNames[attributeName] || attributeName;
  };

  return (
    <Card style={{ padding: "20px", margin: "20px", borderRadius: "15px" }}>
      {Object.keys(groupedHistory).map((formCatName, index) => (
        <div key={index}>
          <Typography variant="h6" gutterBottom style={{ color: "#007bff" }}>
            {formCatName}
          </Typography>
          <Grid container spacing={2}>
            {groupedHistory[formCatName].map((historyEntry, idx) => (
              <Grid item xs={12} key={idx}>
                <Box
                  p={2}
                  bgcolor="#f7f7f7"
                  borderRadius="8px"
                  boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                >
                  <Typography variant="body2">
                    <strong>
                      {formatAttributeName(historyEntry.categoryAtt_name)}:
                    </strong>{" "}
                    {historyEntry.attributeVal_values}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Divider style={{ margin: "15px 0", backgroundColor: "#e0e0e0" }} />
        </div>
      ))}
    </Card>
  );
};

export default PatientHistory;
