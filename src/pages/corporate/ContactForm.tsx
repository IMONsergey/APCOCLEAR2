import { Text } from '../../components/ui/Text';
import { topics } from './contactTopics';
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { supportEmail } from '../../config/site';
import { siteHref } from '../../app/paths';
import { Notice } from '../../components/layout/PageFrame';
import { DoubleButton } from '../../components/ui/DoubleButton';
import { LinkLanguageHint } from '../../components/ui/LinkLanguageHint';
import { MorphPanel } from '../../components/ui/MorphPanel';
import { useLocale } from '../../i18n/context';
import {
  clearContactDraft,
  emptyContactDraft,
  readContactDraft,
  saveContactDraft,
  type ContactDraft,
} from './contactDraft';

export default function ContactForm({
  topic,
  onTopicChange,
}: {
  topic: string;
  onTopicChange: (topic: string) => void;
}) {
  const { t } = useLocale();
  const [status, setStatus] = useState('');
  const [opening, setOpening] = useState(false);
  const [draft, setDraft] = useState(readContactDraft);
  const [preparedEmail, setPreparedEmail] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<HTMLTextAreaElement>(null);
  const openingTimer = useRef<number | null>(null);
  const copyVersion = useRef(0);
  const handledTopic = useRef(topic);

  useLayoutEffect(() => {
    if (handledTopic.current === topic) return;
    handledTopic.current = topic;
    copyVersion.current++;
    setPreparedEmail('');
    setStatus('');
  }, [topic]);

  useEffect(() => {
    saveContactDraft({ ...readContactDraft(), topic });
  }, [topic]);

  const updateDraft = (values: Partial<ContactDraft>) => {
    copyVersion.current++;
    const next = { ...draft, ...values, topic };
    setDraft(next);
    saveContactDraft(next);
    setPreparedEmail('');
    setStatus('');
  };

  useEffect(
    () => () => {
      copyVersion.current++;
      if (openingTimer.current !== null) window.clearTimeout(openingTimer.current);
    },
    [],
  );

  function prepare(form: HTMLFormElement) {
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const company = String(data.get('company') || '').trim();
    const topic = String(data.get('topic') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || message.length < 10) {
      setStatus(
        t(
          !name
            ? 'Enter your name.'
            : 'Write at least 10 characters, excluding surrounding spaces.',
        ),
      );
      form
        .querySelector<HTMLInputElement | HTMLTextAreaElement>(
          !name ? '[name="name"]' : '[name="message"]',
        )
        ?.focus();
      return;
    }
    const subject = 'Apcosys: ' + t(topic);
    const body = [
      t('Name: {name}', { name }),
      t('Work email: {email}', { email }),
      t('Company: {company}', { company: company || t('Not provided') }),
      t('Topic: {topic}', { topic: t(topic) }),
      '',
      message,
    ].join('\n');
    const text = [
      t('To: {email}', { email: supportEmail }),
      t('Subject: {subject}', { subject }),
      '',
      body,
    ].join('\n');
    setPreparedEmail(text);
    return { subject, body, text };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (opening) return;
    const email = prepare(event.currentTarget);
    if (!email) return;
    copyVersion.current++;
    setOpening(true);
    setStatus(
      t(
        'Your email application will open with a prepared message. Please send the email there; this website has not submitted it.',
      ),
    );
    try {
      window.location.href =
        'mailto:' +
        supportEmail +
        '?subject=' +
        encodeURIComponent(email.subject) +
        '&body=' +
        encodeURIComponent(email.body);
    } catch {
      setStatus(t('Copy the prepared email below and send it from your email application.'));
    }
    openingTimer.current = window.setTimeout(() => {
      openingTimer.current = null;
      setOpening(false);
    }, 700);
  }

  async function copyEmail() {
    if (!formRef.current) return;
    const email = prepare(formRef.current);
    if (!email) return;
    const version = ++copyVersion.current;
    try {
      await navigator.clipboard.writeText(email.text);
      if (version !== copyVersion.current) return;
      setStatus(t('Email text copied. Paste it into your email application and send it there.'));
    } catch {
      if (version !== copyVersion.current) return;
      setStatus(t('Copy the prepared email below and send it from your email application.'));
      requestAnimationFrame(() => {
        if (version !== copyVersion.current) return;
        previewRef.current?.focus();
        previewRef.current?.select();
      });
    }
  }

  function clearDraft() {
    copyVersion.current++;
    handledTopic.current = '';
    clearContactDraft();
    setDraft(emptyContactDraft());
    onTopicChange('');
    setPreparedEmail('');
    setStatus(t('Draft cleared.'));
  }
  const privacyMarker = '__APCOSYS_PRIVACY_POLICY__';
  const privacyConsent = t(
    'I agree to the processing of my data in line with the {privacyPolicy}.',
    { privacyPolicy: privacyMarker },
  );
  const markerIndex = privacyConsent.indexOf(privacyMarker);
  const privacyBefore = markerIndex >= 0 ? privacyConsent.slice(0, markerIndex) : privacyConsent;
  const privacyAfter =
    markerIndex >= 0 ? privacyConsent.slice(markerIndex + privacyMarker.length) : '';
  return (
    <form
      ref={formRef}
      id="contact-form"
      className="stage-contact-form"
      onSubmit={submit}
      noValidate={false}
    >
      <Text as="p" className="stage-form-hint">
        All fields are required except company.
      </Text>
      <div className="stage-form-row">
        <label>
          {t('Name')}{' '}
          <input
            name="name"
            required
            autoComplete="name"
            maxLength={100}
            value={draft.name}
            onChange={(event) => updateDraft({ name: event.target.value })}
          />
        </label>
        <label>
          {t('Work email')}{' '}
          <input
            name="email"
            required
            type="email"
            autoComplete="email"
            maxLength={200}
            value={draft.email}
            onChange={(event) => updateDraft({ email: event.target.value })}
          />
        </label>
      </div>
      <div className="stage-form-row">
        <label>
          <span className="stage-form-label">
            {t('Company')} <small>{t('(optional)')}</small>
          </span>
          <input
            name="company"
            autoComplete="organization"
            maxLength={120}
            value={draft.company}
            onChange={(event) => updateDraft({ company: event.target.value })}
          />
        </label>
        <label>
          {t('Topic')}{' '}
          <select
            name="topic"
            required
            value={topic}
            onChange={(event) => {
              copyVersion.current++;
              handledTopic.current = event.target.value;
              onTopicChange(event.target.value);
              setPreparedEmail('');
              setStatus('');
            }}
          >
            <option value="" disabled>
              {t('Select a topic')}
            </option>
            {topics.map((topic) => (
              <option value={topic} key={topic}>
                {t(topic)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span id="contact-message-label">{t('Message')}</span>
        <textarea
          name="message"
          required
          rows={7}
          minLength={10}
          maxLength={6000}
          value={draft.message}
          onChange={(event) => updateDraft({ message: event.target.value })}
          aria-labelledby="contact-message-label"
          aria-describedby="contact-message-hint"
          placeholder={t('Tell us what you would like to evaluate…')}
        />
        <span id="contact-message-hint" className="stage-form-hint">
          {t('At least 10 characters.')}
        </span>
      </label>
      <label className="stage-consent">
        <input
          type="checkbox"
          name="consent"
          required
          checked={draft.consent}
          onChange={(event) => updateDraft({ consent: event.target.checked })}
        />{' '}
        <span>
          {privacyBefore}
          <a href={siteHref('/legal/privacy-policy')}>
            {t('Privacy Policy')}
            <LinkLanguageHint href={siteHref('/legal/privacy-policy')} />
          </a>
          {privacyAfter}
        </span>
      </label>
      <div className="stage-form-actions">
        <DoubleButton type="submit" className="stage-contact-submit" disabled={opening}>
          {t(opening ? 'Opening email…' : 'Prepare email')}
        </DoubleButton>
        <DoubleButton variant="secondary" onClick={() => void copyEmail()}>
          {t('Copy email text')}
        </DoubleButton>
        <button type="button" className="plain-button" onClick={clearDraft}>
          {t('Clear draft')}
        </button>
      </div>
      <MorphPanel className="stage-form-feedback">
        {status && (
          <Text as="p" className="stage-form-status" role="status">
            {status}
          </Text>
        )}
        {preparedEmail && (
          <label className="stage-prepared-email">
            {t('Prepared email')}
            <textarea ref={previewRef} readOnly rows={8} value={preparedEmail} />
          </label>
        )}
        <Notice>
          Your draft stays in this browser tab for up to 24 hours. This website does not send your
          message. Review and send it in your email application.
        </Notice>
      </MorphPanel>
    </form>
  );
}
