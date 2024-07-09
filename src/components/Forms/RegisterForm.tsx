"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { FieldType } from "@/enums/form";
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { SelectItem } from "../ui/select";
import { useToast } from "../ui/use-toast";
import CustomFormField from "./CustomFormField";
import FileUploader from "./FileUploader";
import SubmitButton from "./SubmitButton";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    let formData;

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
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
        identificationDocument: formData,
      };

      // @ts-ignore
      const patient = await registerPatient(patientData);

      if (patient) {
        toast({
          title: "Patient registered.",
          description: "We've created your account for you.",
        });

        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋🏻</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information.</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@saadings.me"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          <CustomFormField
            fieldType={FieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"
            // placeholder="1234 Elm Street"
            // iconSrc="/assets/icons/location.svg"
            // iconAlt="location"
          />

          <CustomFormField
            fieldType={FieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            // placeholder="Los Angeles"
            // iconSrc="/assets/icons/location.svg"
            // iconAlt="location"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
                >
                  {GenderOptions.map((gender) => (
                    <div key={gender} className="radio-group">
                      <RadioGroupItem value={gender} id={gender} />
                      <Label
                        htmlFor={gender}
                        className="cursor-pointer capitalize"
                      >
                        {gender}
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
            fieldType={FieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14th Street, Los Angeles"
          />

          <CustomFormField
            fieldType={FieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's Name"
          />

          <CustomFormField
            fieldType={FieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="(555) 123-4567"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information.</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a physician"
        >
          {Doctors.map(({ name, image }) => (
            <SelectItem key={name} value={name} className="hover:bg-dark-500">
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={image}
                  alt={name}
                  width={32}
                  height={32}
                  className="rounded-full border border-dark-500"
                />

                <p>{name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Blue Cross Blue Shield"
          />

          <CustomFormField
            fieldType={FieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="ABC123456789"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldType.TEXT_AREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Seafood, etc."
          />

          <CustomFormField
            fieldType={FieldType.TEXT_AREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Paracetamol 500mg, etc."
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldType.TEXT_AREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History (if any)"
            placeholder="Mother had cancer, etc."
          />

          <CustomFormField
            fieldType={FieldType.TEXT_AREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History (if any)"
            placeholder="Broken leg, etc."
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type} className="hover:bg-dark-500">
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789"
        />

        <CustomFormField
          fieldType={FieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned copy of Identification Document"
          // placeholder="Los Angeles"
          // iconSrc="/assets/icons/location.svg"
          // iconAlt="location"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader
                files={field.value as File[] | undefined}
                onChange={field.onChange}
              />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy.</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to the treatment."
        />

        <CustomFormField
          fieldType={FieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information."
        />

        <CustomFormField
          fieldType={FieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy."
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
