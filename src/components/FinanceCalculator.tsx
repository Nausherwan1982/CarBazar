"use client";

import { useMemo, useState } from "react";
import { calculateFinance, formatPKR } from "@/lib/calculators";

export default function FinanceCalculator({ defaultPrice = 5_000_000 }: { defaultPrice?: number }) {
  const safeDefaultPrice = Number.isFinite(defaultPrice) && defaultPrice > 0 ? defaultPrice : 5_000_000;
  const [carPrice, setCarPrice] = useState(safeDefaultPrice);
  const [downPayment, setDownPayment] = useState(Math.round(safeDefaultPrice * 0.3));
  const [annualRate, setAnnualRate] = useState(22);
  const [tenureMonths, setTenureMonths] = useState(60);
  const result = useMemo(() => {
    if (carPrice <= 0 || downPayment < 0 || downPayment >= carPrice || annualRate < 0 || tenureMonths < 1 || tenureMonths > 360) return null;
    return calculateFinance({ carPrice, downPayment, annualRatePercent: annualRate, tenureMonths });
  }, [carPrice, downPayment, annualRate, tenureMonths]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="space-y-4 rounded-xl bg-white p-5 shadow">
        <NumberField label="Car price (PKR)" value={carPrice} min={1} onChange={setCarPrice} />
        <NumberField label="Down payment (PKR)" value={downPayment} min={0} onChange={setDownPayment} />
        <NumberField label="Annual rate (%)" value={annualRate} min={0} step={0.1} onChange={setAnnualRate} />
        <NumberField label="Tenure (months)" value={tenureMonths} min={1} max={360} onChange={setTenureMonths} />
        {!result && <p role="alert" className="text-sm text-red-600">Enter a valid price, down payment, interest rate, and loan term.</p>}
      </section>
      {result && (
        <section className="space-y-3 rounded-xl bg-white p-5 shadow">
          <Summary label="Monthly installment" value={`Rs ${formatPKR(result.monthlyEMI)}`} prominent />
          <Summary label="Loan principal" value={`Rs ${formatPKR(result.principal)}`} />
          <Summary label="Total interest" value={`Rs ${formatPKR(result.totalInterest)}`} />
          <Summary label="Total repayment" value={`Rs ${formatPKR(result.totalPayment)}`} />
        </section>
      )}
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="input mt-1"
      />
    </label>
  );
}

function Summary({ label, value, prominent = false }: { label: string; value: string; prominent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 last:border-0">
      <span className="text-gray-600">{label}</span>
      <strong className={prominent ? "text-xl text-red-600" : "text-gray-900"}>{value}</strong>
    </div>
  );
}
