import React from "react";
import AdminLayout from "../components/AdminLayout";
import ResourceListPage from "./ResourceListPage";
import { blogConfig } from "../resourceConfigs";

export default function AdminBlog() {
  return (
    <AdminLayout title="Blog">
      <ResourceListPage config={blogConfig} />
    </AdminLayout>
  );
}
