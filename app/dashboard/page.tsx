import type { Metadata } from "next";
import { connection } from "next/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const instant = false;

export const metadata: Metadata = {
  title: "Dashboard Simulasi — TaniVerify",
  description: "Simulasi pemindai RFID TaniVerify: pindai karung contoh dan catat dosis per petak sawah.",
};

export default async function DashboardPage() {
  await connection();
  return <DashboardClient />;
}
