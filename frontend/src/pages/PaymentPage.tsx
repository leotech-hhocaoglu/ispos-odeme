import { type FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../app/AuthContext';
import { paymentService } from '../services/payments';
import { ApiError } from '../types/api';
import type { PaymentRequest, PaymentResponse } from '../types/payment';

type PaymentForm = {
  orderReference: string;
  amount: string;
  currency: PaymentRequest['currency'];
  holderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
};

const initialForm: PaymentForm = {
  orderReference: `ORD-${new Date().getFullYear()}-`,
  amount: '',
  currency: 'TRY',
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

          <div className="form-grid two-columns">
            <label className="field">
              <span>Sipariş referansı</span>
              <input
                name="orderReference"
                value={form.orderReference}
                onChange={(event) => setForm({ ...form, orderReference: event.target.value })}
                placeholder="ORD-2026-0001"
              />
            </label>

            <label className="field">
              <span>Para birimi</span>
              <select
                name="currency"
                value={form.currency}
                onChange={(event) =>
                  setForm({ ...form, currency: event.target.value as PaymentForm['currency'] })
                }
              >
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
          </div>

          <label className="field">
            <span>Tutar</span>
            <input
              inputMode="decimal"
              name="amount"
              value={form.amount}
              onChange={(event) => setForm({ ...form, amount: event.target.value })}
              placeholder="125.50"
            />
          </label>

          <div className="section-heading">
            <h2>Kart</h2>
          </div>

          <label className="field">
            <span>Kart sahibi</span>
            <input
              autoComplete="cc-name"
              name="holderName"
              value={form.holderName}
              onChange={(event) => setForm({ ...form, holderName: event.target.value })}
              placeholder="Ada Lovelace"
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
              placeholder="4111 1111 1111 1111"
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
                placeholder="12"
              />
            </label>

            <label className="field">
              <span>Yıl</span>
              <input
                autoComplete="cc-exp-year"
                inputMode="numeric"
                maxLength={4}
                name="expiryYear"
                value={form.expiryYear}
                onChange={(event) =>
                  setForm({ ...form, expiryYear: onlyDigits(event.target.value).slice(0, 4) })
                }
                placeholder="2030"
              />
            </label>

            <label className="field">
              <span>CVV</span>
              <input
                autoComplete="cc-csc"
                inputMode="numeric"
                maxLength={4}
                name="cvv"
                value={form.cvv}
                onChange={(event) =>
                  setForm({ ...form, cvv: onlyDigits(event.target.value).slice(0, 4) })
                }
                placeholder="123"
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
              {form.amount || '0.00'} {form.currency}
            </strong>
          </div>
          <div>
            <p className="summary-label">Sipariş</p>
            <strong>{form.orderReference || 'Belirtilmedi'}</strong>
          </div>
          <div>
            <p className="summary-label">Kart</p>
            <strong>{maskedCard}</strong>
          </div>
          <p className="summary-note">
            Sağlayıcı bilgileri, imzalama ve ödeme altyapısı iletişimi backend tarafında kalır.
          </p>
        </aside>
      </section>
    </main>
  );
}

function PaymentResult({ result }: { result: PaymentResponse }) {
  const className = result.status === 'APPROVED' ? 'alert-success' : 'alert-info';

  return (
    <div className={`alert ${className}`} role="status">
      <strong>{formatStatus(result.status)}</strong>
      <span>{result.message ?? 'Ödeme yanıtı alındı.'}</span>
      {result.redirect ? (
        <a href={result.redirect.url} rel="noreferrer">
          Sağlayıcı doğrulamasına devam et
        </a>
      ) : null}
    </div>
  );
}

function validatePaymentForm(form: PaymentForm): string {
  const amount = Number(form.amount);
  const cardNumber = onlyDigits(form.cardNumber);
  const month = Number(form.expiryMonth);
  const year = Number(form.expiryYear);
  const currentYear = new Date().getFullYear();

  if (!form.orderReference.trim()) {
    return 'Sipariş referansı zorunludur.';
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Tutar sıfırdan büyük olmalıdır.';
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

  if (year < currentYear || year > currentYear + 25) {
    return 'Son kullanma yılı geçersiz.';
  }

  if (form.cvv.length < 3 || form.cvv.length > 4) {
    return 'CVV 3 veya 4 haneli olmalıdır.';
  }

  return '';
}

function toPaymentRequest(form: PaymentForm): PaymentRequest {
  return {
    orderReference: form.orderReference.trim(),
    amount: Number(form.amount).toFixed(2),
    currency: form.currency,
    card: {
      holderName: form.holderName.trim(),
      number: onlyDigits(form.cardNumber),
      expiryMonth: form.expiryMonth.padStart(2, '0'),
      expiryYear: form.expiryYear,
      cvv: form.cvv,
    },
  };
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
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
    REDIRECT_REQUIRED: 'Yönlendirme gerekli',
    PENDING: 'Beklemede',
    FAILED: 'Başarısız',
    UNKNOWN: 'Bilinmiyor',
  };

  return labels[status];
}
