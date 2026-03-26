import { NextRequest, NextResponse } from "next/server";
import type { LeadData } from "@/types";
import { sendEmail } from "@/lib/email";

/**
 * MOCK DATABASE LOGIC
 * Swap this out with Prisma/Drizzle/Supabase to permanently store leads.
 */
async function saveLeadToDatabase(lead: LeadData) {
  // TODO: Insert lead into your 'Leads' table.
  // Example: await db.insert(leads).values(lead);

  console.log("\n=====================================");
  console.log("💾 NEW LEAD CAPTURED & SAVED");
  console.log(`✉️  Email:    ${lead.email}`);
  console.log(`🔥  Calories: ${lead.calories.toLocaleString()} kcal/day`);
  console.log(`🎯  Goal:     ${lead.goal.toUpperCase()}`);
  console.log(`⏰  Time:     ${new Date().toISOString()}`);
  console.log("=====================================\n");
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { email, calories, goal } = body as Partial<LeadData>;

  // ── Validation ─────────────────────────────────────────────────────────────
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { success: false, error: "A valid email is required" },
      { status: 422 }
    );
  }

  if (!calories || typeof calories !== "number" || calories <= 0) {
    return NextResponse.json(
      { success: false, error: "A valid calories value is required" },
      { status: 422 }
    );
  }

  if (!goal || !["lose", "maintain", "gain"].includes(goal)) {
    return NextResponse.json(
      { success: false, error: "Goal must be 'lose', 'maintain', or 'gain'" },
      { status: 422 }
    );
  }

  const lead: LeadData = { email: email.toLowerCase().trim(), calories: Math.round(calories), goal };

  // ── 1. Save to Database ────────────────────────────────────────────────────
  try {
    await saveLeadToDatabase(lead);
  } catch (dbErr) {
    console.error("[api/lead] Database save failed:", dbErr);
    // Determine if you want a 500 error here or to continue to email regardless
  }

  // ── 2. Trigger Email ───────────────────────────────────────────────────────
  try {
    await sendEmail(lead);
  } catch (emailErr) {
    // Log but don't surface email errors to the client — the lead itself saved.
    console.error("[api/lead] Email send failed:", emailErr);
  }

  // ── 3. Respond ─────────────────────────────────────────────────────────────
  return NextResponse.json(
    { success: true, message: "Lead captured successfully" },
    { status: 201 }
  );
}
