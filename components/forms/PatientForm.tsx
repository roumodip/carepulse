"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useEffect, useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormfieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'ckeckbox',
    SELECT = 'select',
    SKELETON = 'skeleton',
    DATE_PICKER = 'datePicker'
}

 

const PatientForm = ()=> {
  const router = useRouter();

  const [isLoading, SetIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
 

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    SetIsLoading(true);
    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);
      // console.log("New User ID:", newUser?.$id);  // Log new user ID
     

      if (newUser && newUser.$id) {
        router.push(`/patients/${newUser.$id}/register`); // Perform redirect
      } else {
        console.error("No ID found on newUser object. Redirection failed.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      SetIsLoading(false);
    }
  };
  

  if (!isMounted) {
    return null; // or a loading state
  }


  return(
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
    <section className="mb-12 space-y-4">
          <h1 className="header">Hi patients!! 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
    </section>

    <CustomFormField
    fieldType = {FormfieldType.INPUT}
    control = {form.control}
    name = "name"
    label = " Full Name"
    placeholder = "Roumodip Das"
    iconSrc = "/assets/icons/user.svg"
    iconAlt = "user"
    />

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
        
   <SubmitButton  isLoading = {isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default PatientForm