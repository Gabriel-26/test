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
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      room: "",
      "chief-complaint": "",
      date: "",
      "start-time": "",
      "stop-time": "",
      "history-of-present-i-ilness": "",
      patient: ["Yes"],
      "hx-obtained-from": "",
      "med-records": ["Yes"],
      allergies: ["Yes"],
      allergie: "",
      medhistory: [],
      others: "",
      "previous-hospitalizations": [],
      "previous-hospitalization": "",
      "maintenance-medications-herbal-drug-use": [],
      "maintenance-medications-herbal-drug-us": "",
      malignancy: "",
      malignanc: "",
      surgeries: "",
      surgerytext: "",
      "vaccination-history": "",
      tobacco: "",
      "pack-years": "",
      "quit-date": "",
      "recreational-drugs": "",
      "recreational-drugs-taken": "",
      alcohol: "",
      drinks: "",
      "no-of-drinks": "",
      "family-history-heredofamilial-diseases": "",
      "civil-status-children": "",
      "other-pertinent-history": "",
      sitting: "",
      standing: "",
      lying: "",
      hr: "",
      rr: "",
      t: "",
      "sp-o-2": "",
      "body-habitus": "",
      height: "",
      "weight-kg": "",
      bmi: "",
      "nasal-mucosa-septum-turbinates": [],
      "dentition-gums": [],
      oropharynx: [],
      mallampati: [],
      neck: [],
      thyroid: [],
      "jugular-veins": [],
      chest: ["chest"],
      "respiratory-effort": [],
      "chest-percussion": [],
      "tactile-fremitus": [],
      auscultation: [],
      "additional-findings": "",
      "heart-sounds": [],
      grade: "",
      "additional-finding": "",
      abdomen: [],
      "mass-present": "",
      "bowel-sounds": [],
      "liver-spleen": [],
      "unable-to-palpate": [],
      organomegaly: [],
      "dre-findings": "",
      "kidney-punch-sign": [],
      "if-positive": [],
      extremities: [],
      "capillary-refill-time": "",
      skin: [],
      assessment: "",
      "resident-s-name-signature": "",
    },
  });
  const onSubmit = (data: any) => alert(JSON.stringify(data));

  return (
    <>
      <PageContainer title="EHR Form" description="this is Icons">
        <DashboardCard title="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl">EHR Form</h1>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">Name</span>
                <input
                  {...register("name")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                  placeholder="Name"
                  type="text"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">Age</span>
                <input
                  {...register("age")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                  placeholder="Age"
                  type="number"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="mb-2">Gender</p>
              {[
                { label: "M", value: "male" },
                { label: "F", value: "Female" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span className="mr-2">{label}</span>
                    <input
                      {...register("gender")}
                      className="border border-gray-300 rounded-lg"
                      aria-invalid={errors["gender"] ? "true" : "false"}
                      value={value}
                      type="radio"
                    />
                  </label>
                );
              })}
              {errors["gender"] && (
                <p role="alert">{errors["gender"]?.message}</p>
              )}
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">Room</span>
                <input
                  {...register("room")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                  placeholder="Room"
                  type="text"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">Chief Complaint</span>
                <textarea
                  {...register("chief-complaint")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                  placeholder="Input"
                />
              </label>
            </div>

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

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">Start Time</span>
                <input
                  {...register("start-time")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                  type="time"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">Stop Time</span>
                <input
                  {...register("stop-time")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                  type="time"
                />
              </label>
            </div>
            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">History of Present Illness</span>
                <textarea
                  {...register("history-of-present-i-ilness")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex items-center">
                <span className="mr-2">Patient is nonverbal</span>
                <input
                  {...register("patient")}
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                  type="checkbox"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="mb-2">Hx obtained from</p>
              {[
                { label: "Parent", value: "Parent" },
                { label: "Family", value: "Family" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span className="mr-2">{label}</span>
                    <input
                      {...register("hx-obtained-from")}
                      className="form-radio h-5 w-5 text-indigo-600 rounded"
                      aria-invalid={
                        errors["hx-obtained-from"] ? "true" : "false"
                      }
                      value={value}
                      type="radio"
                    />
                  </label>
                );
              })}
              {errors["hx-obtained-from"] && (
                <p role="alert">{errors["hx-obtained-from"]?.message}</p>
              )}
            </div>

            <div className="my-4">
              <label className="flex items-center">
                <span className="mr-2">Med Records</span>
                <input
                  {...register("med-records")}
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                  type="checkbox"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex items-center">
                <span className="mr-2">Allergies</span>
                <input
                  {...register("allergies")}
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                  type="checkbox"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">Allergies</span>
                <textarea
                  {...register("allergie")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="mb-2 font-medium">Past Medical History</p>
              {[
                { label: "Asthma", value: "Asthma" },
                { label: "HTN", value: "HTN" },
                { label: "Thyroid", value: "Thyroid" },
                { label: "Diabetes", value: "Diabetes" },
                { label: "Hepatic, Renal", value: "Hepatic" },
                { label: "Tuberculosis", value: "Tuberculosis" },
                { label: "Psychiatric", value: "Psychiatric" },
                { label: "CAD, CHF", value: "CAD, CHF" },
                { label: "Others", value: "Others" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center mt-2">
                    <input
                      {...register("medhistory")}
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded mr-2"
                      aria-invalid={errors["medhistory"] ? "true" : "false"}
                      value={value}
                      type="checkbox"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
              {errors["medhistory"] && (
                <p role="alert">{errors["medhistory"]?.message}</p>
              )}
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">Others</span>
                <textarea
                  {...register("others")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">Previous Hospitalizations</span>
                <textarea
                  {...register("previous-hospitalization")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">
                  Maintenance Medications/Herbal Drug Use
                </span>
                <textarea
                  {...register("maintenance-medications-herbal-drug-us")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="mb-2 font-medium">Malignancy</p>
              {[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <input
                      {...register("malignancy")}
                      className="form-radio h-4 w-4 text-indigo-600 rounded mr-2"
                      aria-invalid={errors["malignancy"] ? "true" : "false"}
                      value={value}
                      type="radio"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
              {errors["malignancy"] && (
                <p role="alert">{errors["malignancy"]?.message}</p>
              )}
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="mb-2">Malignancy</span>
                <textarea
                  {...register("malignancy")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="mb-2 font-medium">Surgeries</p>
              {[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <input
                      {...register("surgeries")}
                      className="form-radio h-4 w-4 text-indigo-600 rounded mr-2"
                      aria-invalid={errors["surgeries"] ? "true" : "false"}
                      value={value}
                      type="radio"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
              {errors["surgeries"] && (
                <p role="alert">{errors["surgeries"]?.message}</p>
              )}
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Surgeries</span>
                <textarea
                  {...register("surgerytext")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Vaccination History</span>
                <textarea
                  {...register("vaccination-history")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p>Tobacco/Cigarette</p>
              {[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span className="mr-2">{label}</span>
                    <input
                      {...register("tobacco")}
                      aria-invalid={errors["tobacco"] ? "true" : "false"}
                      value={value}
                      type="radio"
                      className="form-radio h-4 w-4 text-indigo-600 rounded"
                    />
                  </label>
                );
              })}
              {errors["tobacco"] && (
                <p role="alert">{errors["tobacco"]?.message}</p>
              )}
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Pack Years</span>
                <input
                  {...register("pack-years")}
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
                  {...register("quit-date")}
                  type="date"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p>Recreational Drugs</p>
              {[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span className="mr-2">{label}</span>
                    <input
                      {...register("recreational-drugs")}
                      aria-invalid={
                        errors["recreational-drugs"] ? "true" : "false"
                      }
                      value={value}
                      type="radio"
                      className="form-radio h-4 w-4 text-indigo-600 rounded"
                    />
                  </label>
                );
              })}
              {errors["recreational-drugs"] && (
                <p role="alert">{errors["recreational-drugs"]?.message}</p>
              )}
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Recreational Drugs taken</span>
                <textarea
                  {...register("recreational-drugs-taken")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p>Alcohol</p>
              {[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span className="mr-2">{label}</span>
                    <input
                      {...register("alcohol")}
                      aria-invalid={errors["alcohol"] ? "true" : "false"}
                      value={value}
                      type="radio"
                      className="form-radio h-4 w-4 text-indigo-600 rounded"
                    />
                  </label>
                );
              })}
              {errors["alcohol"] && (
                <p role="alert">{errors["alcohol"]?.message}</p>
              )}
            </div>

            <div className="my-4">
              <p>Drinks per</p>
              {[
                { label: "Day", value: "Day" },
                { label: "Week", value: "Week" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("drinks")}
                      aria-invalid={errors["drinks"] ? "true" : "false"}
                      value={value}
                      type="radio"
                      className="form-radio h-4 w-4 text-indigo-600 rounded"
                    />
                  </label>
                );
              })}
              {errors["drinks"] && (
                <p role="alert">{errors["drinks"]?.message}</p>
              )}
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>No. of Drinks</span>
                <input
                  {...register("no-of-drinks")}
                  placeholder="0"
                  type="number"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Family History(Heredofamilial Diseases)</span>
                <textarea
                  {...register("family-history-heredofamilial-diseases")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Civil Status/Children</span>
                <textarea
                  {...register("civil-status-children")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Other Pertinent History</span>
                <textarea
                  {...register("other-pertinent-history")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Sitting</span>
                <input
                  {...register("sitting")}
                  type="number"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Standing</span>
                <input
                  {...register("standing")}
                  type="number"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Lying</span>
                <input
                  {...register("lying")}
                  type="number"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p>HR</p>
              {[
                { label: "Regular", value: "Regular" },
                { label: "Irregular", value: "Irregular" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("hr")}
                      aria-invalid={errors["hr"] ? "true" : "false"}
                      value={value}
                      type="radio"
                      className="form-radio h-4 w-4 text-indigo-600 rounded"
                    />
                  </label>
                );
              })}
              {errors["hr"] && <p role="alert">{errors["hr"]?.message}</p>}
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>RR</span>
                <input
                  {...register("rr")}
                  type="number"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>T*</span>
                <input
                  {...register("t")}
                  type="number"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>SpO2</span>
                <input
                  {...register("sp-o-2")}
                  type="number"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p>Body Habitus</p>
              {[
                { label: "WNL", value: "WNL" },
                { label: "Cathetic", value: "Cathetic" },
                { label: "Obese", value: "Obese" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("body-habitus")}
                      aria-invalid={errors["body-habitus"] ? "true" : "false"}
                      value={value}
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

            <div className="my-4">
              <label className="flex flex-col">
                <span>Height (cm)</span>
                <input
                  {...register("height")}
                  type="text"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>Weight (kg)</span>
                <input
                  {...register("weight-kg")}
                  type="text"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span>BMI</span>
                <input
                  {...register("bmi")}
                  type="number"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="font-bold">Nasal mucosa, septum, & turbinates</p>
              {[
                { label: "WNL", value: "WNL" },
                {
                  label: "Edema or erythema present",
                  value: "Edema or erythema present",
                },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("nasal-mucosa-septum-turbinates")}
                      aria-invalid={
                        errors["nasal-mucosa-septum-turbinates"]
                          ? "true"
                          : "false"
                      }
                      value={value}
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
                { label: "WNL", value: "WNL" },
                { label: "Dental canes", value: "Dental canes" },
                { label: "Gingivitis", value: "Gingivitis" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("dentition-gums")}
                      aria-invalid={errors["dentition-gums"] ? "true" : "false"}
                      value={value}
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
              <p className="font-bold">Oropharynx</p>
              {[
                { label: "WNL", value: "WNL" },
                {
                  label: "Edema or erythema present",
                  value: "Edema or erythema present",
                },
                { label: "Oral ulcers", value: "Oral ulcers" },
                { label: "Oral petechiae", value: "Oral petechiae" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("oropharynx")}
                      aria-invalid={errors["oropharynx"] ? "true" : "false"}
                      value={value}
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

            <div className="my-4">
              <p className="font-bold">Mallampati</p>
              {[
                { label: "I", value: "I" },
                { label: "II", value: "II" },
                { label: "III", value: "III" },
                { label: "IV", value: "IV" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("mallampati")}
                      aria-invalid={errors["mallampati"] ? "true" : "false"}
                      value={value}
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

            <div className="my-4">
              <p className="font-bold">Neck</p>
              {[
                { label: "WNL", value: "WNL" },
                { label: "Lymphadenopathy", value: "Lymphadenopathy" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("neck")}
                      aria-invalid={errors["neck"] ? "true" : "false"}
                      value={value}
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

            <div className="my-4">
              <p className="font-bold">Thyroid</p>
              {[
                { label: "WNL", value: "WNL" },
                { label: "Thyromegaly", value: "Thyromegaly" },
                { label: "Nodules Palpable", value: "Nodules Palpable" },
                { label: "Neck mass", value: "Neck mass" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("thyroid")}
                      aria-invalid={errors["thyroid"] ? "true" : "false"}
                      value={value}
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

            <div className="my-4">
              <p className="font-bold">Jugular Veins</p>
              {[
                { label: "WNL", value: "WNL" },
                { label: "Engorged", value: "Engorged" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("jugular-veins")}
                      aria-invalid={errors["jugular-veins"] ? "true" : "false"}
                      value={value}
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

            <div className="my-4">
              <label className="flex items-center">
                <span className="font-bold">Chest</span>
                <input
                  {...register("chest")}
                  aria-invalid={errors["chest"] ? "true" : "false"}
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="font-bold">Respiratory effort</p>
              {[
                { label: "WNL", value: "WNL" },
                {
                  label: "Accessory muscle use",
                  value: "Accessory muscle use",
                },
                {
                  label: "Intercostal retractions",
                  value: "Intercostal retractions",
                },
                { label: "Paradoxic movements", value: "Paradoxic movements" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("respiratory-effort")}
                      aria-invalid={
                        errors["respiratory-effort"] ? "true" : "false"
                      }
                      value={value}
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

            <div className="my-4">
              <p className="font-bold">Chest percussion</p>
              {[
                { label: "WNL", value: "WNL" },
                {
                  label: "Dullness to percussion",
                  value: "Dullness to percussion",
                },
                { label: "Hyperresonance", value: "Hyperresonance" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("chest-percussion")}
                      aria-invalid={
                        errors["chest-percussion"] ? "true" : "false"
                      }
                      value={value}
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

            <div className="my-4">
              <p className="font-bold">Tactile fremitus</p>
              {[
                { label: "WNL", value: "WNL" },
                { label: "Increased", value: "Increased" },
                { label: "Decreased", value: "Decreased" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("tactile-fremitus")}
                      aria-invalid={
                        errors["tactile-fremitus"] ? "true" : "false"
                      }
                      value={value}
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

            <div className="my-4">
              <p className="font-bold">Auscultation</p>
              {[
                { label: "WNL", value: "WNL" },
                {
                  label: "Bronchial breath sounds",
                  value: "Bronchial breath sounds",
                },
                { label: "Egophony", value: "Egophony" },
                { label: "Rales", value: "Rales" },
                { label: "Rhonchi", value: "Rhonchi" },
                { label: "Wheezes", value: "Wheezes" },
                { label: "Rub", value: "Rub" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("auscultation")}
                      aria-invalid={errors["auscultation"] ? "true" : "false"}
                      value={value}
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

            <div className="my-4">
              <label className="flex flex-col">
                <span className="font-bold">Additional Findings</span>
                <textarea
                  {...register("additional-findings")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="font-bold">Heart sounds</p>
              {[
                { label: "Clear S1 & S2", value: "Clear S1 & S2" },
                {
                  label: "No murmur, rub or gallop",
                  value: "No murmur, rub or gallop",
                },
                { label: "Gallop audible", value: "Gallop audible" },
                { label: "Rub audible", value: "Rub audible" },
                { label: "Murmurs present", value: "Murmurs present" },
                { label: "Systolic", value: "Systolic" },
                { label: "Diastolic", value: "Diastolic" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("heart-sounds")}
                      aria-invalid={errors["heart-sounds"] ? "true" : "false"}
                      value={value}
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
                <span className="font-bold">Grade</span>
                <input
                  {...register("grade")}
                  type="number"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex flex-col">
                <span className="font-bold">Additional Findings</span>
                <textarea
                  {...register("additional-finding")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                ></textarea>
              </label>
            </div>

            <div className="my-4">
              <label className="flex items-center">
                <span className="font-bold">Abdomen</span>
                <input
                  {...register("abdomen")}
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                />
              </label>
            </div>

            <div className="my-4">
              <label className="flex items-center">
                <span className="font-bold">Mass Present</span>
                <input
                  {...register("mass-present")}
                  type="text"
                  className="form-input mt-1 block w-full"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="font-bold">Bowel Sounds</p>
              {[
                { label: "normoactive", value: "normoactive" },
                { label: "Up", value: "Up" },
                { label: "Down", value: "Down" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("bowel-sounds")}
                      aria-invalid={errors["bowel-sounds"] ? "true" : "false"}
                      value={value}
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

            <div className="my-4">
              <label className="flex items-center">
                <span className="font-bold">Liver & Spleen</span>
                <input
                  {...register("liver-spleen")}
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="font-bold">Unable to palpate</p>
              {[
                { label: "Liver", value: "Liver" },
                { label: "Spleen", value: "Spleen" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("unable-to-palpate")}
                      aria-invalid={
                        errors["unable-to-palpate"] ? "true" : "false"
                      }
                      value={value}
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded ml-2"
                    />
                  </label>
                );
              })}
              {errors["unable-to-palpate"] && (
                <p role="alert" className="text-red-500 text-sm">
                  {errors["unable-to-palpate"]?.message}
                </p>
              )}
            </div>

            <div className="my-4">
              <p className="font-bold">Organomegaly</p>
              {[
                { label: "Liver", value: "Liver" },
                { label: "Spleen", value: "Spleen" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("organomegaly")}
                      aria-invalid={errors["organomegaly"] ? "true" : "false"}
                      value={value}
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

            <div className="my-4">
              <label className="flex flex-col">
                <span className="font-bold">DRE Findings</span>
                <textarea
                  {...register("dre-findings")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                ></textarea>
              </label>
            </div>

            <div className="my-4">
              <p className="font-bold">Kidney punch sign</p>
              {[
                { label: "Negative", value: "Negative" },
                { label: "Positive", value: "Positive" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("kidney-punch-sign")}
                      aria-invalid={
                        errors["kidney-punch-sign"] ? "true" : "false"
                      }
                      value={value}
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
                { label: "R", value: "R" },
                { label: "L", value: "L" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("if-positive")}
                      aria-invalid={errors["if-positive"] ? "true" : "false"}
                      value={value}
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
                { label: "WNL", value: "WNL" },
                { label: "Clubbing", value: "Clubbing" },
                { label: "Cyanosis", value: "Cyanosis" },
                { label: "Petechiae", value: "Petechiae" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("extremities")}
                      aria-invalid={errors["extremities"] ? "true" : "false"}
                      value={value}
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
                <input
                  {...register("capillary-refill-time")}
                  type="number"
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                />
              </label>
            </div>

            <div className="my-4">
              <p className="font-bold">Skin</p>
              {[
                { label: "WNL", value: "WNL" },
                { label: "Rash", value: "Rash" },
                { label: "Eccymosis", value: "Eccymosis" },
                { label: "Nodules", value: "Nodules" },
                { label: "Ulcer", value: "Ulcer" },
              ].map(({ label, value }, index) => {
                return (
                  <label key={value + index} className="flex items-center">
                    <span>{label}</span>
                    <input
                      {...register("skin")}
                      aria-invalid={errors["skin"] ? "true" : "false"}
                      value={value}
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
                  {...register("assessment")}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                ></textarea>
              </label>
            </div>

            <button
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </DashboardCard>
      </PageContainer>
    </>
  );
}

export default EHRForm;
EHRForm.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
