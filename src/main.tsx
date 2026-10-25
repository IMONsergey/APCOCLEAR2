import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { LocaleProvider } from './i18n/LocaleProvider';
import { loadLocale } from './i18n/messages';
import { getLocale, getRoutePath } from './app/paths';
import { prepareRoute } from './app/routeModules';
import { StartupFailure } from './app/StartupFailure';
import { ThemeProvider } from './theme/ThemeProvider';
import './styles/instrument-sans.css';
import './styles/ibm-plex-mono.css';
import './styles/tokens.css';
import './styles/type-scale.css';
import './styles/base.css';
import './styles/controls.css';
import './styles/site.css';
import './styles/navigation.css';
import './styles/localization.css';
import './styles/text-motion.css';
import './components/Footer.css';
import './styles/theme.css';

const element = document.getElementById('root');
if (!element) throw new Error('The application root was not found.');
const locale = getLocale();
document.documentElement.lang = locale;
const root = createRoot(element);
const render = (children: ReactNode) =>
  root.render(
    <StrictMode>
      <ThemeProvider>{children}</ThemeProvider>
    </StrictMode>,
  );

async function start() {
  // Start the page download alongside its language resources. Suspense owns failure recovery.
  void prepareRoute(getRoutePath()).catch(() => undefined);
  try {
    await Promise.all([
      loadLocale(locale),
      ...(locale === 'ru'
        ? [import('./styles/onest.css'), import('./styles/russian-type.css')]
        : []),
    ]);
    render(
      <LocaleProvider locale={locale}>
        <App />
      </LocaleProvider>,
    );
  } catch {
    // A reload starts a fresh module graph, so a failed import can be retried.
    render(<StartupFailure locale={locale} />);
  }
}
void start();
