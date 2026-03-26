import type { LeadData } from "@/types";
import { readFileSync } from "fs";
import { join } from "path";

const GOAL_LABELS: Record<LeadData["goal"], string> = {
  lose: "Weight Loss",
  maintain: "Maintenance",
  gain: "Weight Gain",
};

function buildHtml(data: LeadData): string {
  const template = readFileSync(
    join(process.cwd(), "lib", "pdf-template.html"),
    "utf8"
  );
  return template
    .replace(/{{EMAIL}}/g, data.email)
    .replace(/{{CALORIES}}/g, String(data.calories))
    .replace(/{{GOAL}}/g, GOAL_LABELS[data.goal])
    .replace(/{{PROTEIN}}/g, String(Math.round((data.calories * 0.3) / 4)))
    .replace(/{{CARBS}}/g, String(Math.round((data.calories * 0.4) / 4)))
    .replace(/{{FAT}}/g, String(Math.round((data.calories * 0.3) / 9)));
}

export async function sendEmail(data: LeadData): Promise<void> {
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn("[email] EMAIL_API_KEY or EMAIL_FROM not set — skipping send");
    return;
  }

  const html = buildHtml(data);

  // Generic HTTP call — swap the URL/payload shape for your provider
  // (Resend, SendGrid, Mailgun, etc.)
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: data.email,
      subject: `Your free ${GOAL_LABELS[data.goal]} diet plan`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Email send failed (${res.status}): ${body}`);
  }
}
