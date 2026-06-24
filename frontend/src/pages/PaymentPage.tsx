import { type FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../app/AuthContext';
import { paymentService } from '../services/payments';
import { ApiError } from '../types/api';
import type { PaymentRequest, PaymentResponse } from '../types/payment';
import amexLogo from '../assets/payment-logos/amex.svg';
import bkmLogo from '../assets/payment-logos/bkm.png';
import mastercardLogo from '../assets/payment-logos/mastercard.svg';
import troyLogo from '../assets/payment-logos/troy.png';
import visaLogo from '../assets/payment-logos/visa.svg';

type PaymentForm = {
  orderReference: string;
  amount: string;
  statementDescription: string;
  holderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
};

const SUPPORTED_CURRENCY: PaymentRequest['currency'] = 'TRY';
const paymentLogos = [
  { alt: 'Visa', src: visaLogo },
  { alt: 'Mastercard', src: mastercardLogo },
  { alt: 'TROY', src: troyLogo },
  { alt: 'American Express', src: amexLogo },
  { alt: 'BKM', src: bkmLogo },
];

const initialForm: PaymentForm = {
  orderReference: createOrderReference(),
  amount: '',
  statementDescription: 'FH Yildiz Tekstil',
  holderName: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
};

export function PaymentPage() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maskedCard = useMemo(() => {
    const digits = onlyDigits(form.cardNumber);
    return digits.length >= 4 ? `**** ${digits.slice(-4)}` : 'Kart girilmedi';
  }, [form.cardNumber]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);

    const validationError = validatePaymentForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const payment = await paymentService.createPayment(toPaymentRequest(form));
      setResult(payment);
    } catch (cause) {
      if (cause instanceof ApiError) {
        const detail = cause.details[0]?.message;
        setError(detail ? `${cause.message} ${detail}` : cause.message);
      } else {
        setError('Ödeme servisine ulaşılamıyor.');
      }
    } finally {
      setForm((currentForm) => ({ ...currentForm, cvv: '' }));
      setIsSubmitting(false);
    }
  }

  return (
    <main className="screen payment-screen">
      <header className="topbar">
        <div>
          <p className="eyebrow">FH Yıldız Tekstil</p>
          <h1>Ödeme</h1>
        </div>
        <div className="user-actions">
          <span>{user?.username}</span>
          <button className="secondary-button" onClick={logout} type="button">
            Çıkış yap
          </button>
        </div>
      </header>

      <section className="payment-layout">
        <form className="form-panel payment-form" onSubmit={handleSubmit}>
          <div className="section-heading">
            <h2>İşlem</h2>
          </div>

          <label className="field">
            <span>Sipariş referansı</span>
            <input name="orderReference" readOnly value={form.orderReference} />
          </label>

          <label className="field">
            <span>Tutar</span>
            <input
              inputMode="decimal"
              name="amount"
              value={form.amount}
              onChange={(event) => setForm({ ...form, amount: event.target.value })}
              placeholder="Tutarı girin"
            />
          </label>

          <label className="field">
            <span>Ekstre açıklaması</span>
            <input
              maxLength={80}
              name="statementDescription"
              value={form.statementDescription}
              onChange={(event) =>
                setForm({ ...form, statementDescription: event.target.value })
              }
              placeholder="Kart ekstresinde görünecek açıklama"
            />
          </label>

          <div className="section-heading">
            <div>
              <h2>Kart</h2>
              <p>Kart bilgileriniz yalnızca bu ödeme işlemi için güvenli şekilde kullanılır.</p>
            </div>
          </div>

          <label className="field">
            <span>Kart sahibi</span>
            <input
              autoComplete="cc-name"
              name="holderName"
              value={form.holderName}
              onChange={(event) => setForm({ ...form, holderName: event.target.value })}
              placeholder="Ad Soyad"
            />
          </label>

          <label className="field">
            <span>Kart numarası</span>
            <input
              autoComplete="cc-number"
              inputMode="numeric"
              name="cardNumber"
              value={form.cardNumber}
              onChange={(event) =>
                setForm({ ...form, cardNumber: formatCardNumber(event.target.value) })
              }
              placeholder="Kart numarasını girin"
            />
          </label>

          <div className="form-grid three-columns">
            <label className="field">
              <span>Ay</span>
              <input
                autoComplete="cc-exp-month"
                inputMode="numeric"
                maxLength={2}
                name="expiryMonth"
                value={form.expiryMonth}
                onChange={(event) =>
                  setForm({ ...form, expiryMonth: onlyDigits(event.target.value).slice(0, 2) })
                }
                placeholder="Ay girin"
              />
            </label>

            <label className="field">
              <span>Yıl</span>
              <input
                autoComplete="cc-exp-year"
                inputMode="numeric"
                maxLength={2}
                name="expiryYear"
                value={form.expiryYear}
                onChange={(event) =>
                  setForm({ ...form, expiryYear: onlyDigits(event.target.value).slice(0, 2) })
                }
                placeholder="YY"
              />
            </label>

            <label className="field">
              <span>Güvenlik kodu</span>
              <input
                autoComplete="cc-csc"
                inputMode="numeric"
                maxLength={4}
                name="cvv"
                value={form.cvv}
                onChange={(event) =>
                  setForm({ ...form, cvv: onlyDigits(event.target.value).slice(0, 4) })
                }
                placeholder="Güvenlik kodunu girin"
                type="password"
              />
            </label>
          </div>

          {error ? (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          ) : null}

          {result ? <PaymentResult result={result} /> : null}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Ödeme gönderiliyor...' : 'Ödemeyi gönder'}
          </button>
        </form>

        <aside className="summary-panel" aria-label="Ödeme özeti">
          <div>
            <p className="summary-label">Tutar</p>
            <strong>
              {form.amount || '0.00'} {SUPPORTED_CURRENCY}
            </strong>
          </div>
          <div>
            <p className="summary-label">Sipariş</p>
            <strong>{form.orderReference || 'Belirtilmedi'}</strong>
          </div>
          <div>
            <p className="summary-label">Güvenli ödeme</p>
            <strong>Banka onayı desteklenir</strong>
            <span className="summary-meta">Gerekirse bankanızın onay ekranına yönlendirilirsiniz.</span>
          </div>
          <div>
            <p className="summary-label">Kart</p>
            <strong>{maskedCard}</strong>
          </div>
          <p className="summary-note">
            Kart numarası ve güvenlik kodu yalnızca bu ödeme için kullanılır. Güvenlik kodu işlem
            denemesi sonrasında ekrandan temizlenir.
          </p>
        </aside>
      </section>

      <footer className="payment-footer" aria-label="Ödeme altyapısı">
        <ul className="payment-logo-list">
          {paymentLogos.map((logo) => (
            <li className="payment-logo-item" key={logo.alt}>
              <img alt={logo.alt} src={logo.src} />
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}

function PaymentResult({ result }: { result: PaymentResponse }) {
  const className = result.status === 'APPROVED' ? 'alert-success' : 'alert-info';

  return (
    <div className={`alert ${className}`} role="status">
      <strong>{formatStatus(result.status)}</strong>
      <span>{result.message ?? 'Ödeme yanıtı alındı.'}</span>
      {result.redirect ? <PaymentRedirectAction redirect={result.redirect} /> : null}
    </div>
  );
}

function PaymentRedirectAction({ redirect }: { redirect: NonNullable<PaymentResponse['redirect']> }) {
  if (redirect.method === 'POST') {
    return (
      <form action={redirect.url} className="redirect-form" method="post">
        {Object.entries(redirect.fields ?? {}).map(([name, value]) => (
          <input key={name} name={name} type="hidden" value={value} />
        ))}
        <button className="secondary-button" type="submit">
          Banka onayına devam et
        </button>
      </form>
    );
  }

  return (
    <a href={redirect.url} rel="noreferrer">
      Banka onayına devam et
    </a>
  );
}

function validatePaymentForm(form: PaymentForm): string {
  const amount = Number(normalizeAmount(form.amount));
  const cardNumber = onlyDigits(form.cardNumber);
  const month = Number(form.expiryMonth);
  const year = normalizeExpiryYear(form.expiryYear);

  if (!form.orderReference.trim()) {
    return 'Sipariş referansı zorunludur.';
  }

  if (!/^\d{8,24}$/.test(form.orderReference.trim())) {
    return 'Sipariş referansı 8 ile 24 haneli sayısal bir değer olmalıdır.';
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalizeAmount(form.amount)) || amount <= 0) {
    return 'Tutar sıfırdan büyük ve en fazla iki ondalıklı olmalıdır.';
  }

  if (!form.statementDescription.trim()) {
    return 'Ekstre açıklaması zorunludur.';
  }

  if (!form.holderName.trim()) {
    return 'Kart sahibi adı zorunludur.';
  }

  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return 'Kart numarası 13 ile 19 hane arasında olmalıdır.';
  }

  if (month < 1 || month > 12) {
    return 'Son kullanma ayı 01 ile 12 arasında olmalıdır.';
  }

  if (!year || isExpired(month, year)) {
    return 'Son kullanma yılı geçersiz.';
  }

  if (form.cvv.length < 3 || form.cvv.length > 4) {
    return 'Güvenlik kodu 3 veya 4 haneli olmalıdır.';
  }

  return '';
}

function toPaymentRequest(form: PaymentForm): PaymentRequest {
  return {
    orderReference: form.orderReference.trim(),
    amount: Number(normalizeAmount(form.amount)).toFixed(2),
    currency: SUPPORTED_CURRENCY,
    statementDescription: form.statementDescription.trim(),
    card: {
      holderName: form.holderName.trim(),
      number: onlyDigits(form.cardNumber),
      expiryMonth: form.expiryMonth.padStart(2, '0'),
      expiryYear: normalizeExpiryYear(form.expiryYear),
      cvv: form.cvv,
    },
  };
}

function createOrderReference() {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hour}${minute}${second}`;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function normalizeAmount(value: string) {
  return value.trim().replace(',', '.');
}

function normalizeExpiryYear(value: string) {
  const digits = onlyDigits(value);

  if (digits.length !== 2) {
    return '';
  }

  return digits;
}

function isExpired(month: number, twoDigitYear: string) {
  const now = new Date();
  const expiryYear = 2000 + Number(twoDigitYear);
  const expiryMonthIndex = month - 1;
  const endOfExpiryMonth = new Date(expiryYear, expiryMonthIndex + 1, 0, 23, 59, 59);

  return endOfExpiryMonth < now;
}

function formatCardNumber(value: string) {
  return onlyDigits(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
}

function formatStatus(status: PaymentResponse['status']) {
  const labels: Record<PaymentResponse['status'], string> = {
    APPROVED: 'Onaylandı',
    DECLINED: 'Reddedildi',
    REDIRECT_REQUIRED: 'Banka onayı gerekiyor',
    PENDING: 'Beklemede',
    FAILED: 'Başarısız',
    UNKNOWN: 'Bilinmiyor',
  };

  return labels[status];
}
