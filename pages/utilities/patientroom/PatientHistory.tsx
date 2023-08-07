import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { useRouter } from "next/router";

const PatientHistory = () => {
  const router = useRouter();
  const { room_id } = router.query; // Get the room_id from the query parameters

  // Step 1: State to store patient history data
  const [patientHistory, setPatientHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fields you want to display
  const fieldsToDisplay = [
    "phr_nonVerbalPatient",
    "phr_HxFrom",
    "phr_medRecAvailable",
    // "med-records" ,
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
    "phr_allergies",
    "phr_maintenanceMeds",
    "phr_malignancy",
    "phr_surgeries",
    "phr_tobacco",
    "phr_recDrugs",
    "phr_alcohol",
    "phr_alcoholDrinksFrequency",
    "phr_heartRate",
    "phr_bodyHabitusWNL",
    "phr_bodyHabitusCathetic",
    "phr_bodyHabitusObese",
    "phr_nasalMucosaSeptumTurbinatesWNL",
    "phr_nasalMucosaSeptumTurbinatesEdeOrEryPresent",
    // "dentition-gums" ,
    "phr_dentionAndGumsWNL",
    "phr_dentionAndGumsDentalCanes",
    "phr_dentionAndGumsGingivitis",
    "oropharynx",
    "phr_oropharynxWNL",
    "phr_oropharynxEdeOrEryPresent",
    "phr_oropharynxOralUlcers",
    "phr_oropharynxOralPetachie",
    "mallampati",
    "phr_mallampati1",
    "phr_mallampati2",
    "phr_mallampati3",
    "phr_mallampati4",
    "neck",
    "phr_neckWNL",
    "phr_neckLymphadenopathy",
    "thyroid",
    "phr_thyroidWNL",
    "phr_thyroidThyromegaly",
    "phr_thyroidNodulesPalpable",
    "phr_thyroidNeckMass",
    // "jugular-veins" ,
    "phr_jugularVeinsWNL",
    "phr_jugularVeinsEngorged",
    // "respiratory-effort" ,
    "phr_respiratoryEffortWNL",
    "phr_respiratoryEffortAccessoryMuscleUse",
    "phr_respiratoryEffortIntercostalRetractions",
    "phr_respiratoryEffortParadoxicMovements",
    // "chest-percussion" ,
    "phr_chestPercussionWNL",
    "phr_chestPercussionDullnessToPercussion",
    "phr_chestPercussionHyperResonance",
    // "tactile-fremitus" ,
    "phr_tactileFremitusWNL",
    "phr_tactileFremitusIncreased",
    "phr_tactileFremitusDecreased",
    "auscultation",
    "phr_AuscultationWNL",
    "phr_AuscultationBronchialBreathSounds",
    "phr_AuscultationEgophony",
    "phr_AuscultationRales",
    "phr_AuscultationRhonchi",
    "phr_AuscultationWheezes",
    "phr_AuscultationRub",
    "phr_heartSoundsClearS1",
    "phr_heartSoundsClearS2",
    "phr_heartSoundsNoMurmur",
    "phr_heartSoundsGallopAudible",
    "phr_heartSoundsRubAudible",
    "phr_heartSoundsMurmursPresent",
    "phr_heartSoundsSystolic",
    "phr_heartSoundsDiastolic",
    "abdomen",
    "phr_massPresent",
    // "bowel-sounds" ,
    "phr_bowelSoundsNormaoactive",
    "phr_bowelSoundsUp",
    "phr_bowelSoundsDown",
    // "liver-spleen" ,
    "phr_unableToPalpateLiver",
    "phr_unableToPalpateSpleen",
    "organomegaly",
    "phr_organomegalyLiver",
    "phr_organomegalySpleen",
    // "dre-findings" ,
    "phr_kidneyPunchSignNegative",
    "phr_kidneyPunchSignPositive",
    // "if-positive" ,
    "phr_IfPositiveR",
    "phr_IfPositiveL",
    "extremities",
    "phr_extremitiesWNL",
    "phr_extremitiesClubbing",
    "phr_extremitiesCyanosis",
    "phr_extremitiesPetachiae",
    "phr_capillaryRefillTime",
    // skin: [],
    "phr_skinWNL",
    "phr_skinRash",
    "phr_skinEccymosis",
    "phr_skinNodules",
    "phr_skinUlcer",
    // Add more field names you want to display here
  ];

  // Step 2: Fetch patient history data from API
  useEffect(() => {
    if (room_id) {
      fetchPatientHistory(room_id); // Fetch patient history data for the specified room_id
    }
  }, [room_id]);

  const fetchPatientHistory = async (roomId) => {
    try {
      const token = sessionStorage.getItem("authToken");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      const response = await axiosInstance.get(
        `/PatientHealthRecord/getPatientbyRoom/${roomId}`
      );

      const data = response.data;

      if (data && Array.isArray(data)) {
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

  let content;
  if (loading) {
    content = <p>Loading patient history data...</p>;
  } else if (error) {
    content = <p>Error fetching patient history data: {error.message}</p>;
  } else if (patientHistory.length > 0) {
    content = (
      <>
        <h2>Patient History</h2>
        {patientHistory.map((historyEntry, index) => (
          <div key={index}>
            {fieldsToDisplay.map((field) => (
              <p key={field}>
                <strong>{field}:</strong> {historyEntry[field]}
              </p>
            ))}
            <hr />
          </div>
        ))}
      </>
    );
  } else {
    content = <p>No patient history data found.</p>;
  }

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      {content}
    </Paper>
  );
};

export default PatientHistory;
