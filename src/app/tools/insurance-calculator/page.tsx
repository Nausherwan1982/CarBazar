import InsuranceCalculator from "@/components/InsuranceCalculator";
export const metadata = { title: "Car Insurance Calculator Pakistan | CarBazar" };
export default function Page() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Car Insurance Calculator in Pakistan</h1>
      <InsuranceCalculator />
    </div>
  );
}
