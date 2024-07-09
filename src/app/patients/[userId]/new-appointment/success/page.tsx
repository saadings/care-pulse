import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const SuccessPage = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician,
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="logo"
            width={1000}
            height={1000}
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src={"/assets/gifs/success.gif"}
            alt="success"
            height={300}
            width={280}
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted.
          </h2>
          <p>We will be in touch shortly</p>
        </section>
        <section className="request-details">
          <p>Requested appointment details:</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-10"
            />

            <p className="whitespace-normal">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src={"/assets/icons/calendar.svg"}
              alt="calender"
              width={24}
              height={24}
            />
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant={"outline"} className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`} target="_blank">
            New Appointment
          </Link>
        </Button>

        <p className="copyright mt-10 justify-items-end text-dark-600 xl:text-left">
          © {new Date().getFullYear()} CarePulse
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;