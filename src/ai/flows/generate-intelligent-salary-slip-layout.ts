'use server';
/**
 * @fileOverview This flow generates an intelligent, aesthetically pleasing, and professional layout
 *               for a driver's salary receipt based on provided data, using AI to optimize field placement and readability.
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
  employerName: z.string().describe('The name of the person or entity paying the salary.'),
  billDate: z.string().describe('The date the bill was issued, in "YYYY-MM-DD" format.'),
  period: z.enum(['Monthly', 'Quarterly', 'Custom']).describe('The period type for which the salary is being paid.'),
  paymentPeriodStart: z.string().describe('The start date of the payment period, in "YYYY-MM-DD" format.'),
  paymentPeriodEnd: z.string().describe('The end date of the payment period, in "YYYY-MM-DD" format.'),
  startDateFY: z.string().describe('The start date of the Financial Year, in "YYYY-MM-DD" format.'),
  billNumber: z.string().nullable().describe('Optional bill number for the salary slip.'),
  driverName: z.string().describe('The full name of the driver.'),
  vehicleNumber: z.string().describe('The vehicle number associated with the driver.'),
  salaryBreakdown: z.array(SalaryItemSchema).describe('A detailed breakdown of earnings and deductions.'),
  totalSalary: z.number().describe('The total net salary amount.'),
  signatureDataUri: z.string().nullable().describe("Optional signature image as a data URI."),
  stampDataUri: z.string().nullable().describe("Optional company stamp image as a data URI."),
});

export type GenerateIntelligentSalarySlipLayoutInput = z.infer<typeof GenerateIntelligentSalarySlipLayoutInputSchema>;

// Output Schema describing the AI-generated layout structure.
const LayoutFieldInfoSchema = z.object({
  key: z.string().describe('The key of the data field from the input.'),
  label: z.string().describe('The display label for this field.'),
  type: z.enum(['text', 'amount', 'date']).describe('The type of content this field represents.'),
  emphasize: z.boolean().optional().describe('Whether this field should be emphasized.'),
  alignment: z.enum(['left', 'center', 'right']).optional().describe('Suggested text alignment.'),
});

const LayoutParagraphSchema = z.object({
  content: z.string().describe('A paragraph of text, potentially including formatted data values.'),
  type: z.literal('paragraph'),
});

const LayoutTableSchema = z.object({
  title: z.string().optional().describe('An optional title for the table.'),
  headers: z.array(z.string()).describe('Column headers.'),
  keyMapping: z.object({
    item: z.string(),
    amount: z.string(),
  }),
  type: z.literal('salaryBreakdownTable'),
});

const LayoutImageSchema = z.object({
  key: z.string().describe('The key of the image data field.'),
  label: z.string().optional().describe('An optional label.'),
  positionHint: z.string().optional().describe('Hint for image placement.'),
  type: z.literal('image'),
});

const LayoutSectionSchema = z.object({
  title: z.string().optional().describe('An optional title for this section.'),
  elements: z.array(z.union([LayoutFieldInfoSchema, LayoutTableSchema, LayoutImageSchema, LayoutParagraphSchema])).describe('An ordered list of elements.'),
  layoutHint: z.string().optional().describe('General layout suggestion.'),
});

const GenerateIntelligentSalarySlipLayoutOutputSchema = z.object({
  sections: z.array(LayoutSectionSchema).describe('An ordered list of sections for the salary slip layout.'),
  overallDesignGoal: z.string().optional().describe('A high-level description of the design aesthetic.'),
});

export type GenerateIntelligentSalarySlipLayoutOutput = z.infer<typeof GenerateIntelligentSalarySlipLayoutOutputSchema>;

export async function generateIntelligentSalarySlipLayout(
  input: GenerateIntelligentSalarySlipLayoutInput
): Promise<GenerateIntelligentSalarySlipLayoutOutput> {
  return generateIntelligentSalarySlipLayoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIntelligentSalarySlipLayoutPrompt',
  input: { schema: GenerateIntelligentSalarySlipLayoutInputSchema },
  output: { schema: GenerateIntelligentSalarySlipLayoutOutputSchema },
  prompt: `You are an expert in professional document design.
Your task is to create a JSON representation of an optimal, professional layout for a "Driver Salary Receipt".

CRITICAL INSTRUCTION: The layout MUST follow this specific template format:
1. Top Right: Date.
2. Center: Title "Driver Salary Receipt".
3. A main paragraph element that reads exactly: "This is to certify that Mr./Ms. [Employer Name] have paid ₹ [Total Salary] to driver Mr/Ms [Driver Name] towards salary of the period [Start Date] to [End Date] (Acknowledged receipt enclosed). I also declare that the driver is exclusively utilized for official purpose only".
4. A second paragraph element that reads: "Please reimburse the above amount. I further declare that what is stated above is correct and true."
5. A section containing "Vehicle Number" and "Period" (Start Date to End Date).
6. A section containing "Driver Name".
7. Space for Stamp and Signature at the bottom.

Use the 'paragraph' element type for the long descriptive texts.
Use 'text', 'amount', or 'date' element types for standalone fields.
For images (signature, stamp), specify their key and position hint.

Input Details:
Employer Name: {{{employerName}}}
Driver Name: {{{driverName}}}
Vehicle Number: {{{vehicleNumber}}}
Total Salary: {{{totalSalary}}}
Bill Date: {{{billDate}}}
Period Start: {{{paymentPeriodStart}}}
Period End: {{{paymentPeriodEnd}}}

{{#if signatureDataUri}}Signature image is provided.{{/if}}
{{#if stampDataUri}}Company stamp image is provided.{{/if}}

Generate the JSON layout matching the structure of the provided image as closely as possible.`,
});

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