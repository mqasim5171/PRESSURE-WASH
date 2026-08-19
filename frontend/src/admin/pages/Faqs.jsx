import React from "react";
import AdminLayout from "../components/AdminLayout";
import ResourceListPage from "./ResourceListPage";
import { faqsConfig } from "../resourceConfigs";

export default function AdminFaqs() {
  return (
    <AdminLayout title="FAQs">
      <ResourceListPage config={faqsConfig} />
    </AdminLayout>
  );
}
