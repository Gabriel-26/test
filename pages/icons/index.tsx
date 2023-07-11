import type { ReactElement } from "react";
import PageContainer from "../../src/components/container/PageContainer";
import DashboardCard from "../../src/components/shared/DashboardCard";
import FullLayout from "../../src/layouts/full/FullLayout";
import { useForm } from "react-hook-form";

export function EHRForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm({
    defaultValues: {
      "name": "",
      "age": "",
      "gender": "",
      "room": "",
      "chief-complaint": "",
      "date": "",
      "start-time": "",
      "stop-time": "",
      "history-of-present-i-ilness": "",
      "patient": [
        "Yes"
      ],
      "hx-obtained-from": "",
      "med-records": [
        "Yes"
      ],
      "allergies": [
        "Yes"
      ],
      "allergie": "",
      "medhistory": [],
      "others": "",
      "previous-hospitalizations": [],
      "previous-hospitalization": "",
      "maintenance-medications-herbal-drug-use": [],
      "maintenance-medications-herbal-drug-us": "",
      "malignancy": "",
      "malignanc": "",
      "surgeries": "",
      "surgerytext": "",
      "vaccination-history": "",
      "tobacco": "",
      "pack-years": "",
      "quit-date": "",
      "recreational-drugs": "",
      "recreational-drugs-taken": "",
      "alcohol": "",
      "drinks": "",
      "no-of-drinks": "",
      "family-history-heredofamilial-diseases": "",
      "civil-status-children": "",
      "other-pertinent-history": "",
      "sitting": "",
      "standing": "",
      "lying": "",
      "hr": "",
      "rr": "",
      "t": "",
      "sp-o-2": "",
      "body-habitus": "",
      "height": "",
      "weight-kg": "",
      "bmi": "",
      "nasal-mucosa-septum-turbinates": [],
      "dentition-gums": [],
      "oropharynx": [],
      "mallampati": [],
      "neck": [],
      "thyroid": [],
      "jugular-veins": [],
      "chest": [
        "chest"
      ],
      "respiratory-effort": [],
      "chest-percussion": [],
      "tactile-fremitus": [],
      "auscultation": [],
      "additional-findings": "",
      "heart-sounds": [],
      "grade": "",
      "additional-finding": "",
      "abdomen": [],
      "mass-present": "",
      "bowel-sounds": [],
      "liver-spleen": [],
      "unable-to-palpate": [],
      "organomegaly": [],
      "dre-findings": "",
      "kidney-punch-sign": [],
      "if-positive": [],
      "extremities": [],
      "capillary-refill-time": "",
      "skin": [],
      "assessment": "",
      "resident-s-name-signature": ""
    }
  });
  const onSubmit = (data: any) => alert(JSON.stringify(data));



  return (
    <>
    <PageContainer title="EHR Form" description="this is Icons">
      <DashboardCard title="EHR Form">
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <h1>EHR Form</h1> */}

      <div>
        <label>
          <span>Name</span>
          <input
            {...register("name")}
            placeholder="Name"
            type="text"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Age</span>
          <input
            {...register("age")}
            placeholder="Age"
            type="number"
          />
        </label>
      </div>

      <div>
        <p>Gender</p>
        {[
          { label: "M", value: "male" },
          { label: "F", value: "Female" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("gender")}
                aria-invalid={errors["gender"] ? "true" : "false"}
                value={value}
                type="radio"
              />
            </label>
          );
        })}
        {errors["gender"] && <p role="alert">{errors["gender"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Room</span>
          <input
            {...register("room")}
            placeholder="Room"
            type="text"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Chief Complaint</span>
          <textarea
            {...register("chief-complaint")}
            placeholder="Input"
             
          />
        </label>
      </div>

      <div>
        <label>
          <span>Date</span>
          <input
            {...register("date")}
            type="date"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Start Time</span>
          <input
            {...register("start-time")}
            type="time"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Stop Time</span>
          <input
            {...register("stop-time")}
            type="time"
          />
        </label>
      </div>

      <div>
        <label>
          <span>History of Present IIlness</span>
          <textarea
            {...register("history-of-present-i-ilness")}
             
          />
        </label>
      </div>

      <div>
        <label>
          <span>Patient is nonverbal</span>
          <input
            {...register("patient")}
            type="checkbox"
          />
        </label>
      </div>

      <div>
        <p>Hx obtained from</p>
        {[
          { label: "Parent", value: "Parent" },
          { label: "Family", value: "Family" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("hx-obtained-from")}
                aria-invalid={errors["hx-obtained-from"] ? "true" : "false"}
                value={value}
                type="radio"
              />
            </label>
          );
        })}
        {errors["hx-obtained-from"] && <p role="alert">{errors["hx-obtained-from"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Med Records</span>
          <input
            {...register("med-records")}
            type="checkbox"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Allergies</span>
          <input
            {...register("allergies")}
            type="checkbox"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Allergies</span>
          <textarea
            {...register("allergie")}
             
          />
        </label>
      </div>

      <div>
        <p>Past Medical History</p>
        {[
          { label: "Asthma", value: "Asthma" },
          { label: "HTN", value: "HTN" },
          { label: "Thyroid", value: "Thyroid" },
          { label: "Diabetes", value: "Diabetes" },
          { label: "Hepatic,Renal", value: "Hepatic" },
          { label: "Tuberculosis", value: "Tuberculosis" },
          { label: "Psychiatric", value: "Psychiatric" },
          { label: "CAD, CHF", value: "CAD, CHF" },
          { label: "Others", value: "Others" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("medhistory")}
                aria-invalid={errors["medhistory"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["medhistory"] && <p role="alert">{errors["medhistory"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Others</span>
          <textarea
            {...register("others")}
             
          />
        </label>
      </div>

      <div>
        <label>
          <span>Previous Hospitalizations </span>
          <textarea
            {...register("previous-hospitalization")}
             
          />
        </label>
      </div>

      <div>
        <label>
          <span>Maintenance Medications/Herbal Drug Use</span>
          <textarea
            {...register("maintenance-medications-herbal-drug-us")}
             
          />
        </label>
      </div>

      <div>
        <p>Malignancy</p>
        {[
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("malignancy")}
                aria-invalid={errors["malignancy"] ? "true" : "false"}
                value={value}
                type="radio"
              />
            </label>
          );
        })}
        {errors["malignancy"] && <p role="alert">{errors["malignancy"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Malignancy </span>
          <textarea
            {...register("malignanc")}
             
          />
        </label>
      </div>

      <div>
        <p>Surgeries</p>
        {[
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("surgeries")}
                aria-invalid={errors["surgeries"] ? "true" : "false"}
                value={value}
                type="radio"
              />
            </label>
          );
        })}
        {errors["surgeries"] && <p role="alert">{errors["surgeries"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Surgeries</span>
          <textarea
            {...register("surgerytext")}
             
          />
        </label>
      </div>

      <div>
        <label>
          <span>Vaccination History</span>
          <textarea
            {...register("vaccination-history")}
             
          />
        </label>
      </div>

      <div>
        <p>Tobacco/Cigarette</p>
        {[
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("tobacco")}
                aria-invalid={errors["tobacco"] ? "true" : "false"}
                value={value}
                type="radio"
              />
            </label>
          );
        })}
        {errors["tobacco"] && <p role="alert">{errors["tobacco"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Pack Years</span>
          <input
            {...register("pack-years")}
            placeholder="0"
            type="number"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Quit Date</span>
          <input
            {...register("quit-date")}
            type="date"
          />
        </label>
      </div>

      <div>
        <p>Recreational Drugs</p>
        {[
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("recreational-drugs")}
                aria-invalid={errors["recreational-drugs"] ? "true" : "false"}
                value={value}
                type="radio"
              />
            </label>
          );
        })}
        {errors["recreational-drugs"] && <p role="alert">{errors["recreational-drugs"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Recreational Drugs taken</span>
          <textarea
            {...register("recreational-drugs-taken")}
             
          />
        </label>
      </div>

      <div>
        <p>Alcohol</p>
        {[
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("alcohol")}
                aria-invalid={errors["alcohol"] ? "true" : "false"}
                value={value}
                type="radio"
              />
            </label>
          );
        })}
        {errors["alcohol"] && <p role="alert">{errors["alcohol"]?.message}</p>}
      </div>

      <div>
        <p>Drinks per</p>
        {[
          { label: "Day", value: "Day" },
          { label: "Week", value: "Week" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("drinks")}
                aria-invalid={errors["drinks"] ? "true" : "false"}
                value={value}
                type="radio"
              />
            </label>
          );
        })}
        {errors["drinks"] && <p role="alert">{errors["drinks"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>No. of Drinks</span>
          <input
            {...register("no-of-drinks")}
            placeholder="0"
            type="number"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Family History(Heredofamilial Diseases)</span>
          <textarea
            {...register("family-history-heredofamilial-diseases")}
             
          />
        </label>
      </div>

      <div>
        <label>
          <span>Civil Status/Children</span>
          <textarea
            {...register("civil-status-children")}
             
          />
        </label>
      </div>

      <div>
        <label>
          <span>Other Pertinent History</span>
          <textarea
            {...register("other-pertinent-history")}
             
          />
        </label>
      </div>

      <div>
        <label>
          <span>Sitting</span>
          <input
            {...register("sitting")}
            type="number"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Standing</span>
          <input
            {...register("standing")}
            type="number"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Lying</span>
          <input
            {...register("lying")}
            type="number"
          />
        </label>
      </div>

      <div>
        <p>HR</p>
        {[
          { label: "Regular", value: "Regular" },
          { label: "Irregular", value: "Irregular" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("hr")}
                aria-invalid={errors["hr"] ? "true" : "false"}
                value={value}
                type="radio"
              />
            </label>
          );
        })}
        {errors["hr"] && <p role="alert">{errors["hr"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>RR</span>
          <input
            {...register("rr")}
            type="number"
          />
        </label>
      </div>

      <div>
        <label>
          <span>T*</span>
          <input
            {...register("t")}
            type="number"
          />
        </label>
      </div>

      <div>
        <label>
          <span>SpO2</span>
          <input
            {...register("sp-o-2")}
            type="number"
          />
        </label>
      </div>

      <div>
        <p>Body Habitus</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Cathetic", value: "Cathetic" },
          { label: "Obese", value: "Obese" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("body-habitus")}
                aria-invalid={errors["body-habitus"] ? "true" : "false"}
                value={value}
                type="radio"
              />
            </label>
          );
        })}
        {errors["body-habitus"] && <p role="alert">{errors["body-habitus"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Height (cm)</span>
          <input
            {...register("height")}
            type="text"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Weight (kg)</span>
          <input
            {...register("weight-kg")}
            type="text"
          />
        </label>
      </div>

      <div>
        <label>
          <span>BMI</span>
          <input
            {...register("bmi")}
            type="number"
          />
        </label>
      </div>

      <div>
        <p>Nasal mucosa, septum, & turbinates</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Edema or erythema present", value: "Edema or erythema present" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("nasal-mucosa-septum-turbinates")}
                aria-invalid={errors["nasal-mucosa-septum-turbinates"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["nasal-mucosa-septum-turbinates"] && <p role="alert">{errors["nasal-mucosa-septum-turbinates"]?.message}</p>}
      </div>

      <div>
        <p>Dentition & gums</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Dental canes", value: "Dental canes" },
          { label: "Gingivitis", value: "Gingivitis" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("dentition-gums")}
                aria-invalid={errors["dentition-gums"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["dentition-gums"] && <p role="alert">{errors["dentition-gums"]?.message}</p>}
      </div>

      <div>
        <p>Oropharynx </p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Edema or erythema present", value: "Edema or erythema present" },
          { label: "Oral ulcers", value: "Oral ulcers" },
          { label: "Oral petechiae", value: "Oral petechiae" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("oropharynx")}
                aria-invalid={errors["oropharynx"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["oropharynx"] && <p role="alert">{errors["oropharynx"]?.message}</p>}
      </div>

      <div>
        <p>Mallampati</p>
        {[
          { label: "I", value: "I" },
          { label: "II", value: "II" },
          { label: "III", value: "III" },
          { label: "IV", value: "IV" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("mallampati")}
                aria-invalid={errors["mallampati"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["mallampati"] && <p role="alert">{errors["mallampati"]?.message}</p>}
      </div>

      <div>
        <p>Neck</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Lymphadenopathy", value: "Lymphadenopathy" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("neck")}
                aria-invalid={errors["neck"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["neck"] && <p role="alert">{errors["neck"]?.message}</p>}
      </div>

      <div>
        <p>Thyroid</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Thyromegaly", value: "Thyromegaly" },
          { label: "Nodules Palpable", value: "Nodules Palpable" },
          { label: "Neck mass", value: "Neck mass" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("thyroid")}
                aria-invalid={errors["thyroid"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["thyroid"] && <p role="alert">{errors["thyroid"]?.message}</p>}
      </div>

      <div>
        <p>Jugular Veins</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Engorged", value: "Engorged" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("jugular-veins")}
                aria-invalid={errors["jugular-veins"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["jugular-veins"] && <p role="alert">{errors["jugular-veins"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Chest</span>
          <input
            {...register("chest")}
            type="checkbox"
          />
        </label>
      </div>

      <div>
        <p>Respiratory effort</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Accessory muscle use", value: "Accessory muscle use" },
          { label: "Intercostal retractions", value: "Intercostal retractions" },
          { label: "Paradoxic movements", value: "Paradoxic movements" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("respiratory-effort")}
                aria-invalid={errors["respiratory-effort"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["respiratory-effort"] && <p role="alert">{errors["respiratory-effort"]?.message}</p>}
      </div>

      <div>
        <p>Chest percussion</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Dullness to percussion", value: "Dullness to percussion" },
          { label: "Hyperresonance", value: "Hyperresonance" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("chest-percussion")}
                aria-invalid={errors["chest-percussion"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["chest-percussion"] && <p role="alert">{errors["chest-percussion"]?.message}</p>}
      </div>

      <div>
        <p>Tactile fremitus</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Increased", value: "Increased" },
          { label: "Decreased", value: "Decreased" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("tactile-fremitus")}
                aria-invalid={errors["tactile-fremitus"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["tactile-fremitus"] && <p role="alert">{errors["tactile-fremitus"]?.message}</p>}
      </div>

      <div>
        <p>Auscultation</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Bronchial breath sounds ", value: "Bronchial breath sounds" },
          { label: "Egophony", value: "Egophony" },
          { label: "Rales", value: "Rales" },
          { label: "Rhonchi", value: "Rhonchi" },
          { label: "Wheezes", value: "Wheezes" },
          { label: "Rub", value: "Rub" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("auscultation")}
                aria-invalid={errors["auscultation"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["auscultation"] && <p role="alert">{errors["auscultation"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Additional Findings</span>
          <textarea
            {...register("additional-findings")}
             
          />
        </label>
      </div>

      <div>
        <p>Heart sounds</p>
        {[
          { label: "Clear S1 & S2", value: "Clear S1 & S2" },
          { label: "No murmur, rub or gallop", value: "No murmur, rub or gallop" },
          { label: "Gallop audible", value: "Gallop audible" },
          { label: "Rub audible", value: "Rub audible" },
          { label: "Murmurs present", value: "Murmurs present" },
          { label: "Systolic", value: "Systolic" },
          { label: "Diastolic", value: "Diastolic" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("heart-sounds")}
                aria-invalid={errors["heart-sounds"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["heart-sounds"] && <p role="alert">{errors["heart-sounds"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Grade</span>
          <input
            {...register("grade")}
            type="number"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Additional Findings</span>
          <textarea
            {...register("additional-finding")}
             
          />
        </label>
      </div>

      <div>
        <label>
          <span>Abdomen</span>
          <input
            {...register("abdomen")}
            type="checkbox"
          />
        </label>
      </div>

      <div>
        <label>
          <span>Mass Present</span>
          <input
            {...register("mass-present")}
            type="text"
          />
        </label>
      </div>

      <div>
        <p>Bowel Sounds</p>
        {[
          { label: "normoactive", value: "normoactive" },
          { label: "Up", value: "Up" },
          { label: "Down", value: "" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("bowel-sounds")}
                aria-invalid={errors["bowel-sounds"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["bowel-sounds"] && <p role="alert">{errors["bowel-sounds"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Liver & Spleen</span>
          <input
            {...register("liver-spleen")}
            type="checkbox"
          />
        </label>
      </div>

      <div>
        <p>Unable to palpate</p>
        {[
          { label: "Liver", value: "Liver" },
          { label: "Spleen", value: "Spleen" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("unable-to-palpate")}
                aria-invalid={errors["unable-to-palpate"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["unable-to-palpate"] && <p role="alert">{errors["unable-to-palpate"]?.message}</p>}
      </div>

      <div>
        <p>Organomegaly</p>
        {[
          { label: "Liver", value: "Liver" },
          { label: "Spleen", value: "Spleen" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("organomegaly")}
                aria-invalid={errors["organomegaly"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["organomegaly"] && <p role="alert">{errors["organomegaly"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>DRE Findings</span>
          <textarea
            {...register("dre-findings")}
             
          />
        </label>
      </div>

      <div>
        <p>Kidney punch sign</p>
        {[
          { label: "Negative ", value: "Negative" },
          { label: "Positive", value: "Positive" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("kidney-punch-sign")}
                aria-invalid={errors["kidney-punch-sign"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["kidney-punch-sign"] && <p role="alert">{errors["kidney-punch-sign"]?.message}</p>}
      </div>

      <div>
        <p>If Positive</p>
        {[
          { label: "R", value: "R" },
          { label: "L", value: "L" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("if-positive")}
                aria-invalid={errors["if-positive"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["if-positive"] && <p role="alert">{errors["if-positive"]?.message}</p>}
      </div>

      <div>
        <p>Extremities</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Clubbing", value: "Clubbing" },
          { label: "Cyanosis", value: "Cyanosis" },
          { label: "Petechiae", value: "Petechiae" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("extremities")}
                aria-invalid={errors["extremities"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["extremities"] && <p role="alert">{errors["extremities"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Capillary refill time</span>
          <input
            {...register("capillary-refill-time")}
            type="number"
          />
        </label>
      </div>

      <div>
        <p>Skin</p>
        {[
          { label: "WNL", value: "WNL" },
          { label: "Rash", value: "Rash" },
          { label: "Eccymosis", value: "Eccymosis" },
          { label: "Nodules", value: "Nodules" },
          { label: "Ulcer", value: "Ulcer" }
        ].map(({ label, value }, index) => {
          return (
            <label key={value + index}>
              <span>{label}</span>
              <input
                {...register("skin")}
                aria-invalid={errors["skin"] ? "true" : "false"}
                value={value}
                type="checkbox"
              />
            </label>
          );
        })}
        {errors["skin"] && <p role="alert">{errors["skin"]?.message}</p>}
      </div>

      <div>
        <label>
          <span>Assessment</span>
          <textarea
            {...register("assessment")}
             
          />
        </label>
      </div>


      <button disabled={isSubmitting}>Submit</button>
    </form>
    
      </DashboardCard>
    </PageContainer>
  </>
  )
      };
    

export default EHRForm;
EHRForm.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
}
