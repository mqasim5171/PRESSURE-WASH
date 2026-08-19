import React from "react";
import AdminLayout from "../components/AdminLayout";
import ResourceListPage from "./ResourceListPage";
import { servicesConfig } from "../resourceConfigs";

export default function AdminServices() {
  return (
    <AdminLayout title="Services">
      <ResourceListPage config={servicesConfig} />
    </AdminLayout>
  );
}
