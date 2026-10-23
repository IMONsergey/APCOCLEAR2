import { isRouteAvailable, resolveSiteLocation, siteBase } from '../../app/paths';
import { useLocale } from '../../i18n/context';
import './LinkLanguageHint.css';

/** Identify a published English destination before a localized navigation leaves its language. */
export function LinkLanguageHint({ href }: { href: string }) {
  const { locale, t } = useLocale();
  if (locale === 'en' || !href.startsWith(siteBase + '/')) return null;
  const destination = resolveSiteLocation(href.split(/[?#]/)[0]!);
  if (
    !destination ||
    destination.locale !== 'en' ||
    !isRouteAvailable(destination.routePath, 'en') ||
    isRouteAvailable(destination.routePath, locale)
  )
    return null;
  return (
    <abbr className="link-language-hint" title={t('Available in English')} lang="en">
      EN
    </abbr>
  );
}
