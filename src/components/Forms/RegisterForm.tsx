"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { FieldType } from "@/enums/form";
import { UserFormValidation } from "@/lib/validation";
import { useState } from "react";
import CustomFormField from "./CustomFormField";
import SubmitButton from "./SubmitButton";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { createPatient } from "@/lib/actions/patient.actions";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async ({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const userData = { name, email, phone };

      const user = await createPatient(userData);

      if (user) {
        toast({
          title: "Patient registered.",
          description: "We've created your account for you.",
        });

        router.push(`/patients/${user.$id}/register`);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋🏻</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
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

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
