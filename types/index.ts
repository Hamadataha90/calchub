export type FormData = {
  age: number;
  weight: number;
  height: number;
  gender: "male" | "female";
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose" | "maintain" | "gain";
};

export type ResultData = {
  calories: number;
};

export type LeadData = {
  email: string;
  calories: number;
  goal: string;
};
