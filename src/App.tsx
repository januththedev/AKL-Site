import { SmoothScrollProvider } from '@/hooks/useLenis';
import { AppRoutes } from '@/app/router';

export default function App() {
  return (
    <SmoothScrollProvider>
      <AppRoutes />
    </SmoothScrollProvider>
  );
}
