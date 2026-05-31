import { createFileRoute } from "@tanstack/react-router";
import RectoriaPage from "@/pages/principal/RectoriaPage";

export const Route = createFileRoute("/dashboard/rectoria/")({
  component: () => {
    return <RectoriaPage />;
  },
});
