"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form, FormControl} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useEffect, useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormfieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"



const RegisterForm = ({user}: {user: User})=> {
  const router = useRouter();
  const [isLoading, SetIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)


  useEffect(() => {
    setIsMounted(true);
  }, []);



  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "", 
      phone: "",
    },
  });
 

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    SetIsLoading(true);

    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
    try {
     const patientData = {
      ...values,
      userId: user.$id,
      birthDate: new Date(values.birthDate),
      identificationDocument:formData
     }

     //@ts-ignore
    const patient = await registerPatient(patientData)
    if(patient) router.push(`/patients/${user.$id}/new-appointment`)

   
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      SetIsLoading(false);
    }
  };

  if (!isMounted) {
    return null; 
  }
  
 

  return(
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
    <section className="space-y-4">
          <h1 className="header">Welcome👋</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
    </section>

    <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
    
    </section>

    <CustomFormField
    fieldType = {FormfieldType.INPUT}
    control = {form.control}
    name = "name"
    label="Full name"
    placeholder = "Roumodip Das"
    iconSrc = "/assets/icons/user.svg"
    iconAlt = "user"
    />

    <div className="flex flex-col gap-6 xl:flex-row">

    <CustomFormField
    fieldType = {FormfieldType.INPUT}
    control = {form.control}
    name = "email"
    label = "Email"
    placeholder = "rdas567@gmail.com"
    iconSrc = "/assets/icons/email.svg"
    iconAlt = "email"
    />

    <CustomFormField
    fieldType = {FormfieldType.PHONE_INPUT}
    control = {form.control}
    name = "phone"
    label = "Phone Number"
    placeholder = "8966620102"
    />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">

    <CustomFormField
    fieldType = {FormfieldType.DATE_PICKER}
    control = {form.control}
    name = "birthDate"
    label = "Date of Birth"
    />

    <CustomFormField
    fieldType = {FormfieldType.SKELETON}
    control = {form.control}
    name = "gender"
    label = "Gender"
    renderSkeleton={(field)=>(
        <FormControl>
        <RadioGroup
          className="flex h-11 gap-6 xl:justify-between"
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          {GenderOptions.map((option) => (
            <div key={option} className="radio-group">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
    )}
    />  
    </div>


    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
    fieldType = {FormfieldType.INPUT}
    control = {form.control}
    name = "address"
    label = "Address"
    placeholder = "Bankura"
    />

    <CustomFormField
    fieldType = {FormfieldType.INPUT}
    control = {form.control}
    name = "occupation"
    label = "Occupation"
    placeholder = "Software Developer"
    />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
    fieldType = {FormfieldType.INPUT}
    control = {form.control}
    name = "emergencyContactName"
    label = "Emergency contact name"
    placeholder = "Guardian's name "
    />

    <CustomFormField
    fieldType = {FormfieldType.PHONE_INPUT}
    control = {form.control}
    name = "emergencyContactNumber"
    label = "Emergency contact Number"
    placeholder = "8966620102"
    />
    </div>

    <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>  
    </section>

    <CustomFormField
    fieldType = {FormfieldType.SELECT}
    control = {form.control}
    name = "primaryPhysician"
    label = "Primary Physician"
    placeholder = "select a physician"
    >
      {Doctors.map((doctor)=>(
             <SelectItem key={doctor.name} value={doctor.name}>
             <div className="flex cursor-pointer items-center gap-2">
               <Image
                 src={doctor.image}
                 width={32}
                 height={32}
                 alt="doctor"
                 className="rounded-full border border-dark-500"
               />
               <p>{doctor.name}</p>
             </div>
           </SelectItem>
      ))}
    </CustomFormField>


    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
    fieldType = {FormfieldType.INPUT}
    control = {form.control}
    name = "insuranceProvider"
    label = "Insurance Provider"
    placeholder = "Reliance Life Insurance"
    />

    <CustomFormField
    fieldType = {FormfieldType.INPUT}
    control = {form.control}
    name = "insurancePolicyNumber"
    label = "Insurance Policy Number"
    placeholder = "RAT145623"
    />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
     fieldType={FormfieldType.TEXTAREA}
       control={form.control}
      name="allergies"
       label="Allergies (if any)"
      placeholder="egg, dust, Pollen"
        />

      <CustomFormField
        fieldType={FormfieldType.TEXTAREA}
        control={form.control}
        name="currentMedication"
        label="Current medications"
        placeholder="calpol 200mg, Arnica 50mcg"
      />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
        fieldType={FormfieldType.TEXTAREA}
        control={form.control}
        name="familyMedicalHistory"
        label=" Family medical history (if relevant)"
        placeholder="Mother had Ortho Problem, Father has fever"
      />

      <CustomFormField
        fieldType={FormfieldType.TEXTAREA}
        control={form.control}
        name="pastMedicalHistory"
        label="Past medical history"
         placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
       />
    </div>

    <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>  
    </section>
    
    <CustomFormField
    fieldType = {FormfieldType.SELECT}
    control = {form.control}
    name = "identificationType"
    label = "Identification Type"
    placeholder = "Select identification type"
    >
      {IdentificationTypes.map((type)=>(
             <SelectItem key={type} value={type}>
              {type}
           </SelectItem>
      ))}
    </CustomFormField>

    <CustomFormField
    fieldType = {FormfieldType.INPUT}
    control = {form.control}
    name = "identificationNumber"
    label = "Identification Number"
    placeholder = "JPF456123"
    />

    <CustomFormField
      fieldType={FormfieldType.SKELETON}
      control={form.control}
      name="identificationDocument"
      label="Scanned Copy of Identification Document"
      renderSkeleton={(field) => (
        <FormControl>
           <FileUploader files={field.value} onChange={field.onChange} />
        </FormControl>
       )}
     />
    
    <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>  
    </section>

    <CustomFormField
            fieldType={FormfieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormfieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormfieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
 
        
   <SubmitButton  isLoading = {isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm