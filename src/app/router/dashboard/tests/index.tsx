import { createFileRoute } from "@tanstack/react-router";
import { TestsPage } from "@/pages/tests/TestsPage";

export const Route = createFileRoute("/dashboard/tests/")({
  component: () => (
    <div className="p-6">
      <TestsPage />
    </div>
  ),
});
