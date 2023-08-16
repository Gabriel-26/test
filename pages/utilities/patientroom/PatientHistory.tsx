import React, { useState, useEffect } from "react";
import { Divider, Grid, Paper, Typography } from "@mui/material";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { useRouter } from "next/router";
import { Row, Col } from "antd";

const fieldDisplayNames = {
  phr_chiefComaplaint: "Chief Complaint",
  phr_startTime: "Start Time",
  phr_endTime: "End Time",
  phr_historyOfPresentIllness: "History of Present Illness",
  phr_nonVerbalPatient: "Non-Verbal Patient",
  phr_HxFromParent: "History from Parent",
  phr_HxFromFamily: "History from Family",
  phr_medRecAvailable: "Medical Records Available",
  phr_PMH_Asthma: "Past Medical History - Asthma",
  phr_PMH_HTN: "Past Medical History - Hypertension",
  phr_PMH_Thyroid: "Past Medical History - Thyroid",
  phr_PMH_Diabetes: "Past Medical History - Diabetes",
  phr_PMH_HepaticRenal: "Past Medical History - Hepatic/Renal",
  phr_PMH_Tuberculosis: "Past Medical History - Tuberculosis",
  phr_PMH_Psychiatric: "Past Medical History - Psychiatric",
  phr_PMH_CAD: "Past Medical History - Coronary Artery Disease",
  phr_PMH_CHF: "Past Medical History - Congestive Heart Failure",
  phr_PMH_otherIllness: "Past Medical History - Other Illness",
  phr_PMH_specifyOtherIllness: "Past Medical History - Specify Other Illness",
  phr_allergies: "Allergies",
  phr_specifyAllergies: "Specify Allergies",
  phr_specifyPrevHospitalization: "Specify Previous Hospitalization",
  phr_maintenanceMeds: "Maintenance Medications",
  phr_specifyMaintenanceMeds: "Specify Maintenance Medications",
  phr_malignancy: "Malignancy",
  phr_specifyMalignancy: "Specify Malignancy",
  phr_surgeries: "Surgeries",
  phr_specifySurgeries: "Specify Surgeries",
  phr_vaccinationHistory: "Vaccination History",
  phr_tobacco: "Tobacco",
  phr_tobaccoPacks: "Tobacco Packs",
  phr_tobaccoQuit: "Tobacco Quit",
  phr_recDrugs: "Recreational Drugs",
  phr_specifyRecDrugs: "Specify Recreational Drugs",
  phr_alcohol: "Alcohol",
  phr_alcoholDrinksFrequencyDay: "Alcohol Drinks Frequency (Day)",
  phr_alcoholDrinksFrequencyWeek: "Alcohol Drinks Frequency (Week)",
  phr_noOfAlcoholDrinks: "Number of Alcohol Drinks",
  phr_specifyFamilialDisease: "Specify Familial Disease",
  phr_specifyCivilStatus: "Specify Civil Status",
  phr_specifyPertinentHistory: "Specify Pertinent History",
  phr_bpSitting: "Blood Pressure (Sitting)",
  phr_bpStanding: "Blood Pressure (Standing)",
  phr_bpLying: "Blood Pressure (Lying)",
  phr_hrRegular: "Heart Rate (Regular)",
  phr_hrIrregular: "Heart Rate (Irregular)",
  phr_rr: "Respiratory Rate",
  'phr_T*': "Temperature",
  'phr_Sp-02' : "Oxygen Saturation (SpO2)",
  phr_bodyHabitusWNL: "Body Habitus - Within Normal Limits",
  phr_bodyHabitusCathetic: "Body Habitus - Cachetic",
  phr_bodyHabitusObese: "Body Habitus - Obese",
  phr_heightCM: "Height (cm)",
  phr_weightKG: "Weight (kg)",
  phr_BMI: "Body Mass Index (BMI)",
  phr_nasalMucosaSeptumTurbinatesWNL: "Nasal Mucosa/Septum/Turbinates - Within Normal Limits",
  phr_nasalMucosaSeptumTurbinatesEdeOrEryPresent: "Nasal Mucosa/Septum/Turbinates - Edema or Erythema Present",
  phr_dentionAndGumsWNL: "Dentition and Gums - Within Normal Limits",
  phr_dentionAndGumsDentalCanes: "Dentition and Gums - Dental Caries Present",
  phr_dentionAndGumsGingivitis: "Dentition and Gums - Gingivitis Present",
  phr_oropharynxWNL: "Oropharynx - Within Normal Limits",
  phr_oropharynxEdeOrEryPresent: "Oropharynx - Edema or Erythema Present",
  phr_oropharynxOralUlcers: "Oropharynx - Oral Ulcers Present",
  phr_oropharynxOralPetachie: "Oropharynx - Oral Petechiae Present",
  phr_mallampati1: "Mallampati Score 1",
  phr_mallampati2: "Mallampati Score 2",
  phr_mallampati3: "Mallampati Score 3",
  phr_mallampati4: "Mallampati Score 4",
  phr_neckWNL: "Neck - Within Normal Limits",
  phr_neckLymphadenopathy: "Neck - Lymphadenopathy Present",
  phr_thyroidWNL: "Thyroid - Within Normal Limits",
  phr_thyroidThyromegaly: "Thyroid - Thyromegaly Present",
  phr_thyroidNodulesPalpable: "Thyroid - Nodules Palpable",
  phr_thyroidNeckMass: "Thyroid - Neck Mass Present",
  phr_jugularVeinsWNL: "Jugular Veins - Within Normal Limits",
  phr_jugularVeinsEngorged: "Jugular Veins - Engorged",
  phr_chestExpansionAndSymmetrical: "Chest Expansion - Symmetrical",
  phr_respiratoryEffortWNL: "Respiratory Effort - Within Normal Limits",
  phr_respiratoryEffortAccessoryMuscleUse: "Respiratory Effort - Accessory Muscle Use Present",
  phr_respiratoryEffortIntercostalRetractions: "Respiratory Effort - Intercostal Retractions Present",
  phr_respiratoryEffortParadoxicMovements: "Respiratory Effort - Paradoxical Movements Present",
  phr_chestPercussionWNL: "Chest Percussion - Within Normal Limits",
  phr_chestPercussionDullnessToPercussion: "Chest Percussion - Dullness to Percussion Present",
  phr_chestPercussionHyperResonance: "Chest Percussion - Hyperresonance Present",
  phr_tactileFremitusWNL: "Tactile Fremitus - Within Normal Limits",
  phr_tactileFremitusIncreased: "Tactile Fremitus - Increased",
  phr_tactileFremitusDecreased: "Tactile Fremitus - Decreased",
  phr_AuscultationWNL: "Auscultation - Within Normal Limits",
  phr_AuscultationBronchialBreathSounds: "Auscultation - Bronchial Breath Sounds Present",
  phr_AuscultationEgophony: "Auscultation - Egophony Present",
  phr_AuscultationRales: "Auscultation - Rales Present",
  phr_AuscultationRhonchi: "Auscultation - Rhonchi Present",
  phr_AuscultationWheezes: "Auscultation - Wheezes Present",
  phr_AuscultationRub: "Auscultation - Rub Present",
  phr_CardiovascularAdditionalFindings: "Cardiovascular - Additional Findings",
  phr_heartSoundsClearS1: "Heart Sounds - Clear S1",
  phr_heartSoundsClearS2: "Heart Sounds - Clear S2",
  phr_heartSoundsNoMurmur: "Heart Sounds - No Murmur",
  phr_heartSoundsGallopAudible: "Heart Sounds - Gallop Audible",
  phr_heartSoundsRubAudible: "Heart Sounds - Rub Audible",
  phr_heartSoundsMurmursPresent: "Heart Sounds - Murmurs Present",
  phr_heartSoundsSystolic: "Heart Sounds - Systolic Murmurs Present",
  phr_heartSoundsDiastolic: "Heart Sounds - Diastolic Murmurs Present",
  phr_grade: "Grade",
  phr_RespiratoryAdditionalFindings: "Respiratory - Additional Findings",
  phr_abdomenWNL: "Abdomen - Within Normal Limits",
  phr_massPresent: "Mass Present",
  phr_specifyMassPresent: "Specify Mass Present",
  phr_bowelSoundsNormaoactive: "Bowel Sounds - Normoactive",
  phr_bowelSoundsUp: "Bowel Sounds - Increased",
  phr_bowelSoundsDown: "Bowel Sounds - Decreased",
  phr_unableToPalpateLiver: "Unable to Palpate Liver",
  phr_unableToPalpateSpleen: "Unable to Palpate Spleen",
  phr_organomegalyLiver: "Organomegaly - Liver",
  phr_organomegalySpleen: "Organomegaly - Spleen",
  phr_DREFindings: "DRE Findings",
  phr_kidneyPunchSignNegative: "Kidney Punch Sign - Negative",
  phr_kidneyPunchSignPositive: "Kidney Punch Sign - Positive",
  phr_IfPositiveR: "If Positive - Right",
  phr_IfPositiveL: "If Positive - Left",
  phr_extremitiesWNL: "Extremities - Within Normal Limits",
  phr_extremitiesClubbing: "Extremities - Clubbing Present",
  phr_extremitiesCyanosis: "Extremities - Cyanosis Present",
  phr_extremitiesPetachiae: "Extremities - Petechiae Present",
  phr_capillaryRefillTime: "Capillary Refill Time",
  phr_skinWNL: "Skin - Within Normal Limits",
  phr_skinRash: "Skin - Rash Present",
  phr_skinEccymosis: "Skin - Ecchymosis Present",
  phr_skinNodules: "Skin - Nodules Present",
  phr_skinUlcer: "Skin - Ulcer Present",
  phr_Assessment: "Assessment",

};

const PatientHistory = () => {
  const router = useRouter();
  const { room_id } = router.query; // Get the room_id from the query parameters

  // Step 1: State to store patient history data
  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fields you want to display
  const categorizedFields = {
    General: {
      title: "General Information",
      fields: [
        "phr_chiefComaplaint",
        "phr_startTime",
        "phr_endTime",
        "phr_historyOfPresentIllness",
        "phr_nonVerbalPatient",
        "phr_HxFromParent",
        "phr_HxFromFamily",
        "phr_medRecAvailable",
        // ... Other general fields
      ],
    },
    MedicalHistory: {
      title: "Medical History",
      fields: [
        "phr_PMH_Asthma",
        "phr_PMH_HTN",
        "phr_PMH_Thyroid",
        "phr_PMH_Diabetes",
        "phr_PMH_HepaticRenal",
        "phr_PMH_Tuberculosis",
        "phr_PMH_Psychiatric",
        "phr_PMH_CAD",
        "phr_PMH_CHF",
        "phr_PMH_otherIllness",
        "phr_PMH_specifyOtherIllness",
        // ... Other medical history fields
      ],
    },
    AllergiesAndHabits: {
      title: "Allergies and Habits",
      fields: [
        "phr_allergies",
        "phr_specifyAllergies",
        "phr_specifyPrevHospitalization",
        "phr_maintenanceMeds",
        "phr_specifyMaintenanceMeds",
        "phr_malignancy",
        "phr_specifyMalignancy",
        "phr_surgeries",
        "phr_specifySurgeries",
        "phr_vaccinationHistory",
        "phr_tobacco",
        "phr_tobaccoPacks",
        "phr_tobaccoQuit",
        "phr_recDrugs",
        "phr_specifyRecDrugs",
        "phr_alcohol",
        "phr_alcoholDrinksFrequencyDay",
        "phr_alcoholDrinksFrequencyWeek",
        "phr_noOfAlcoholDrinks",
        "phr_specifyFamilialDisease",
        "phr_specifyCivilStatus",
        "phr_specifyPertinentHistory",
        // ... Other allergies and habits fields
      ],
    },
    VitalSigns: {
      title: "Vital Signs",
      fields: [
        "phr_bpSitting",
        "phr_bpStanding",
        "phr_bpLying",
        "phr_hrRegular",
        "phr_hrIrregular",
        "phr_rr",
        "phr_T*",
        "phr_Sp-02",
        // ... Other vital signs fields
      ],
    },
    PhysicalExamination: {
      title: "Physical Examination",
      fields: [
        "phr_bodyHabitusWNL",
        "phr_bodyHabitusCathetic",
        "phr_bodyHabitusObese",
        "phr_heightCM",
        "phr_weightKG",
        "phr_BMI",
        "phr_nasalMucosaSeptumTurbinatesWNL",
        "phr_nasalMucosaSeptumTurbinatesEdeOrEryPresent",
        "phr_dentionAndGumsWNL",
        "phr_dentionAndGumsDentalCanes",
        "phr_dentionAndGumsGingivitis",
        "phr_oropharynxWNL",
        "phr_oropharynxEdeOrEryPresent",
        "phr_oropharynxOralUlcers",
        "phr_oropharynxOralPetachie",
        "phr_mallampati1",
        "phr_mallampati2",
        "phr_mallampati3",
        "phr_mallampati4",
        "phr_neckWNL",
        "phr_neckLymphadenopathy",
        "phr_thyroidWNL",
        "phr_thyroidThyromegaly",
        "phr_thyroidNodulesPalpable",
        "phr_thyroidNeckMass",
        "phr_jugularVeinsWNL",
        "phr_jugularVeinsEngorged",
        "phr_chestExpansionAndSymmetrical",
        "phr_respiratoryEffortWNL",
        "phr_respiratoryEffortAccessoryMuscleUse",
        "phr_respiratoryEffortIntercostalRetractions",
        "phr_respiratoryEffortParadoxicMovements",
        "phr_chestPercussionWNL",
        "phr_chestPercussionDullnessToPercussion",
        "phr_chestPercussionHyperResonance",
        "phr_tactileFremitusWNL",
        "phr_tactileFremitusIncreased",
        "phr_tactileFremitusDecreased",
        "phr_AuscultationWNL",
        "phr_AuscultationBronchialBreathSounds",
        "phr_AuscultationEgophony",
        "phr_AuscultationRales",
        "phr_AuscultationRhonchi",
        "phr_AuscultationWheezes",
        "phr_AuscultationRub",
        // ... Other physical examination fields
      ],
    },
    Cardiovascular: {
      title: "Cardiovascular Examination",
      fields: [
        "phr_CardiovascularAdditionalFindings",
        "phr_heartSoundsClearS1",
        "phr_heartSoundsClearS2",
        "phr_heartSoundsNoMurmur",
        "phr_heartSoundsGallopAudible",
        "phr_heartSoundsRubAudible",
        "phr_heartSoundsMurmursPresent",
        "phr_heartSoundsSystolic",
        "phr_heartSoundsDiastolic",
        "phr_grade",
        // ... Other cardiovascular fields
      ],
    },
    Respiratory: {
      title: "Respiratory Examination",
      fields: [
        "phr_RespiratoryAdditionalFindings",
        // ... Other respiratory fields
      ],
    },
    Abdomen: {
      title: "Abdominal Examination",
      fields: [
        "phr_abdomenWNL",
        "phr_massPresent",
        "phr_specifyMassPresent",
        "phr_bowelSoundsNormaoactive",
        "phr_bowelSoundsUp",
        "phr_bowelSoundsDown",
        "phr_unableToPalpateLiver",
        "phr_unableToPalpateSpleen",
        "phr_organomegalyLiver",
        "phr_organomegalySpleen",
        "phr_DREFindings",
        "phr_kidneyPunchSignNegative",
        "phr_kidneyPunchSignPositive",
        "phr_IfPositiveR",
        "phr_IfPositiveL",
        // ... Other abdomen fields
      ],
    },
    ExtremitiesAndSkin: {
      title: "Extremities and Skin Examination",
      fields: [
        "phr_extremitiesWNL",
        "phr_extremitiesClubbing",
        "phr_extremitiesCyanosis",
        "phr_extremitiesPetachiae",
        "phr_capillaryRefillTime",
        "phr_skinWNL",
        "phr_skinRash",
        "phr_skinEccymosis",
        "phr_skinNodules",
        "phr_skinUlcer",
        // ... Other extremities and skin fields
      ],
    },
    Assessment: {
      title: "Assessment",
      fields: [
        "phr_Assessment",
        // ... Other assessment fields
      ],
    },
    // ... Add more categories and fields here
  };

  const fieldsToDisplay = Object.values(categorizedFields).flat();


  // Step 2: Fetch patient history data from API
  useEffect(() => {
    if (room_id) {
      fetchPatientHistory(room_id);
    }
  }, [room_id]);

  const fetchPatientHistory = async (roomId) => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axiosInstance.get(
        `/PatientHealthRecord/getPatientbyRoom/${roomId}`
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setPatientHistory(data);
      } else {
        setPatientHistory([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient history data:", error);
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", margin: "20px" }}>
      {/* <Typography variant="h4" gutterBottom>
        Patient History
      </Typography> */}
      {patientHistory.map((historyEntry, index) => (
        <div key={index}>
          {/* <Typography variant="h6" gutterBottom>
            Entry {index + 1}
          </Typography> */}
          {Object.entries(categorizedFields).map(([category, { title, fields }]) => (
            <div key={category}>
              <Typography variant="h6" gutterBottom>
                {title}
              </Typography>
              <Row gutter={[100, 40]}>
                {fields.map((field) => (
                  <Col span={4} key={field}>
                    <Typography variant="body2">
                      <strong>{fieldDisplayNames[field]}:</strong> {historyEntry[field]}
                    </Typography>
                  </Col>
                ))}
              </Row>
              <Divider style={{ margin: "10px 0" }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
export default PatientHistory;
