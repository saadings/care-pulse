import RegisterForm from "@/components/Forms/RegisterForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getPatient(userId);

  console.log(user);

  return (
    <div className="flex h-screen max-h-screen">
      {/* OTP Modal */}

      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <p className="copyright justify-items-end py-12 text-dark-600 xl:text-left">
            © {new Date().getFullYear()} CarePulse
          </p>
        </div>
      </section>

      <Image
        src={"/assets/images/register-img.png"}
        height={1000}
        width={1000}
        alt="patient 2"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
