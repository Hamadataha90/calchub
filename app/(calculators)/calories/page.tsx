import type { Metadata } from "next";
import CalorieForm from "@/components/calculators/CalorieForm";


export const metadata: Metadata = {
  title: "Calorie Calculator | CalcHub",
  description:
    "Calculate your daily calorie needs based on age, weight, height, activity level, and goal.",
};

export default function CaloriesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Calorie Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Fill in your details to get your personalised daily calorie target.
        </p>
      </div>

      <CalorieForm />
    </div>
  );
}
