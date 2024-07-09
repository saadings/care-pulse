import { DataTable } from "@/components/Table/DataTable";
import StatCard from "@/components/StatCard";
import { CardType } from "@/enums/statCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";
import { columns } from "@/components/Table/columns";
import { Appointment } from "@/types/appwrite";

const Admin = async () => {
  const appointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href={"/"} className="cursor-pointer">
          <Image
            src={"/assets/icons/logo-full.svg"}
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋🏻</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type={CardType.APPOINTMENTS}
            count={appointments.scheduledCount}
            label="Scheduled Appointments"
            icon={"/assets/icons/appointments.svg"}
          />

          <StatCard
            type={CardType.PENDING}
            count={appointments.pendingCount}
            label="Pending Appointments"
            icon={"/assets/icons/pending.svg"}
          />

          <StatCard
            type={CardType.CANCELLED}
            count={appointments.cancelledCount}
            label="Canceled Appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable
          data={appointments.documents as Appointment[]}
          columns={columns}
        />
      </main>
    </div>
  );
};

export default Admin;
