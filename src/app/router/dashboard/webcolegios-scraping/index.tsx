import { createFileRoute } from '@tanstack/react-router';
import { WebcolegiosScrapingPage } from '@/features/webcolegios-scraping';

export const Route = createFileRoute('/dashboard/webcolegios-scraping/')({
  component: WebcolegiosScrapingPage,
});
