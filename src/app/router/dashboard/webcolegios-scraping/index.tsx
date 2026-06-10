import { createFileRoute } from '@tanstack/react-router';
import { WebcolegiosScrapingPage } from '@pages/webcolegios/WebcolegiosScrapingPage';

export const Route = createFileRoute('/dashboard/webcolegios-scraping/')({
  component: WebcolegiosScrapingPage,
});
