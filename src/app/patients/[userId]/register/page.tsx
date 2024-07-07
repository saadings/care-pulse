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

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © {new Date().getFullYear()} CarePulse
            </p>

            <Link href={"/?admin=true"} className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src={"/assets/images/register-img.png"}
        height={1000}
        width={1000}
        alt="patient 2"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Register;
