"use client";

import { useMemo, useState } from "react";
import { calculateInsurance, formatPKR } from "@/lib/calculators";

const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

export default function InsuranceCalculator({ defaultIDV = 3_000_000 }: { defaultIDV?: number }) {
  const safeDefaultIDV = Number.isFinite(defaultIDV) && defaultIDV > 0 ? defaultIDV : 3_000_000;
  const [idv, setIdv] = useState(safeDefaultIDV);
  const [engineCC, setEngineCC] = useState(1300);
  const [vehicleAge, setVehicleAge] = useState(3);
  const [city, setCity] = useState("Karachi");
  const [trackerInstalled, setTrackerInstalled] = useState(false);
  const [claimFreeYears, setClaimFreeYears] = useState(0);
  const result = useMemo(() => {
    if (idv <= 0 || engineCC <= 0 || vehicleAge < 0 || claimFreeYears < 0) return null;
    return calculateInsurance({ idv, engineCC, vehicleAge, city, trackerInstalled, claimFreeYears });
  }, [idv, engineCC, vehicleAge, city, trackerInstalled, claimFreeYears]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="space-y-4 rounded-xl bg-white p-5 shadow">
        <NumberField label="Insured value (PKR)" value={idv} min={1} onChange={setIdv} />
        <NumberField label="Engine capacity (cc)" value={engineCC} min={1} onChange={setEngineCC} />
        <NumberField label="Vehicle age (years)" value={vehicleAge} min={0} onChange={setVehicleAge} />
        <label className="block text-sm font-medium">
          City
          <select className="input mt-1" value={city} onChange={(event) => setCity(event.target.value)}>
            {cities.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={trackerInstalled} onChange={(event) => setTrackerInstalled(event.target.checked)} />
          Vehicle has a tracker
        </label>
        <NumberField label="Claim-free years" value={claimFreeYears} min={0} max={10} onChange={setClaimFreeYears} />
        {!result && <p role="alert" className="text-sm text-red-600">Enter valid vehicle details to estimate the premium.</p>}
      </section>
      {result && (
        <section className="rounded-xl bg-white p-5 shadow">
          <div className="mb-3 border-b pb-4">
            <p className="text-sm text-gray-600">Estimated annual premium</p>
            <p className="text-2xl font-bold text-red-600">Rs {formatPKR(result.totalPayable)}</p>
          </div>
          <div className="space-y-2">
            {result.breakdown.map(({ label, amount }) => (
              <div key={label} className="flex justify-between gap-4 text-sm">
                <span className="text-gray-600">{label}</span>
                <span>Rs {formatPKR(amount)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">This is an estimate only. Confirm final pricing with an insurer.</p>
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
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max?: number;
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
        onChange={(event) => onChange(Number(event.target.value))}
        className="input mt-1"
      />
    </label>
  );
}
