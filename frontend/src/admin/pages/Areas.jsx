import React from "react";
import AdminLayout from "../components/AdminLayout";
import ResourceListPage from "./ResourceListPage";
import { areasConfig } from "../resourceConfigs";

export default function AdminAreas() {
  return (
    <AdminLayout title="Service Areas">
      <ResourceListPage config={areasConfig} />
    </AdminLayout>
  );
}
