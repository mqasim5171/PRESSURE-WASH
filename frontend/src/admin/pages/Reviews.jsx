import React from "react";
import AdminLayout from "../components/AdminLayout";
import ResourceListPage from "./ResourceListPage";
import { reviewsConfig } from "../resourceConfigs";

export default function AdminReviews() {
  return (
    <AdminLayout title="Reviews">
      <ResourceListPage config={reviewsConfig} />
    </AdminLayout>
  );
}
