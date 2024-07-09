import AppointmentForm from "@/components/Forms/AppointmentForm";
import { FormType } from "@/enums/form";
import { getPatientData } from "@/lib/actions/patient.actions";
import Image from "next/image";

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatientData(userId);

  return (
    <div className="flex h-screen max-h-screen">
      {/* OTP Modal */}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            userId={userId}
            type={FormType.CREATE}
            patientId={patient.$id}
          />

          <p className="copyright mt-10 justify-items-end py-12 text-dark-600 xl:text-left">
            © {new Date().getFullYear()} CarePulse
          </p>
        </div>
      </section>

      <Image
        src={"/assets/images/appointment-img.png"}
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default NewAppointment;
