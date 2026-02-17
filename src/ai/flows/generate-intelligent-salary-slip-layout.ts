'use server';
/**
 * @fileOverview This flow generates an intelligent, aesthetically pleasing, and professional layout
 *               for a driver's salary slip based on provided data, using AI to optimize field placement and readability.
 *
 * - generateIntelligentSalarySlipLayout - A function that orchestrates the layout generation process.
 * - GenerateIntelligentSalarySlipLayoutInput - The input type for the layout generation.
 * - GenerateIntelligentSalarySlipLayoutOutput - The return type, representing the structured layout.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema for the salary slip data that needs to be laid out.
const SalaryItemSchema = z.object({
  item: z.string().describe('Description of the salary component (e.g., "Basic Salary", "Allowance", "Deduction").'),
  amount: z.number().describe('The monetary amount for this salary component.'),
});

const GenerateIntelligentSalarySlipLayoutInputSchema = z.object({
  companyName: z.string().describe('The name of the company issuing the salary slip.'),
  companyAddress: z.string().describe('The address of the company issuing the salary slip.'),
  billDate: z.string().describe('The date the bill was issued, in "YYYY-MM-DD" format.'),
  period: z.enum(['Monthly', 'Quarterly']).describe('The period type for which the salary is being paid.'),
  paymentPeriodStart: z.string().describe('The start date of the payment period, in "YYYY-MM-DD" format.'),
  paymentPeriodEnd: z.string().describe('The end date of the payment period, in "YYYY-MM-DD" format.'),
  startDateFY: z.string().describe('The start date of the Financial Year, in "YYYY-MM-DD" format.'),
  billNumber: z.string().nullable().describe('Optional bill number for the salary slip.'),
  driverName: z.string().describe('The full name of the driver.'),
  salaryBreakdown: z.array(SalaryItemSchema).describe('A detailed breakdown of earnings and deductions.'),
  totalSalary: z.number().describe('The total net salary amount.'),
  signatureDataUri: z.string().nullable().describe("Optional signature image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  stampDataUri: z.string().nullable().describe("Optional company stamp image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

export type GenerateIntelligentSalarySlipLayoutInput = z.infer<typeof GenerateIntelligentSalarySlipLayoutInputSchema>;

// Output Schema describing the AI-generated layout structure.
const LayoutFieldInfoSchema = z.object({
  key: z.string().describe('The key of the data field from the input (e.g., "driverName", "billDate", "totalSalary").'),
  label: z.string().describe('The display label for this field (e.g., "Driver Name", "Bill Date", "Total Pay").'),
  type: z.enum(['text', 'amount', 'date']).describe('The type of content this field represents, for appropriate formatting.'),
  emphasize: z.boolean().optional().describe('Whether this field should be emphasized (e.g., bold, larger font).'),
  alignment: z.enum(['left', 'center', 'right']).optional().describe('Suggested text alignment for the field value.'),
});

const LayoutTableSchema = z.object({
  title: z.string().optional().describe('An optional title for the table (e.g., "Earnings", "Deductions").'),
  headers: z.array(z.string()).describe('Column headers for the table (e.g., ["Item", "Amount"]).'),
  keyMapping: z.object({
    item: z.string().describe('The key in the input data that maps to the item column of the salary breakdown.'),
    amount: z.string().describe('The key in the input data that maps to the amount column of the salary breakdown.'),
  }).describe('Mapping of table columns to input data keys for salary breakdown items.'),
  type: z.literal('salaryBreakdownTable').describe('Indicates this is a table for salary breakdown.'),
});

const LayoutImageSchema = z.object({
  key: z.string().describe('The key of the image data field from the input (e.g., "signatureDataUri", "stampDataUri").'),
  label: z.string().optional().describe('An optional label for the image (e.g., "Authorized Signature").'),
  positionHint: z.string().optional().describe('Hint for image placement (e.g., "bottom-right", "aligned with label").'),
  type: z.literal('image').describe('Indicates this is an image.'),
});

const LayoutSectionSchema = z.object({
  title: z.string().optional().describe('An optional title for this section (e.g., "Header", "Employee Details", "Payment Summary", "Signatures").'),
  elements: z.array(z.union([LayoutFieldInfoSchema, LayoutTableSchema, LayoutImageSchema])).describe('An ordered list of elements (fields, tables, or images) to appear in this section.'),
  layoutHint: z.string().optional().describe('General layout suggestion for elements within this section (e.g., "two columns", "stacked", "inline").'),
});

const GenerateIntelligentSalarySlipLayoutOutputSchema = z.object({
  sections: z.array(LayoutSectionSchema).describe('An ordered list of sections for the salary slip layout. The AI should prioritize a professional and aesthetically pleasing design.'),
  overallDesignGoal: z.string().optional().describe('A high-level description of the design aesthetic (e.g., "modern minimalist", "classic professional").'),
});

export type GenerateIntelligentSalarySlipLayoutOutput = z.infer<typeof GenerateIntelligentSalarySlipLayoutOutputSchema>;

/**
 * Orchestrates the generation of an intelligent salary slip layout.
 * @param input The salary slip data to be laid out.
 * @returns A promise that resolves to the AI-generated layout structure.
 */
export async function generateIntelligentSalarySlipLayout(
  input: GenerateIntelligentSalarySlipLayoutInput
): Promise<GenerateIntelligentSalarySlipLayoutOutput> {
  return generateIntelligentSalarySlipLayoutFlow(input);
}

// Defines the prompt for the LLM to generate the salary slip layout.
const prompt = ai.definePrompt({
  name: 'generateIntelligentSalarySlipLayoutPrompt',
  input: { schema: GenerateIntelligentSalarySlipLayoutInputSchema },
  output: { schema: GenerateIntelligentSalarySlipLayoutOutputSchema },
  prompt: `You are an expert in professional document design, specifically for financial documents like salary slips.
Your task is to create a JSON representation of an optimal, professional, and aesthetically pleasing layout for a driver's salary slip.
Optimize field placement and readability for easy comprehension without requiring manual design.
Consider all provided input details, including optional elements like bill number, signature, and stamp.

The output should be structured into logical sections, and within each section, an ordered list of elements (fields, tables, or images).
For each field, provide its key from the input, a clear display label, its type (text, amount, date), and optionally suggest if it should be emphasized or its alignment.
For salary breakdown, use a 'salaryBreakdownTable' type and map the 'item' and 'amount' keys.
For images (signature, stamp), specify their key and an optional label, and a position hint.

Here are the details for the salary slip:

Company Name: {{{companyName}}}
Company Address: {{{companyAddress}}}
Bill Date: {{{billDate}}}
Period: {{{period}}}
Payment Period: {{{paymentPeriodStart}}} to {{{paymentPeriodEnd}}}
Financial Year Start Date: {{{startDateFY}}}
Driver Name: {{{driverName}}}
Total Salary: {{{totalSalary}}}
{{#if billNumber}}Bill Number: {{{billNumber}}}{{/if}}

Salary Breakdown (items and amounts):
{{#each salaryBreakdown}}
- {{this.item}}: {{this.amount}}
{{/each}}

{{#if signatureDataUri}}
Signature image is provided.
{{/if}}

{{#if stampDataUri}}
Company stamp image is provided.
{{/if}}

Based on these details, generate the JSON layout. Ensure the JSON is valid and complete.
`,
});

// Defines the Genkit flow for generating the intelligent salary slip layout.
const generateIntelligentSalarySlipLayoutFlow = ai.defineFlow(
  {
    name: 'generateIntelligentSalarySlipLayoutFlow',
    inputSchema: GenerateIntelligentSalarySlipLayoutInputSchema,
    outputSchema: GenerateIntelligentSalarySlipLayoutOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate salary slip layout.');
    }
    return output;
  }
);
