import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import axiosInstance from "../../../src/components/utils/axiosInstance";
import { useRouter } from "next/router";

const PatientHistory = () => {
  const router = useRouter();
  const { room_id } = router.query; // Get the room_id from the query parameters

  // Step 1: State to store patient history data
  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fields you want to display
  const fieldsToDisplay = [
    "phr_chiefComaplaint",
    "phr_startTime",
    "phr_endTime",
    "phr_historyOfPresentIllness",
    "phr_nonVerbalPatient",
    "phr_HxFromParent",
    "phr_HxFromFamily",
    "phr_medRecAvailable",
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
    "phr_bpSitting",
    "phr_bpStanding",
    "phr_bpLying",
    "phr_hrRegular",
    "phr_hrIrregular",
    "phr_rr",
    "phr_T*",
    "phr_Sp-02",
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
    "phr_RespiratoryAdditionalFindings",
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
    "phr_Assessment",
    // Add more field names you want to display here
  ];

  // Step 2: Fetch patient history data from API
  useEffect(() => {
    if (room_id) {
      fetchPatientHistory(room_id); // Fetch patient history data for the specified room_id
    }
  }, [room_id]);

  const fetchPatientHistory = async (roomId: string | string[]) => {
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

  // let content;
  // if (loading) {
  //   content = <p>Loading patient history data...</p>;
  // } else if (error) {
  //   content = <p>Error fetching patient history data: {error.message}</p>;
  // } else if (patientHistory.length > 0) {
  //   content = (
  //     <>
  //       <h2>Patient History</h2>
  //       {patientHistory.map((historyEntry, index) => (
  //         <div key={index}>
  //           {fieldsToDisplay.map((field) => (
  //             <p key={field}>
  //               <strong>{field}:</strong> {historyEntry[field]}
  //             </p>
  //           ))}
  //           <hr />
  //         </div>
  //       ))}
  //     </>
  //   );
  // } else {
  //   content = <p>No patient history data found.</p>;
  // }

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Patient History
      </Typography>
      {patientHistory.map(
        (
          historyEntry: {
            [x: string]:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | React.PromiseLikeOfReactNode
              | null
              | undefined;
          },
          index: React.Key | null | undefined
        ) => (
          <div key={index}>
            <Typography variant="h6" gutterBottom>
              Entry {index + 1}
            </Typography>
            <Grid container spacing={4}>
              {fieldsToDisplay.map((field) => (
                <Grid item xs={6} key={field}>
                  <Typography variant="body1">
                    <strong>{field}:</strong> {historyEntry[field]}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <hr style={{ margin: "20px 0" }} />
          </div>
        )
      )}
    </Paper>
  );
};

export default PatientHistory;
