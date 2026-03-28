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
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.calc-hub.site";
  
  return template
    .replace(/{{EMAIL}}/g, data.email)
    .replace(/{{CALORIES}}/g, String(data.calories))
    .replace(/{{GOAL}}/g, GOAL_LABELS[data.goal])
    .replace(/{{PROTEIN}}/g, String(Math.round((data.calories * 0.3) / 4)))
    .replace(/{{CARBS}}/g, String(Math.round((data.calories * 0.4) / 4)))
    .replace(/{{FAT}}/g, String(Math.round((data.calories * 0.3) / 9)))
    .replace(/https:\/\/calchub\.io/g, siteUrl);
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
  let pdfBuffer: Buffer | null = null;
  
  try {
    pdfBuffer = await generatePdf(html);
  } catch (err) {
    console.warn("[email] PDF generation failed (likely serverless environment). Sending email without attachment.", err);
  }

  interface ResendEmailPayload {
    from: string;
    to: string;
    subject: string;
    html: string;
    reply_to?: string;
    attachments?: Array<{
      filename: string;
      content: string;
    }>;
  }

  const payload: ResendEmailPayload = {
    from: "Calc Hub <hello@calc-hub.site>",
    to: data.email,
    subject: `Your personalized ${GOAL_LABELS[data.goal]} diet plan`,
    html,
    reply_to: "support@calc-hub.site",
  };

  if (pdfBuffer) {
    payload.attachments = [
      {
        filename: "Diet_Plan.pdf",
        content: pdfBuffer.toString("base64"),
      }
    ];
  }

  // Sending to Resend
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Email send failed (${res.status}): ${body}`);
  }
}
