export function PaymentBadges() {
  return (
    <div id="footer-payments" className="flex flex-wrap items-center gap-2">
      <Badge label="Visa">
        <VisaMark />
      </Badge>
      <Badge label="Mastercard">
        <MastercardMark />
      </Badge>
      <Badge label="American Express">
        <AmexMark />
      </Badge>
      <Badge label="Troy">
        <TroyMark />
      </Badge>
      <Badge label="SSL">
        <SslMark />
      </Badge>
    </div>
  );
}

function Badge({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span
      className="inline-flex h-10 min-w-[62px] items-center justify-center rounded-md bg-white px-2.5"
      role="img"
      aria-label={label}
    >
      {children}
    </span>
  );
}

function VisaMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-8" aria-hidden>
      <path
        fill="#1A1F71"
        d="M9.112 8.262 5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 0 1 .894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 0 1 1.913.336l.34-1.59a5.207 5.207 0 0 0-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 0 0-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656 1.02-2.815.588 2.815zm-8.16-4.84-1.603 7.496H8.34l1.605-7.496z"
      />
    </svg>
  );
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-[38px]" aria-hidden>
      <circle cx="14" cy="12" r="8.2" fill="#EB001B" />
      <circle cx="24" cy="12" r="8.2" fill="#F79E1B" />
      <path d="M19 5.7a8.2 8.2 0 0 1 0 12.6 8.2 8.2 0 0 1 0-12.6Z" fill="#FF5F00" />
    </svg>
  );
}

function AmexMark() {
  return (
    <svg viewBox="0 0 48 16" className="h-4 w-[46px]" aria-hidden>
      <rect width="48" height="16" rx="2" fill="#006FCF" />
      <text
        x="24"
        y="7.2"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="4.4"
        fontWeight="700"
        letterSpacing="0.4"
      >
        AMERICAN
      </text>
      <text
        x="24"
        y="12.6"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="4.4"
        fontWeight="700"
        letterSpacing="0.6"
      >
        EXPRESS
      </text>
    </svg>
  );
}

function TroyMark() {
  return (
    <svg viewBox="0 0 52 16" className="h-[18px] w-[52px]" aria-hidden>
      <text
        x="26"
        y="12.6"
        textAnchor="middle"
        fill="#1B3A8A"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="13"
        fontWeight="800"
        letterSpacing="0.2"
      >
        troy
      </text>
    </svg>
  );
}

function SslMark() {
  return (
    <svg viewBox="0 0 48 20" className="h-5 w-[46px]" aria-hidden>
      <path
        d="M10 3.2 16 1.4 22 3.2v6.1c0 4.2-2.6 7.9-6 8.9-3.4-1-6-4.7-6-8.9V3.2Z"
        fill="#1B8A4A"
      />
      <path
        d="M16 11.8a2.1 2.1 0 0 0 2.1-2.1V8.4A2.1 2.1 0 0 0 16 6.3a2.1 2.1 0 0 0-2.1 2.1v1.3c0 1.16.94 2.1 2.1 2.1Zm-1.15-3.4c0-.64.51-1.15 1.15-1.15.64 0 1.15.51 1.15 1.15v1.3c0 .64-.51 1.15-1.15 1.15a1.15 1.15 0 0 1-1.15-1.15V8.4Z"
        fill="#fff"
      />
      <text
        x="34"
        y="13.4"
        textAnchor="middle"
        fill="#1B8A4A"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="8.2"
        fontWeight="800"
        letterSpacing="0.4"
      >
        SSL
      </text>
    </svg>
  );
}
