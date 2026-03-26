export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
};

export const posts: Post[] = [
  {
    slug: "how-many-calories",
    title: "How Many Calories Do You Need Per Day?",
    date: "2026-03-24",
    excerpt:
      "Understanding your daily calorie needs is the first step toward any health goal. Learn how to calculate your baseline.",
    content: `
Calorie counting doesn't have to be complicated. Whether you want to lose weight, build muscle, or just maintain your current physique, knowing your daily energy expenditure is the foundation.

## 1. What is BMR?
Your Basal Metabolic Rate (BMR) is the number of calories your body burns at rest just to keep you alive (breathing, circulating blood, cellular function). For most people, this makes up 60-75% of total daily calorie burn.

## 2. Factoring in Activity (TDEE)
Your Total Daily Energy Expenditure (TDEE) multiplies your BMR by your physical activity level:
- **Sedentary**: Office job, little to no exercise.
- **Moderate**: Light exercise 3-5 days a week.
- **Active**: Hard exercise most days of the week.

## 3. The Golden Rule
- **To Lose Weight**: Eat 300–500 calories below your TDEE.
- **To Maintain**: Eat right at your TDEE.
- **To Gain Muscle**: Eat 300–500 calories above your TDEE.

## Recommended Tools
- [Fitness App Placeholder](#)
- [Nutrition Tracker Placeholder](#)

---
**[Use our calorie calculator](/calculators/calories)**  
Find your personalized baseline in seconds.
    `.trim(),
  },
  {
    slug: "best-diet-plan-weight-loss",
    title: "Best Diet Plan for Weight Loss",
    date: "2026-03-22",
    excerpt:
      "The best diet isn't a restrictive fad — it's the one you can actually stick to. Here is how to build a sustainable plan.",
    content: `
There is no magic diet. Keto, paleo, intermittent fasting, and low-fat diets all work via the exact same mechanism: **a calorie deficit**.

## Focus on Satiety
When you're eating in a calorie deficit, hunger is your biggest enemy. To combat this, anchor your diet around high-satiety foods.

- **High Protein**: Protein is the most filling macronutrient. Target around 2g per kg of body weight.
- **High Fiber**: Vegetables like broccoli, spinach, and cauliflower provide huge physical volume for practically zero calories.
- **Hydration**: Drink a glass of water before every meal. Often, what feels like hunger is actually dehydration.

## The 80/20 Rule
Don't ban your favorite foods. If you do, you will eventually binge on them.
Instead, get **80%** of your calories from whole, unprocessed, nutrient-dense foods (lean meats, veggies, whole grains). Save the remaining **20%** for treats you genuinely enjoy.

## Track Consistently
A diet plan only works if you follow it. Tracking your food — even if only for the first two weeks — will teach you what a proper portion sizes look like.

## Recommended Tools
- [Fitness App Placeholder](#)
- [Nutrition Tracker Placeholder](#)

---
**[Use our calorie calculator](/calculators/calories)**  
Check your ideal daily targets to start shedding fat.
    `.trim(),
  },
  {
    slug: "how-to-gain-muscle",
    title: "How to Gain Muscle Effectively",
    date: "2026-03-20",
    excerpt:
      "Building muscle requires three things: a caloric surplus, sufficient protein, and progressive overload in the gym.",
    content: `
Gaining muscle (hypertrophy) is an energy-intensive process. You cannot build substantial muscle if you are barely eating enough to maintain your current weight.

## 1. The Caloric Surplus
You need to be in a modest caloric surplus. This means eating roughly 300–500 calories above your TDEE (Total Daily Energy Expenditure).
- If your surplus is too small, you won't grow.
- If your surplus is too large, you will gain unnecessary body fat alongside the muscle.

## 2. Protein is Non-Negotiable
Your muscles are literally made of protein. Aim for **1.8 to 2.2 grams of protein per kilogram of body weight**.
Good sources include chicken breast, lean beef, eggs, Greek yogurt, and whey protein isolate.

## 3. Progressive Overload
Eating alone will just make you gain weight. To drive that extra energy into muscle growth, you must force the muscle to adapt through resistance training.
- Focus on heavy compound movements (squats, deadlifts, presses, rows).
- Gradually increase the weight or reps over time. If you lift the same weights for the same reps every week, your body has no reason to grow.

## Recommended Tools
- [Fitness App Placeholder](#)
- [Nutrition Tracker Placeholder](#)

---
**[Use our calorie calculator](/calculators/calories)**  
Get the exact numbers needed for a lean bulk.
    `.trim(),
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
