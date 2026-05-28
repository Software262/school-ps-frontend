/* eslint-disable */
import { createFileRoute } from '@tanstack/react-router';
import { TestsPage } from '../../../../pages/tests';

export const Route = createFileRoute('/dashboard/tests/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6">
      <TestsPage />
    </div>
  );
}



