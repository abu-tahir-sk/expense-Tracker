export function formatCurrency(amount: number, currency: string = "INR") {
  const locales: Record<string, string> = {
    "INR": "en-IN",
    "USD": "en-US",
    "EUR": "en-DE",
    "GBP": "en-GB",
    "BDT": "en-BD"
  };

  const locale = locales[currency] || "en-US";

  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency, 
    maximumFractionDigits: 0 
  }).format(amount);
}

export function formatCurrencyForPDF(amount: number, currency: string = "INR") {
  const locales: Record<string, string> = {
    "INR": "en-IN",
    "USD": "en-US",
    "EUR": "en-DE",
    "GBP": "en-GB",
    "BDT": "en-BD"
  };

  const locale = locales[currency] || "en-US";

  const numberStr = new Intl.NumberFormat(locale, { 
    style: 'decimal', 
    maximumFractionDigits: 0 
  }).format(amount);

  return `${currency} ${numberStr}`;
}
