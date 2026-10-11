export function calculateFinance(input: {
  carPrice: number; downPayment: number; annualRatePercent: number;
  tenureMonths: number; insurancePerYear?: number; processingFee?: number;
}) {
  const { carPrice, downPayment, annualRatePercent, tenureMonths, insurancePerYear = 0, processingFee = 0 } = input;
  const principal = Math.max(0, carPrice - downPayment);
  const r = annualRatePercent / 12 / 100;
  const n = tenureMonths;
  const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const monthlyInsurance = insurancePerYear / 12;
  const monthlyEMI = emi + monthlyInsurance;
  const schedule = [];
  let balance = principal, cumulativeInterest = 0;
  for (let m = 1; m <= n; m++) {
    const interestPaid = balance * r;
    const principalPaid = emi - interestPaid;
    const closingBalance = Math.max(0, balance - principalPaid);
    cumulativeInterest += interestPaid;
    schedule.push({
      month: m,
      openingBalance: round(balance),
      principalPaid: round(principalPaid),
      interestPaid: round(interestPaid),
      closingBalance: round(closingBalance),
      cumulativeInterest: round(cumulativeInterest),
    });
    balance = closingBalance;
  }
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;
  return {
    principal: round(principal),
    monthlyEMI: round(monthlyEMI),
    totalPayment: round(totalPayment),
    totalInterest: round(totalInterest),
    totalUpfront: round(downPayment + processingFee + insurancePerYear),
    effectiveInterestPercent: round((totalInterest / principal) * 100),
    schedule,
  };
}

export function calculateInsurance(input: {
  idv: number; engineCC: number; vehicleAge: number;
  city: string; trackerInstalled: boolean; claimFreeYears: number; baseRatePercent?: number;
}) {
  const { idv, engineCC, vehicleAge, city, trackerInstalled, claimFreeYears, baseRatePercent = 2.5 } = input;
  const basePremium = (idv * baseRatePercent) / 100;
  let ccLoad = 0;
  if (engineCC > 2000) ccLoad = 0.35;
  else if (engineCC > 1500) ccLoad = 0.20;
  else if (engineCC > 1000) ccLoad = 0.10;
  const ccAmount = basePremium * ccLoad;
  const ageLoading = basePremium * Math.min(0.4, vehicleAge * 0.05);
  let cityPct = 0;
  if (city === "Karachi") cityPct = 0.15;
  else if (city === "Lahore") cityPct = 0.10;
  else if (city === "Islamabad" || city === "Rawalpindi") cityPct = 0.05;
  const cityLoading = basePremium * cityPct;
  const theftFireAddon = (idv * 0.5) / 100;
  const trackerDiscount = trackerInstalled ? basePremium * 0.10 : 0;
  let ncbPct = 0;
  if (claimFreeYears === 1) ncbPct = 0.20;
  else if (claimFreeYears === 2) ncbPct = 0.30;
  else if (claimFreeYears === 3) ncbPct = 0.40;
  else if (claimFreeYears >= 4) ncbPct = 0.50;
  const ncbDiscount = basePremium * ncbPct;
  const preTax = basePremium + ccAmount + ageLoading + cityLoading + theftFireAddon - trackerDiscount - ncbDiscount;
  const taxes = preTax * 0.16;
  const totalPayable = preTax + taxes;
  return {
    basePremium: round(basePremium),
    trackerDiscount: round(trackerDiscount),
    cityLoading: round(cityLoading),
    ageLoading: round(ageLoading),
    theftFireAddon: round(theftFireAddon),
    ncbDiscount: round(ncbDiscount),
    totalPremium: round(preTax),
    taxes: round(taxes),
    totalPayable: round(totalPayable),
    breakdown: [
      { label: `Base premium @ ${baseRatePercent}%`, amount: round(basePremium) },
      { label: "Engine CC loading", amount: round(ccAmount) },
      { label: "Age loading", amount: round(ageLoading) },
      { label: `${city} city loading`, amount: round(cityLoading) },
      { label: "Theft & Fire add-on", amount: round(theftFireAddon) },
      { label: "Tracker discount", amount: -round(trackerDiscount) },
      { label: `NCB (${Math.round(ncbPct * 100)}%)`, amount: -round(ncbDiscount) },
      { label: "Sub-total", amount: round(preTax) },
      { label: "Taxes (~16%)", amount: round(taxes) },
    ],
  };
}

function round(n: number) { return Math.round(n * 100) / 100; }
export function formatPKR(n: number) { return new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(n); }
