import { ReactElement, useEffect, useState } from "react";
import PageContainer from "../../src/components/container/PageContainer";
import DashboardCard from "../../src/components/shared/DashboardCard";
import FullLayout from "../../src/layouts/full/FullLayout";
import { useForm } from "react-hook-form";
import axios from "../../src/components/utils/axiosInstance";
import { message, Button } from "antd";
import { Grid } from "@mui/material";
import React from "react";
import InputMask from "react-input-mask";

export function EHRForm() {
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allergiesChecked, setAllergiesChecked] = useState(false);
  const [othersChecked, setOthersChecked] = useState(false);
  const [maintenanceMedsChecked, setMaintenanceMedsChecked] = useState(false);
  const [malignancy, setMalignancy] = useState("");
  const [surgeries, setSurgeries] = useState("");
  const [tobacco, setTobacco] = useState("");
  const [recDrugs, setRecDrugs] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [maxDigits] = useState(3); // Maximum number of digits allowed
  const [massPresentChecked, setMassPresentChecked] = useState(false);

  const handleInput = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    const maxLengthInput = input.slice(0, maxDigits); // Limit input to maxDigits
    e.target.value = maxLengthInput; // Update input field value
  };

  const handleBMIInput = (e) => {
    let input = e.target.value.replace(/[^\d.]/g, ""); // Remove non-numeric and non-decimal point characters
    const decimalIndex = input.indexOf("."); // Check if a decimal point exists

    if (decimalIndex !== -1) {
      // If a decimal point exists, limit the input before and after the decimal point
      const integerPart = input.slice(0, decimalIndex);
      const decimalPart = input.slice(decimalIndex + 1, decimalIndex + 2); // Limit decimal part to one digit
      input = `${integerPart}.${decimalPart}`;
    } else {
      // If there's no decimal point, limit the input to max 4 digits
      input = input.slice(0, 4);
    }

    e.target.value = input; // Update input field value
  };

  const handleMassPresentChange = (e) => {
    setMassPresentChecked(e.target.checked);
  };

  const handleMaintenanceMedsChange = (e) => {
    setMaintenanceMedsChecked(e.target.checked);
  };

  const handleAllergiesChange = (e) => {
    setAllergiesChecked(e.target.checked);
  };

  const handleOthersChange = (e) => {
    setOthersChecked(e.target.checked);
  };
  // Step 2: Fetch room data from the API
  useEffect(() => {
    fetchRoomData();
  }, []);

  const fetchRoomData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("patAssRooms/get/unassignedRooms"); // Adjust the endpoint as per your API
      const data = response.data;

      if (data && data.length > 0) {
        setRoomData(data);
      }
      setLoading(false);
    } catch (error) {
      // setError(error);
      setLoading(false);
    }
  };
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      patient_fName: "",
      patient_mName: "",
      patient_lName: "",
      patient_age: "",
      patient_sex: "",
      date: "",
      room_id: "",
      patient_vaccination_stat: "",
      phr_chiefComplaint: "",
      phr_startTime: "",
      phr_endTime: "",
      phr_historyOfPresentIllness: "",
      phr_nonVerbalPatient: "",
      phr_HxFromParent: "",
      phr_HxFromFamily: "",
      phr_medRecAvailable: "",
      phr_PMH_Asthma: "",
      phr_PMH_HTN: "",
      phr_PMH_Thyroid: "",
      phr_PMH_Diabetes: "",
      phr_PMH_HepaticRenal: "",
      phr_PMH_Tuberculosis: "",
      phr_PMH_Psychiatric: "",
      phr_PMH_CAD: "",
      phr_PMH_CHF: "",
      phr_PMH_otherIllness: "",
      phr_PMH_specifyOtherIllness: "",
      phr_allergies: "",
      phr_specifyAllergies: "",
      phr_specifyPrevHospitalization: "",
      phr_maintenanceMeds: "",
      phr_specifyMaintenanceMeds: "",
      phr_malignancy: "",
      phr_specifyMalignancy: "",
      phr_surgeries: "",
      phr_specifySurgeries: "",
      phr_vaccinationHistory: "",
      phr_tobacco: "",
      phr_tobaccoPacks: "",
      phr_tobaccoQuit: "",
      phr_recDrugs: "",
      phr_specifyRecDrugs: "",
      phr_alcohol: "",
      phr_alcoholDrinksFrequencyDay: "",
      phr_alcoholDrinksFrequencyWeek: "",
      phr_noOfAlcoholDrinks: "",
      phr_specifyFamilialDisease: "",
      phr_specifyCivilStatus: "",
      phr_specifyPertinentHistory: "",
      phr_bpSitting: "",
      phr_bpStanding: "",
      phr_bpLying: "",
      phr_hrRegular: "",
      phr_hrIrregular: "",
      phr_rr: "",
      "phr_T*": "",
      "phr_Sp-02": "",
      phr_bodyHabitusWNL: "",
      phr_bodyHabitusCathetic: "",
      phr_bodyHabitusObese: "",
      phr_heightCM: "",
      phr_weightKG: "",
      phr_BMI: "",
      phr_nasalMucosaSeptumTurbinatesWNL: "",
      phr_nasalMucosaSeptumTurbinatesEdeOrEryPresent: "",
      phr_dentionAndGumsWNL: "",
      phr_dentionAndGumsDentalCanes: "",
      phr_dentionAndGumsGingivitis: "",
      phr_oropharynxWNL: "",
      phr_oropharynxEdeOrEryPresent: "",
      phr_oropharynxOralUlcers: "",
      phr_oropharynxOralPetachie: "",
      phr_mallampati1: "",
      phr_mallampati2: "",
      phr_mallampati3: "",
      phr_mallampati4: "",
      phr_neckWNL: "",
      phr_neckLymphadenopathy: "",
      phr_thyroidWNL: "",
      phr_thyroidThyromegaly: "",
      phr_thyroidNodulesPalpable: "",
      phr_thyroidNeckMass: "",
      phr_jugularVeinsWNL: "",
      phr_jugularVeinsEngorged: "",
      phr_chestExpansionAndSymmetrical: "",
      phr_respiratoryEffortWNL: "",
      phr_respiratoryEffortAccessoryMuscleUse: "",
      phr_respiratoryEffortIntercostalRetractions: "",
      phr_respiratoryEffortParadoxicMovements: "",
      phr_chestPercussionWNL: "",
      phr_chestPercussionDullnessToPercussion: "",
      phr_chestPercussionHyperResonance: "",
      phr_tactileFremitusWNL: "",
      phr_tactileFremitusIncreased: "",
      phr_tactileFremitusDecreased: "",
      phr_AuscultationWNL: "",
      phr_AuscultationBronchialBreathSounds: "",
      phr_AuscultationEgophony: "",
      phr_AuscultationRales: "",
      phr_AuscultationRhonchi: "",
      phr_AuscultationWheezes: "",
      phr_AuscultationRub: "",
      phr_CardiovascularAdditionalFindings: "",
      phr_heartSoundsClearS1: "",
      phr_heartSoundsClearS2: "",
      phr_heartSoundsNoMurmur: "",
      phr_heartSoundsGallopAudible: "",
      phr_heartSoundsRubAudible: "",
      phr_heartSoundsMurmursPresent: "",
      phr_heartSoundsSystolic: "",
      phr_heartSoundsDiastolic: "",
      phr_grade: "",
      phr_RespiratoryAdditionalFindings: "",
      phr_abdomenWNL: "",
      phr_massPresent: "",
      phr_specifyMassPresent: "",
      phr_bowelSoundsNormaoactive: "",
      phr_bowelSoundsUp: "",
      phr_bowelSoundsDown: "",
      phr_unableToPalpateLiver: "",
      phr_unableToPalpateSpleen: "",
      phr_organomegalyLiver: "",
      phr_organomegalySpleen: "",
      phr_DREFindings: "",
      phr_kidneyPunchSignNegative: "",
      phr_kidneyPunchSignPositive: "",
      phr_IfPositiveR: "",
      phr_IfPositiveL: "",
      phr_extremitiesWNL: "",
      phr_extremitiesClubbing: "",
      phr_extremitiesCyanosis: "",
      phr_extremitiesPetachiae: "",
      phr_capillaryRefillTime: "",
      phr_skinWNL: "",
      phr_skinRash: "",
      phr_skinEccymosis: "",
      phr_skinNodules: "",
      phr_skinUlcer: "",
      phr_Assessment: "",
    },
  });

  const onSubmit = (data: any) => {
    const mappedData = {
      ...data,
      phr_maintenanceMeds: data.phr_maintenanceMeds ? 1 : 0,
      phr_PMH_Asthma: data.phr_PMH_Asthma ? 1 : 0,
      phr_PMH_HTN: data.phr_PMH_HTN ? 1 : 0,
      phr_PMH_Thyroid: data.phr_PMH_Thyroid ? 1 : 0,
      phr_PMH_Diabetes: data.phr_PMH_Diabetes ? 1 : 0,
      phr_PMH_HepaticRenal: data.phr_PMH_HepaticRenal ? 1 : 0,
      phr_PMH_Tuberculosis: data.phr_PMH_Tuberculosis ? 1 : 0,
      phr_PMH_Psychiatric: data.phr_PMH_Psychiatric ? 1 : 0,
      phr_PMH_CAD: data.phr_PMH_CAD ? 1 : 0,
      phr_PMH_CHF: data.phr_PMH_CHF ? 1 : 0,
      phr_PMH_otherIllness: data.phr_PMH_otherIllness ? 1 : 0,
      phr_HxFromParent: data.phr_HxFromParent ? 1 : 0,
      phr_HxFromFamily: data.phr_HxFromParent ? 1 : 0,
      phr_abdomenWNL: data.phr_abdomenWNL ? 1 : 0,
      phr_bodyHabitusWNL: data.phr_bodyHabitusWNL ? 1 : 0,
      phr_bodyHabitusCathetic: data.phr_bodyHabitusCathetic ? 1 : 0,
      phr_bodyHabitusObese: data.phr_bodyHabitusObese ? 1 : 0,

      phr_nasalMucosaSeptumTurbinatesWNL:
        data.phr_nasalMucosaSeptumTurbinatesWNL ? 1 : 0,
      phr_nasalMucosaSeptumTurbinatesEdeOrEryPresent:
        data.phr_nasalMucosaSeptumTurbinatesEdeOrEryPresent ? 1 : 0,

      phr_dentionAndGumsWNL: data.phr_dentionAndGumsWNL ? 1 : 0,
      phr_dentionAndGumsDentalCanes: data.phr_dentionAndGumsDentalCanes ? 1 : 0,
      phr_dentionAndGumsGingivitis: data.phr_dentionAndGumsGingivitis ? 1 : 0,

      phr_oropharynxWNL: data.phr_oropharynxWNL ? 1 : 0,
      phr_oropharynxEdeOrEryPresent: data.phr_oropharynxEdeOrEryPresent ? 1 : 0,
      phr_oropharynxOralUlcers: data.phr_oropharynxOralUlcers ? 1 : 0,
      phr_oropharynxOralPetachie: data.phr_oropharynxOralPetachie ? 1 : 0,
      phr_recDrugs: data.phr_recDrugs ? 1 : 0,
      phr_alcohol: data.phr_alcohol ? 1 : 0,
      phr_mallampati1: data.phr_mallampati1 ? 1 : 0,
      phr_mallampati2: data.phr_mallampati2 ? 1 : 0,
      phr_mallampati3: data.phr_mallampati3 ? 1 : 0,
      phr_mallampati4: data.phr_mallampati4 ? 1 : 0,

      phr_neckWNL: data.phr_neckWNL ? 1 : 0,
      phr_neckLymphadenopathy: data.phr_neckLymphadenopathy ? 1 : 0,

      phr_thyroidWNL: data.phr_thyroidWNL ? 1 : 0,
      phr_thyroidThyromegaly: data.phr_thyroidThyromegaly ? 1 : 0,
      phr_thyroidNodulesPalpable: data.phr_thyroidNodulesPalpable ? 1 : 0,
      phr_thyroidNeckMass: data.phr_thyroidNeckMass ? 1 : 0,

      phr_jugularVeinsWNL: data.phr_jugularVeinsWNL ? 1 : 0,
      phr_jugularVeinsEngorged: data.phr_jugularVeinsEngorged ? 1 : 0,
      phr_chestExpansionAndSymmetrical: data.phr_chestExpansionAndSymmetrical
        ? 1
        : 0,

      phr_respiratoryEffortWNL: data.phr_respiratoryEffortWNL ? 1 : 0,
      phr_respiratoryEffortAccessoryMuscleUse:
        data.phr_respiratoryEffortAccessoryMuscleUse ? 1 : 0,
      phr_respiratoryEffortIntercostalRetractions:
        data.phr_respiratoryEffortIntercostalRetractions ? 1 : 0,
      phr_respiratoryEffortParadoxicMovements:
        data.phr_respiratoryEffortParadoxicMovements ? 1 : 0,

      phr_chestPercussionWNL: data.phr_chestPercussionWNL ? 1 : 0,
      phr_chestPercussionDullnessToPercussion:
        data.phr_chestPercussionDullnessToPercussion ? 1 : 0,
      phr_chestPercussionHyperResonance: data.phr_chestPercussionHyperResonance
        ? 1
        : 0,

      phr_tactileFremitusWNL: data.phr_tactileFremitusWNL ? 1 : 0,
      phr_tactileFremitusIncreased: data.phr_tactileFremitusIncreased ? 1 : 0,
      phr_tactileFremitusDecreased: data.phr_tactileFremitusDecreased ? 1 : 0,

      phr_AuscultationWNL: data.phr_AuscultationWNL ? 1 : 0,
      phr_AuscultationBronchialBreathSounds:
        data.phr_AuscultationBronchialBreathSounds ? 1 : 0,
      phr_AuscultationEgophony: data.phr_AuscultationEgophony ? 1 : 0,
      phr_AuscultationRales: data.phr_AuscultationRales ? 1 : 0,
      phr_AuscultationRhonchi: data.phr_AuscultationRhonchi ? 1 : 0,
      phr_AuscultationWheezes: data.phr_AuscultationWheezes ? 1 : 0,
      phr_AuscultationRub: data.phr_AuscultationRub ? 1 : 0,

      phr_heartSoundsClearS1: data.phr_heartSoundsClearS1 ? 1 : 0,
      phr_heartSoundsClearS2: data.phr_heartSoundsClearS2 ? 1 : 0,
      phr_heartSoundsNoMurmur: data.phr_heartSoundsNoMurmur ? 1 : 0,
      phr_heartSoundsGallopAudible: data.phr_heartSoundsGallopAudible ? 1 : 0,
      phr_heartSoundsRubAudible: data.phr_heartSoundsRubAudible ? 1 : 0,
      phr_heartSoundsMurmursPresent: data.phr_heartSoundsMurmursPresent ? 1 : 0,
      phr_heartSoundsSystolic: data.phr_heartSoundsSystolic ? 1 : 0,
      phr_heartSoundsDiastolic: data.phr_heartSoundsDiastolic ? 1 : 0,

      phr_massPresent: data.phr_massPresent ? 1 : 0,
      phr_bowelSoundsNormaoactive: data.phr_bowelSoundsNormaoactive ? 1 : 0,
      phr_bowelSoundsUp: data.phr_bowelSoundsUp ? 1 : 0,
      phr_bowelSoundsDown: data.phr_bowelSoundsDown ? 1 : 0,

      phr_unableToPalpateLiver: data.phr_unableToPalpateLiver ? 1 : 0,
      phr_unableToPalpateSpleen: data.phr_unableToPalpateSpleen ? 1 : 0,

      phr_organomegalyLiver: data.phr_organomegalyLiver ? 1 : 0,
      phr_organomegalySpleen: data.phr_organomegalySpleen ? 1 : 0,

      phr_kidneyPunchSignNegative: data.phr_kidneyPunchSignNegative ? 1 : 0,
      phr_kidneyPunchSignPositive: data.phr_kidneyPunchSignPositive ? 1 : 0,

      phr_IfPositiveR: data.phr_IfPositiveR ? 1 : 0,
      phr_IfPositiveL: data.phr_IfPositiveL ? 1 : 0,

      phr_extremitiesWNL: data.phr_extremitiesWNL ? 1 : 0,
      phr_extremitiesClubbing: data.phr_extremitiesClubbing ? 1 : 0,
      phr_extremitiesCyanosis: data.phr_extremitiesCyanosis ? 1 : 0,
      phr_extremitiesPetachiae: data.phr_extremitiesPetachiae ? 1 : 0,
      phr_capillaryRefillTime: data.phr_capillaryRefillTime ? 1 : 0,

      phr_skinWNL: data.phr_skinWNL ? 1 : 0,
      phr_skinRash: data.phr_skinRash ? 1 : 0,
      phr_skinEccymosis: data.phr_skinEccymosis ? 1 : 0,
      phr_skinNodules: data.phr_skinNodules ? 1 : 0,
      phr_skinUlcer: data.phr_skinUlcer ? 1 : 0,
    };
    const token = localStorage.getItem("authToken");
    // Set the token in Axios headers for this request
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    console.log(mappedData);

    axios
      .post("/patients", mappedData) // <-- Send mappedData instead of the original data
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        // Display success message
        message.success("Patient saved successfully");
        // Handle success or redirect to another page
        const formElement = document.getElementById(
          "myForm"
        ) as HTMLFormElement;
        if (formElement) {
          formElement.reset();
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        // Display error message
        message.error("Error saving patient. Please try again.");
        // Handle error
      });
  };

  return (
    <PageContainer title="EHR Form" description="this is Icons">
      <DashboardCard title="">
        <form id="myForm" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-3xl">EHR Form</h1>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">First Name</span>
                  <input
                    {...register("patient_fName")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    placeholder="First Name"
                    type="text"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Last Name</span>
                  <input
                    {...register("patient_lName")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    placeholder="Name"
                    type="text"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Middle Name</span>
                  <input
                    {...register("patient_mName")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    placeholder="Name"
                    type="text"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Age</span>
                  <input
                    {...register("patient_age")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    placeholder="Age"
                    type="number"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="mb-2">Gender</p>
                {[
                  { label: "Male", value: "M" },
                  { label: "Female", value: "F" },
                ].map(({ label, value }, index) => {
                  return (
                    <label key={value} className="flex items-center">
                      <span className="mr-2">{label}</span>
                      <input
                        {...register("patient_sex")}
                        className="border border-gray-300 rounded-lg"
                        aria-invalid={errors["patient_sex"] ? "true" : "false"}
                        value={value}
                        type="radio"
                      />
                    </label>
                  );
                })}
                {errors["patient_sex"] && (
                  <p role="alert">{errors["patient_sex"]?.message}</p>
                )}
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Room</span>
                  <select
                    {...register("room_id")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                  >
                    <option value="">Select a room</option>
                    {roomData.map((room) => (
                      <option key={room.room_id} value={room.room_id}>
                        {room.room_id}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Chief Complaint</span>
                  <textarea
                    {...register("phr_chiefComplaint")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    placeholder="Input"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span>Vaccination Status (Covid)</span>
                  <textarea
                    {...register("patient_vaccination_stat")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Date</span>
                  <input
                    {...register("date")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    type="date"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Start Time</span>
                  <input
                    {...register("phr_startTime")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    type="time"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Stop Time</span>
                  <input
                    {...register("phr_endTime")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    type="time"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">History of Present Illness</span>
                  <textarea
                    {...register("phr_historyOfPresentIllness")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Previous Hospitalizations</span>
                  <textarea
                    {...register("phr_specifyPrevHospitalization")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex items-center">
                  <span className="mr-2">Patient is nonverbal</span>
                  <input
                    {...register("phr_nonVerbalPatient")}
                    className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                    type="checkbox"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="my-4">
                <p className="mb-2">Hx obtained from</p>
                {[
                  { label: "Parent", field: "phr_HxFromParent" },
                  { label: "Family", field: "phr_HxFromFamily" },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span className="mr-2">{label}</span>
                      <input
                        //@ts-ignore
                        {...register("hxObtainedFrom")}
                        className="form-radio h-5 w-5 text-indigo-600 rounded"
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={field} // Use unique values for each radio button
                        type="radio"
                      />
                    </label>
                  );
                })}
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex items-center">
                  <span className="mr-2">Med Records</span>
                  <input
                    {...register("phr_medRecAvailable")}
                    className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                    type="checkbox"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex items-center">
                  <span className="mr-2">Allergies</span>
                  <input
                    {...register("phr_allergies")}
                    className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                    type="checkbox"
                    onChange={handleAllergiesChange}
                  />
                </label>
              </div>
            </Grid>

            {allergiesChecked && (
              <Grid item xs={12}>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span className="mb-2">Allergies</span>
                    <textarea
                      {...register("phr_specifyAllergies")}
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                    />
                  </label>
                </div>
              </Grid>
            )}

            <Grid item xs={12}>
              <div className="my-4">
                <p className="mb-2 font-medium">Past Medical History</p>
                {[
                  { label: "Asthma", field: "phr_PMH_Asthma" },
                  { label: "HTN", field: "phr_PMH_HTN" },
                  { label: "Thyroid", field: "phr_PMH_Thyroid" },
                  { label: "Diabetes", field: "phr_PMH_Diabetes" },
                  { label: "Hepatic, Renal", field: "phr_PMH_HepaticRenal" },
                  { label: "Tuberculosis", field: "phr_PMH_Tuberculosis" },
                  { label: "Psychiatric", field: "phr_PMH_Psychiatric" },
                  { label: "CAD", field: "phr_PMH_CAD" },
                  { label: "CHF", field: "phr_PMH_CHF" },
                  { label: "Others", field: "phr_PMH_otherIllness" },
                ].map(({ label, field }, index) => {
                  const isOthers = field === "phr_PMH_otherIllness";
                  return (
                    <label key={field} className="flex items-center mt-2">
                      <input
                        //@ts-ignore
                        {...register(field)}
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded mr-2"
                        aria-invalid={[] ? "true" : "false"}
                        value={1}
                        type="checkbox"
                        defaultChecked={false}
                        onChange={isOthers ? handleOthersChange : undefined}
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </Grid>

            {othersChecked && (
              <Grid item xs={12}>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span className="mb-2">Others</span>
                    <textarea
                      {...register("phr_PMH_specifyOtherIllness")}
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                    />
                  </label>
                </div>
              </Grid>
            )}

            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex items-center">
                  <input
                    {...register("phr_maintenanceMeds")}
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded mr-2"
                    onChange={handleMaintenanceMedsChange}
                  />
                  <span className="font-bold">
                    Maintenance Medications/Herbal drug use
                  </span>
                </label>
                {maintenanceMedsChecked && (
                  <label className="flex flex-col">
                    <textarea
                      {...register("phr_specifyMaintenanceMeds")}
                      className="border border-gray-300 px-4 py-2 rounded-lg mt-2"
                      placeholder="Enter additional information"
                    />
                  </label>
                )}
              </div>
            </Grid>
          </Grid>
          <div className="my-4">
            <p className="mb-2 font-medium">Malignancy</p>
            <Grid container spacing={3}>
              {[
                { label: "Yes", field: "Yes" },
                { label: "No", field: "No" },
              ].map(({ label, field }, index) => (
                <Grid item key={field}>
                  <label className="flex items-center">
                    <input
                      {...register("phr_malignancy")}
                      className="form-radio h-4 w-4 text-indigo-600 rounded mr-2"
                      value={errors[field] ? 0 : 1}
                      type="radio"
                      checked={malignancy === field}
                      onChange={() => setMalignancy(field)}
                    />
                    <span>{label}</span>
                  </label>
                </Grid>
              ))}
            </Grid>
            {malignancy === "Yes" && (
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Specify Malignancy</span>
                  <textarea
                    {...register("phr_specifyMalignancy")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    placeholder="Specify Malignancy..."
                  />
                </label>
              </div>
            )}
          </div>
          <div className="my-4">
            <p className="mb-2 font-medium">Surgeries</p>
            <Grid container spacing={3}>
              {[
                { label: "Yes", field: "Yes" },
                { label: "No", field: "No" },
              ].map(({ label, field }, index) => (
                <Grid item key={field}>
                  <label className="flex items-center">
                    <input
                      {...register("phr_surgeries")}
                      className="form-radio h-4 w-4 text-indigo-600 rounded mr-2"
                      value={errors[field] ? 0 : 1}
                      type="radio"
                      checked={surgeries === field}
                      onChange={() => setSurgeries(field)}
                    />
                    <span>{label}</span>
                  </label>
                </Grid>
              ))}
            </Grid>
            {surgeries === "Yes" && (
              <div className="my-4">
                <label className="flex flex-col">
                  <span className="mb-2">Specify Surgeries</span>
                  <textarea
                    {...register("phr_specifySurgeries")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    placeholder="Specify Surgeries..."
                  />
                </label>
              </div>
            )}
          </div>
          <div className="my-4">
            <label className="flex flex-col">
              <span>Vaccination History</span>
              <textarea
                {...register("phr_vaccinationHistory")}
                className="border border-gray-300 px-4 py-2 rounded-lg"
              />
            </label>
          </div>
          <div className="my-4">
            <p>Tobacco/Cigarette</p>
            <Grid container spacing={3}>
              {[
                { label: "Yes", field: "Yes" },
                { label: "No", field: "No" },
              ].map(({ label, field }, index) => (
                <Grid item key={field}>
                  <label className="flex items-center">
                    <span className="mr-2">{label}</span>
                    <input
                      {...register("phr_tobacco")}
                      className="form-radio h-4 w-4 text-indigo-600 rounded"
                      value={errors[field] ? 0 : 1}
                      type="radio"
                      checked={tobacco === field}
                      onChange={() => setTobacco(field)}
                    />
                  </label>
                </Grid>
              ))}
            </Grid>
            {tobacco === "Yes" && (
              <>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span>Pack Years</span>
                    <input
                      {...register("phr_tobaccoPacks")}
                      placeholder="0"
                      type="number"
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                    />
                  </label>
                </div>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span>Quit Date</span>
                    <input
                      {...register("phr_tobaccoQuit")}
                      type="date"
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className="my-4">
                <p>Recreational Drugs</p>
                {[
                  { label: "Yes", field: "1" },
                  { label: "No", field: "0" },
                ].map(({ label, field }) => (
                  <label key={field} className="flex items-center">
                    <span className="mr-2">{label}</span>
                    <input
                      {...register("phr_recDrugs")}
                      aria-invalid={errors["phr_recDrugs"] ? "true" : "false"}
                      value={recDrugs === field ? 1 : 0}
                      type="radio"
                      className="form-radio h-4 w-4 text-indigo-600 rounded"
                      onChange={() => setRecDrugs(field)}
                    />
                  </label>
                ))}
                {errors["phr_recDrugs"] && (
                  <p role="alert">{errors["phr_recDrugs"]?.message}</p>
                )}
              </div>
            </Grid>

            {recDrugs === "1" && (
              <Grid item xs={12}>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span>Recreational Drugs taken</span>
                    <textarea
                      {...register("phr_specifyRecDrugs")}
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                    />
                  </label>
                </div>
              </Grid>
            )}

            <Grid item xs={12}>
              <div className="my-4">
                <p>Alcohol</p>
                {["Yes", "No"].map((label, index) => (
                  <label key={label} className="flex items-center">
                    <span className="mr-2">{label}</span>
                    <input
                      {...register("phr_alcohol")}
                      type="radio"
                      value={label === "Yes" ? "1" : "0"}
                      checked={alcohol === (label === "Yes" ? "1" : "0")}
                      onChange={(e) => setAlcohol(e.target.value)}
                      className="form-radio h-4 w-4 text-indigo-600 rounded"
                    />
                  </label>
                ))}
                {errors["phr_alcohol"] && (
                  <p role="alert">{errors["phr_alcohol"]?.message}</p>
                )}
              </div>
            </Grid>

            {alcohol === "1" && (
              <>
                <Grid item xs={12}>
                  <div className="my-4">
                    <p>Drinks per</p>
                    {["Day", "Week"].map((label, index) => (
                      <label key={label} className="flex items-center">
                        <span>{label}</span>
                        <input
                          type="checkbox"
                          {...register(
                            label === "Day"
                              ? "phr_alcoholDrinksFrequencyDay"
                              : "phr_alcoholDrinksFrequencyWeek"
                          )}
                          className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                        />
                      </label>
                    ))}
                    {errors["phr_alcoholDrinksFrequency"] && (
                      <p role="alert">
                        {errors["phr_alcoholDrinksFrequency"]?.message}
                      </p>
                    )}
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div className="my-4">
                    <label className="flex flex-col">
                      <span>No. of Drinks</span>
                      <input
                        {...register("phr_noOfAlcoholDrinks")}
                        placeholder="0"
                        type="number"
                        className="border border-gray-300 px-4 py-2 rounded-lg"
                      />
                    </label>
                  </div>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span>Family History(Heredofamilial Diseases)</span>
                  <textarea
                    {...register("phr_specifyFamilialDisease")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span>Civil Status/Children</span>
                  <textarea
                    {...register("phr_specifyCivilStatus")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span>Other Pertinent History</span>
                  <textarea
                    {...register("phr_specifyPertinentHistory")}
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                  />
                </label>
              </div>
            </Grid>
          </Grid>

          <div className="my-4">
            <p className="font-bold">HR</p>
            {[
              { label: "Regular", field: "phr_hrRegular" },
              { label: "Irregular", field: "phr_hrIrregular" },
            ].map(({ label, field }, index) => {
              return (
                <label key={field} className="flex items-center">
                  <span>{label}</span>
                  <input
                    //@ts-ignore
                    {...register(field)}
                    aria-invalid={errors[field] ? "true" : "false"}
                    value={errors[field] ? 0 : 1}
                    type="radio"
                    className="form-radio h-4 w-4 text-indigo-600 rounded"
                  />
                </label>
              );
            })}
            {errors["phr_heartRate"] && (
              <p role="alert">{errors["phr_heartRate"]?.message}</p>
            )}
          </div>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span>RR</span>
                  <input
                    {...register("phr_rr")}
                    type="text"
                    maxLength={2} // Limit input to 2 characters
                    pattern="[0-9]{0,2}" // Use a regular expression to allow only digits and limit to 2
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                  />
                </label>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span>T*</span>
                  <InputMask
                    mask="99.9 °C" // Set the mask to accept up to 3 digits followed by decimal point and one digit, then " °C"
                    maskChar={null} // Hide the mask character
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    placeholder="Enter Temperature"
                    {...register("phr_T*")} // Register the field
                  />
                </label>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="my-4">
                <label className="flex flex-col">
                  <span>SpO2</span>
                  <InputMask
                    mask="99%" // Set the mask to accept up to 2 digits followed by "%"
                    maskChar={null} // Hide the mask character
                    className="border border-gray-300 px-4 py-2 rounded-lg"
                    placeholder="Enter SpO2"
                    {...register("phr_Sp-02")} // Register the field
                  />
                </label>
              </div>
            </Grid>
          </Grid>
          <div>
            <h2 className="font-bold">Blood Pressure</h2>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span>Sitting</span>
                    <InputMask
                      mask="999/999" // Mask for up to three digits for both numerator and denominator
                      maskChar="" // Remove default masking character (_)
                      {...register("phr_bpSitting")}
                      type="text"
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                      placeholder="Enter fraction (e.g., 120/80)"
                    />
                  </label>
                </div>
              </Grid>

              <Grid item xs={12} sm={4}>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span>Standing</span>
                    <InputMask
                      mask="999/999"
                      maskChar=""
                      {...register("phr_bpStanding")}
                      type="text"
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                      placeholder="Enter blood pressure (e.g., 120/80)"
                    />
                  </label>
                </div>
              </Grid>

              <Grid item xs={12} sm={4}>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span>Lying</span>
                    <InputMask
                      mask="999/999"
                      maskChar=""
                      {...register("phr_bpLying")}
                      type="text"
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                      placeholder="Enter blood pressure (e.g., 120/80)"
                    />
                  </label>
                </div>
              </Grid>
            </Grid>
            <div className="my-4">
              <p className="font-bold">Body Habitus</p>
              {[
                { label: "WNL", field: "phr_bodyHabitusWNL" },
                { label: "Cathetic", field: "phr_bodyHabitusCathetic" },
                { label: "Obese", field: "phr_bodyHabitusObese" },
              ].map(({ label, field }, index) => {
                return (
                  <label key={field} className="flex items-center">
                    <span>{label}</span>
                    <input
                      //@ts-ignore
                      {...register(field)}
                      aria-invalid={errors[field] ? "true" : "false"}
                      value={1}
                      type="radio"
                      className="form-radio h-4 w-4 text-indigo-600 rounded"
                    />
                  </label>
                );
              })}
              {errors["body-habitus"] && (
                <p role="alert">{errors["body-habitus"]?.message}</p>
              )}
            </div>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span>Height</span>
                    <InputMask
                      mask="999 cm"
                      maskChar={null}
                      {...register("phr_heightCM")}
                      type="text"
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                    />
                  </label>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span>Weight</span>
                    <InputMask
                      mask="99 kg" // Square brackets indicate optional characters
                      maskChar={null}
                      {...register("phr_weightKG")}
                      type="text"
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                    />
                  </label>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="my-4">
                  <label className="flex flex-col">
                    <span>BMI</span>
                    <InputMask
                      mask="99.9"
                      maskPlaceholder=""
                      className="border border-gray-300 px-4 py-2 rounded-lg"
                    />
                  </label>
                </div>
              </Grid>
            </Grid>
            <div className="my-4">
              <p className="font-bold">Nasal mucosa, septum, & turbinates</p>
              {[
                { label: "WNL", field: "phr_nasalMucosaSeptumTurbinatesWNL" },
                {
                  label: "Edema or erythema present",
                  field: "phr_nasalMucosaSeptumTurbinatesEdeOrEryPresent",
                },
              ].map(({ label, field }, index) => {
                return (
                  <label key={field} className="flex items-center">
                    <span>{label}</span>
                    <input
                      //@ts-ignore
                      {...register(field)}
                      aria-invalid={errors[field] ? "true" : "false"}
                      value={errors[field] ? 0 : 1}
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                    />
                  </label>
                );
              })}
              {errors["nasal-mucosa-septum-turbinates"] && (
                <p role="alert" className="text-red-500 text-sm">
                  {errors["nasal-mucosa-septum-turbinates"]?.message}
                </p>
              )}
            </div>
            <div className="my-4">
              <p className="font-bold">Dentition & gums</p>
              {[
                { label: "WNL", field: "phr_dentionAndGumsWNL" },
                {
                  label: "Dental canes",
                  field: "phr_dentionAndGumsDentalCanes",
                },
                { label: "Gingivitis", field: "phr_dentionAndGumsGingivitis" },
              ].map(({ label, field }, index) => {
                return (
                  <label key={field} className="flex items-center">
                    <span>{label}</span>
                    <input
                      //@ts-ignore
                      {...register(field)}
                      aria-invalid={errors[field] ? "true" : "false"}
                      value={errors[field] ? 0 : 1}
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                    />
                  </label>
                );
              })}
              {errors["dentition-gums"] && (
                <p role="alert" className="text-red-500 text-sm">
                  {errors["dentition-gums"]?.message}
                </p>
              )}
            </div>

            <div className="my-4">
              <p className="font-bold">Body Habitus</p>
              {[
                { label: "WNL", field: "phr_bodyHabitusWNL" },
                { label: "Cathetic", field: "phr_bodyHabitusCathetic" },
                { label: "Obese", field: "phr_bodyHabitusObese" },
              ].map(({ label, field }, index) => {
                return (
                  <label key={field} className="flex items-center">
                    <span>{label}</span>
                    <input
                      //@ts-ignore
                      {...register(field)}
                      aria-invalid={errors[field] ? "true" : "false"}
                      value={1}
                      type="radio"
                      className="form-radio h-4 w-4 text-indigo-600 rounded"
                    />
                  </label>
                );
              })}
              {errors["body-habitus"] && (
                <p role="alert">{errors["body-habitus"]?.message}</p>
              )}
            </div>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <div className="my-4">
                  <p className="font-bold">
                    Nasal mucosa, septum, & turbinates
                  </p>
                  {[
                    {
                      label: "WNL",
                      field: "phr_nasalMucosaSeptumTurbinatesWNL",
                    },
                    {
                      label: "Edema or erythema present",
                      field: "phr_nasalMucosaSeptumTurbinatesEdeOrEryPresent",
                    },
                  ].map(({ label, field }, index) => {
                    return (
                      <label key={field} className="flex items-center">
                        <span>{label}</span>
                        <input
                          //@ts-ignore
                          {...register(field)}
                          aria-invalid={errors[field] ? "true" : "false"}
                          value={errors[field] ? 0 : 1}
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                        />
                      </label>
                    );
                  })}
                  {errors["nasal-mucosa-septum-turbinates"] && (
                    <p role="alert" className="text-red-500 text-sm">
                      {errors["nasal-mucosa-septum-turbinates"]?.message}
                    </p>
                  )}
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="my-4">
                  <p className="font-bold">Dentition & gums</p>
                  {[
                    { label: "WNL", field: "phr_dentionAndGumsWNL" },
                    {
                      label: "Dental canes",
                      field: "phr_dentionAndGumsDentalCanes",
                    },
                    {
                      label: "Gingivitis",
                      field: "phr_dentionAndGumsGingivitis",
                    },
                  ].map(({ label, field }, index) => {
                    return (
                      <label key={field} className="flex items-center">
                        <span>{label}</span>
                        <input
                          //@ts-ignore
                          {...register(field)}
                          aria-invalid={errors[field] ? "true" : "false"}
                          value={errors[field] ? 0 : 1}
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                        />
                      </label>
                    );
                  })}
                  {errors["dentition-gums"] && (
                    <p role="alert" className="text-red-500 text-sm">
                      {errors["dentition-gums"]?.message}
                    </p>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Oropharynx</p>
                {[
                  { label: "WNL", field: "phr_oropharynxWNL" },
                  {
                    label: "Edema or erythema present",
                    field: "phr_oropharynxEdeOrEryPresent",
                  },
                  { label: "Oral ulcers", field: "phr_oropharynxOralUlcers" },
                  {
                    label: "Oral petechiae",
                    field: "phr_oropharynxOralPetachie",
                  },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input
                        //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={errors[field] ? 0 : 1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["oropharynx"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["oropharynx"]?.message}
                  </p>
                )}
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Mallampati</p>
                {[
                  { label: "I", field: "phr_mallampati1" },
                  { label: "II", field: "phr_mallampati2" },
                  { label: "III", field: "phr_mallampati3" },
                  { label: "IV", field: "phr_mallampati4" },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input
                        //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={errors[field] ? 0 : 1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["mallampati"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["mallampati"]?.message}
                  </p>
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Neck</p>
                {[
                  { label: "WNL", field: "phr_neckWNL" },
                  {
                    label: "Lymphadenopathy",
                    field: "phr_neckLymphadenopathy",
                  },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={errors[field] ? 0 : 1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["neck"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["neck"]?.message}
                  </p>
                )}
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Thyroid</p>
                {[
                  { label: "WNL", field: "phr_thyroidWNL" },
                  { label: "Thyromegaly", field: "phr_thyroidThyromegaly" },
                  {
                    label: "Nodules Palpable",
                    field: "phr_thyroidNodulesPalpable",
                  },
                  { label: "Neck mass", field: "phr_thyroidNeckMass" },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={errors[field] ? 0 : 1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["thyroid"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["thyroid"]?.message}
                  </p>
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <label className="flex items-center">
                  <span className="font-bold">
                    Chest (Equal chest expansion & symmetrical){" "}
                  </span>
                  <input //@ts-ignore
                    {...register("phr_chestExpansionAndSymmetrical")}
                    aria-invalid={
                      errors["phr_chestExpansionAndSymmetrical"]
                        ? "true"
                        : "false"
                    }
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                  />
                </label>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Jugular Veins</p>
                {[
                  { label: "WNL", field: "phr_jugularVeinsWNL" },
                  { label: "Engorged", field: "phr_jugularVeinsEngorged" },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={errors[field] ? 0 : 1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["jugular-veins"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["jugular-veins"]?.message}
                  </p>
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Respiratory effort</p>
                {[
                  { label: "WNL", field: "phr_respiratoryEffortWNL" },
                  {
                    label: "Accessory muscle use",
                    field: "phr_respiratoryEffortAccessoryMuscleUse",
                  },
                  {
                    label: "Intercostal retractions",
                    field: "phr_respiratoryEffortIntercostalRetractions",
                  },
                  {
                    label: "Paradoxic movements",
                    field: "phr_respiratoryEffortParadoxicMovements",
                  },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={errors[field] ? 0 : 1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["respiratory-effort"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["respiratory-effort"]?.message}
                  </p>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Chest percussion</p>
                {[
                  { label: "WNL", field: "phr_chestPercussionWNL" },
                  {
                    label: "Dullness to percussion",
                    field: "phr_chestPercussionDullnessToPercussion",
                  },
                  {
                    label: "Hyperresonance",
                    field: "phr_chestPercussionHyperResonance",
                  },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={errors[field] ? 0 : 1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["chest-percussion"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["chest-percussion"]?.message}
                  </p>
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Auscultation</p>
                {[
                  { label: "WNL", field: "phr_AuscultationWNL" },
                  {
                    label: "Bronchial breath sounds",
                    field: "phr_AuscultationBronchialBreathSounds",
                  },
                  { label: "Egophony", field: "phr_AuscultationEgophony" },
                  { label: "Rales", field: "phr_AuscultationRales" },
                  { label: "Rhonchi", field: "phr_AuscultationRhonchi" },
                  { label: "Wheezes", field: "phr_AuscultationWheezes" },
                  { label: "Rub", field: "phr_AuscultationRub" },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["auscultation"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["auscultation"]?.message}
                  </p>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Tactile fremitus</p>
                {[
                  { label: "WNL", field: "phr_tactileFremitusWNL" },
                  { label: "Increased", field: "phr_tactileFremitusIncreased" },
                  { label: "Decreased", field: "phr_tactileFremitusDecreased" },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={errors[field] ? 0 : 1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["tactile-fremitus"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["tactile-fremitus"]?.message}
                  </p>
                )}
              </div>
            </Grid>
          </Grid>

          <div className="my-4">
            <label className="flex flex-col">
              <span className="font-bold">Additional Findings</span>
              <textarea
                {...register("phr_RespiratoryAdditionalFindings")}
                className="border border-gray-300 px-4 py-2 rounded-lg"
              />
            </label>
          </div>
          <div className="my-4">
            <p className="font-bold">Heart sounds</p>
            {[
              {
                label: "Clear S1",
                field: "phr_heartSoundsClearS1",
              },
              {
                label: "Clear S2",
                field: "phr_heartSoundsClearS2",
              },
              {
                label: "No murmur, rub or gallop",
                field: "phr_heartSoundsNoMurmur",
              },
              {
                label: "Gallop audible",
                field: "phr_heartSoundsGallopAudible",
              },
              { label: "Rub audible", field: "phr_heartSoundsRubAudible" },
              {
                label: "Murmurs present",
                field: "phr_heartSoundsMurmursPresent",
              },
              { label: "Systolic", field: "phr_heartSoundsSystolic" },
              { label: "Diastolic", field: "phr_heartSoundsDiastolic" },
            ].map(({ label, field }, index) => {
              return (
                <label key={field} className="flex items-center">
                  <span>{label}</span>
                  <input //@ts-ignore
                    {...register(field)}
                    aria-invalid={errors[field] ? "true" : "false"}
                    value={1}
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                  />
                </label>
              );
            })}
            {errors["heart-sounds"] && (
              <p role="alert" className="text-red-500 text-sm">
                {errors["heart-sounds"]?.message}
              </p>
            )}
          </div>
          <div className="my-4">
            <label className="flex flex-col">
              <span className="font-bold">GRADE</span>
              <textarea
                {...register("phr_grade")}
                className="border border-gray-300 px-4 py-2 rounded-lg"
                placeholder="Enter Grade"
              />
            </label>
          </div>
          <div className="my-4">
            <label className="flex flex-col">
              <span className="font-bold">Additional Findings</span>
              <textarea
                {...register("phr_CardiovascularAdditionalFindings")}
                className="border border-gray-300 px-4 py-2 rounded-lg"
              ></textarea>
            </label>
          </div>
          <div className="my-4">
            <label className="font-bold">Abdomen</label>
            <div className="flex items-center">
              <p className="mr-4">WNL</p>
              <input //@ts-ignore
                {...register("phr_abdomenWNL")}
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 rounded"
              />
            </div>
          </div>
          <div className="my-4">
            <label className="flex items-center">
              <input
                {...register("phr_massPresent")}
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 rounded mr-2"
                onChange={handleMassPresentChange}
              />
              <span className="font-bold">Mass Present</span>
            </label>
            {massPresentChecked && (
              <label className="flex flex-col">
                <input
                  {...register("phr_specifyMassPresent")}
                  type="text"
                  className="border border-gray-300 px-4 py-2 rounded-lg mt-2"
                  placeholder="Enter additional information"
                />
              </label>
            )}
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Bowel Sounds</p>
                {[
                  {
                    label: "normoactive",
                    field: "phr_bowelSoundsNormaoactive",
                  },
                  { label: "Up", field: "phr_bowelSoundsUp" },
                  { label: "Down", field: "phr_bowelSoundsDown" },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["bowel-sounds"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["bowel-sounds"]?.message}
                  </p>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <label className="font-bold">Liver & Spleen</label>
                <div className="flex items-center">
                  <p className="mr-4">Palpable and WNL</p>
                  <input //@ts-ignore
                    {...register("liver-spleen")}
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Organomegaly</p>
                {[
                  { label: "Liver", field: "phr_organomegalyLiver" },
                  { label: "Spleen", field: "phr_organomegalySpleen" },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={errors[field] ? 0 : 1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["organomegaly"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["organomegaly"]?.message}
                  </p>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="my-4">
                <p className="font-bold">Unable to palpate</p>
                {[
                  { label: "Liver", field: "phr_unableToPalpateLiver" },
                  { label: "Spleen", field: "phr_unableToPalpateSpleen" },
                ].map(({ label, field }, index) => {
                  return (
                    <label key={field} className="flex items-center">
                      <span>{label}</span>
                      <input //@ts-ignore
                        {...register(field)}
                        aria-invalid={errors[field] ? "true" : "false"}
                        value={errors[field] ? 0 : 1}
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                      />
                    </label>
                  );
                })}
                {errors["liver-spleen"] && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors["liver-spleen"]?.message}
                  </p>
                )}
              </div>
            </Grid>
          </Grid>

          <div className="my-4">
            <label className="flex flex-col">
              <span className="font-bold">DRE Findings</span>
              <textarea
                {...register("phr_DREFindings")}
                className="border border-gray-300 px-4 py-2 rounded-lg"
              ></textarea>
            </label>
          </div>
          <div className="my-4">
            <p className="font-bold">Kidney punch sign</p>
            {[
              { label: "Negative", field: "phr_kidneyPunchSignNegative" },
              { label: "Positive", field: "phr_kidneyPunchSignPositive" },
            ].map(({ label, field }, index) => {
              return (
                <label key={field} className="flex items-center">
                  <span>{label}</span>
                  <input //@ts-ignore
                    {...register(field)}
                    aria-invalid={errors[field] ? "true" : "false"}
                    value={errors[field] ? 0 : 1}
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                  />
                </label>
              );
            })}
            {errors["kidney-punch-sign"] && (
              <p role="alert" className="text-red-500 text-sm">
                {errors["kidney-punch-sign"]?.message}
              </p>
            )}
          </div>
          <div className="my-4">
            <p className="font-bold">If Positive</p>
            {[
              { label: "R", field: "phr_IfPositiveR" },
              { label: "L", field: "phr_IfPositiveL" },
            ].map(({ label, field }, index) => {
              return (
                <label key={field} className="flex items-center">
                  <span>{label}</span>
                  <input //@ts-ignore
                    {...register(field)}
                    aria-invalid={errors[field] ? "true" : "false"}
                    value={errors[field] ? 0 : 1}
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                  />
                </label>
              );
            })}
            {errors["if-positive"] && (
              <p role="alert" className="text-red-500 text-sm">
                {errors["if-positive"]?.message}
              </p>
            )}
          </div>
          <div className="my-4">
            <p className="font-bold">Extremities</p>
            {[
              { label: "WNL", field: "phr_extremitiesWNL" },
              { label: "Clubbing", field: "phr_extremitiesClubbing" },
              { label: "Cyanosis", field: "phr_extremitiesCyanosis" },
              { label: "Petechiae", field: "phr_extremitiesPetachiae" },
            ].map(({ label, field }, index) => {
              return (
                <label key={field} className="flex items-center">
                  <span>{label}</span>
                  <input //@ts-ignore
                    {...register(field)}
                    aria-invalid={errors[field] ? "true" : "false"}
                    value={1}
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                  />
                </label>
              );
            })}
            {errors["extremities"] && (
              <p role="alert" className="text-red-500 text-sm">
                {errors["extremities"]?.message}
              </p>
            )}
          </div>
          <div className="my-4">
            <label className="flex flex-col">
              <span className="font-bold">Capillary refill time</span>
              <InputMask
                mask="99.99 s" // Set the mask to accept up to 2 digits followed by decimal point and two digits, then " s" for seconds
                maskChar={null} // Hide the mask character
                className="border border-gray-300 px-4 py-2 rounded-lg"
                placeholder="Enter Capillary refill time"
              />
            </label>
          </div>
          <div className="my-4">
            <p className="font-bold">Skin</p>
            {[
              { label: "WNL", field: "phr_skinWNL" },
              { label: "Rash", field: "phr_skinRash" },
              { label: "Eccymosis", field: "phr_skinEccymosis" },
              { label: "Nodules", field: "phr_skinNodules" },
              { label: "Ulcer", field: "phr_skinUlcer" },
            ].map(({ label, field }, index) => {
              return (
                <label key={field} className="flex items-center">
                  <span>{label}</span>
                  <input //@ts-ignore
                    {...register(field)}
                    aria-invalid={errors[field] ? "true" : "false"}
                    value={1}
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                  />
                </label>
              );
            })}
            {errors["skin"] && (
              <p role="alert" className="text-red-500 text-sm">
                {errors["skin"]?.message}
              </p>
            )}
          </div>
          <div className="my-4">
            <label className="flex flex-col">
              <span className="font-bold">Assessment</span>
              <textarea
                {...register("phr_Assessment")}
                className="border border-gray-300 px-4 py-2 rounded-lg"
              ></textarea>
            </label>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting} // This will disable the button and show a loading spinner when submitting
            style={{
              marginTop: 16,
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
            }}
          >
            Save
          </Button>
        </form>
      </DashboardCard>
    </PageContainer>
  );
}

export default EHRForm;
EHRForm.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
