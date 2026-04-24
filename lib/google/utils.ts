import { google } from 'googleapis';

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[Google API] Missing required environment variable: ${name}`);
    return "";
  }
  return value;
}

/**
 * Common Google Auth helper for Service Accounts
 * Useful for interacting with Sheets
 */
export function getSheetsClient() {
  const clientEmail = getRequiredEnv("GOOGLE_CLIENT_EMAIL");
  const privateKey = getRequiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}
