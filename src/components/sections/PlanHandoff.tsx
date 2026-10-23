import { useEffect, useRef, useState } from 'react';
import { signInUrl } from '../../config/site';
import type { Plan } from '../../content/plans';
import { useLocale } from '../../i18n/context';
import { calculatePrice, getPricingFormatters, type BillingPeriod } from '../../lib/pricing';
import { DoubleButton } from '../ui/DoubleButton';
import './PlanHandoff.css';

/** Keep the chosen offer available while the separate account opens. */
export function PlanHandoff({ plan, period }: { plan: Plan; period: BillingPeriod }) {
  const { locale, t } = useLocale();
  const { currency, count } = getPricingFormatters(locale);
  const price = calculatePrice(plan.price, period);
  const details = [
    'Apcosys · ' + plan.name,
    t(period === 'annually' ? 'Billed annually' : 'Billed monthly'),
    currency.format(price.monthly) + t(' / month'),
    ...(period === 'annually'
      ? [t('{amount} billed annually', { amount: currency.format(price.total) })]
      : []),
    t('Credits') + ': ' + count.format(plan.credits),
    t('Users') + ': ' + count.format(plan.users),
  ].join('\n');
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);
  const preview = useRef<HTMLTextAreaElement>(null);
  const copyVersion = useRef(0);
  useEffect(
    () => () => {
      copyVersion.current++;
    },
    [],
  );
  useEffect(() => {
    if (fallback) {
      preview.current?.focus();
      preview.current?.select();
    }
  }, [fallback]);
  const copy = async () => {
    const version = ++copyVersion.current;
    try {
      await navigator.clipboard.writeText(details);
      if (version !== copyVersion.current) return;
      setCopied(true);
      setFallback(false);
    } catch {
      if (version !== copyVersion.current) return;
      setCopied(false);
      setFallback(true);
      preview.current?.focus();
      preview.current?.select();
    }
  };
  return (
    <div className="plan-handoff">
      <p>
        {t(
          'Copy the plan details below. Your selection stays on this page while Apcosys opens in another tab.',
        )}
      </p>
      <div className="plan-handoff__actions">
        <DoubleButton
          href={signInUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-describedby="plan-handoff-tab-hint"
        >
          {t('Open Apcosys')}
        </DoubleButton>
        <DoubleButton variant="secondary" onClick={() => void copy()}>
          {t('Copy plan details')}
        </DoubleButton>
      </div>
      <span className="plan-handoff__hint" id="plan-handoff-tab-hint">
        {t('Opens in a new tab')}
      </span>
      {copied && <p role="status">{t('Plan details copied.')}</p>}
      {fallback && (
        <textarea
          ref={preview}
          readOnly
          rows={7}
          value={details}
          aria-label={t('Selected plan details')}
        />
      )}
    </div>
  );
}
