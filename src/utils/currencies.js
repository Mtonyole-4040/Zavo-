export const CURRENCIES = {
  TZS: { code: "TZS", symbol: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿", rate: 1.0, isBase: true },
  USD: { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", rate: 1 / 2600 },
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", flag: "🇰🇪", rate: 1 / 20.15 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", rate: 1 / 2820 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧", rate: 1 / 3320 }
};

/**
 * Converts an amount from base currency (TZS) to target currency
 */
export const convertCurrency = (amountInTZS, targetCurrency = "TZS") => {
  const target = CURRENCIES[targetCurrency] || CURRENCIES.TZS;
  if (target.code === "TZS") return Math.round(amountInTZS);
  return Number((amountInTZS * target.rate).toFixed(2));
};

/**
 * Converts between any two currencies
 */
export const convertBetweenCurrencies = (amount, fromCurrency = "TZS", toCurrency = "TZS") => {
  const from = CURRENCIES[fromCurrency] || CURRENCIES.TZS;
  const to = CURRENCIES[toCurrency] || CURRENCIES.TZS;
  
  const amountInTZS = amount / from.rate;
  const finalAmt = amountInTZS * to.rate;
  return to.code === "TZS" ? Math.round(finalAmt) : Number(finalAmt.toFixed(2));
};

/**
 * Formats an amount with proper currency code or symbol and comma separators
 */
export const formatCurrency = (amountInTZS, targetCurrency = "TZS", options = {}) => {
  const curr = CURRENCIES[targetCurrency] || CURRENCIES.TZS;
  const converted = convertCurrency(amountInTZS, targetCurrency);
  const isNegative = converted < 0;
  const absVal = Math.abs(converted);

  const decimals = curr.code === "TZS" ? 0 : (options.decimals !== undefined ? options.decimals : 2);
  const formattedNumber = absVal.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  const sign = isNegative ? "-" : (options.showPositiveSign ? "+" : "");
  
  if (curr.code === "TZS" || curr.code === "KES") {
    return `${sign}${curr.symbol} ${formattedNumber}`;
  }
  return `${sign}${curr.symbol}${formattedNumber}`;
};
