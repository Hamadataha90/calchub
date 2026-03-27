import type { LeadData } from "@/types";
import { readFileSync } from "fs";
import { join } from "path";
import puppeteer from "puppeteer";

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

async function generatePdf(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  // Using networkidle0 to ensure all styles are loaded
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  await browser.close();
  return Buffer.from(pdfBuffer);
}

export async function sendEmail(data: LeadData): Promise<void> {
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn("[email] EMAIL_API_KEY or EMAIL_FROM not set — skipping send");
    return;
  }

  const html = buildHtml(data);
  const pdfBuffer = await generatePdf(html);

  // Sending to Resend with attachment
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: data.email,
      subject: `Your personalized ${GOAL_LABELS[data.goal]} diet plan`,
      html,
      attachments: [
        {
          filename: "Diet_Plan.pdf",
          content: pdfBuffer.toString("base64"),
        }
      ]
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Email send failed (${res.status}): ${body}`);
  }
}
