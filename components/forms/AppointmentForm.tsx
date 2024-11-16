"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { any, z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { FormfieldType } from "./PatientForm";

const AppointmentForm = ({
  userId,
  patientId,
  type ,
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const AppointmentFormValidation = getAppointmentSchema(type);

  // Initialize form using zod validation schema
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment ? new Date(appointment.schedule!) : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);
    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const newAppointment = await createAppointment({
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: values.schedule,
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        });

        if (newAppointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`);
        }
      } else   {
             const appointmentToUpdate = {
              userId,
              appointmentId: appointment?.$id!,
              appointment: {
              primaryPhysician: values?.primaryPhysician,
              schedule: new Date(values?.schedule),
              status: status as Status,
              cancellationReason: values?.cancellationReason
              },
              type
             }
          const updatedAppointment = await updateAppointment(appointmentToUpdate)
          if (updatedAppointment) {
            setOpen && setOpen(false)
            form.reset()
          }

            }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  // Button label based on appointment type
  const buttonLabel = type === "cancel" ? "Cancel Appointment" : type === "schedule" ? "Schedule Appointment" : "Submit Appointment";
  
  if (!isMounted) {
    return null; // or a loading state
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in 5 minutes.</p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            {/* Doctor Selection Field */}
            <CustomFormField
              fieldType={FormfieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
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

            {/* Appointment Date Picker */}
            <CustomFormField
              fieldType={FormfieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            {/* Reason and Notes Fields */}
            <div className={`flex flex-col gap-6 ${type === "create" && "xl:flex-row"}`}>
              <CustomFormField
                fieldType={FormfieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual monthly check-up"
                // disabled={type === "schedule"}
              />
              <CustomFormField
                fieldType={FormfieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                // disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {/* Cancellation Reason Field */}
        {type === "cancel" && (
          <CustomFormField
            fieldType={FormfieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        {/* Submit Button */}
        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
