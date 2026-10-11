import FinanceCalculator from "@/components/FinanceCalculator";
export const metadata = { title: "Car Finance Calculator Pakistan | CarBazar" };
export default function Page() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Car Finance Calculator in Pakistan</h1>
      <FinanceCalculator />
    </div>
  );
}
