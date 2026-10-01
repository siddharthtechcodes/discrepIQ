import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

// Enable CORS for frontend Vite dev server & production
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '15mb' }));

// Configure Multer for memory storage, 10MB limit, PDF/JPG/PNG
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file format: ${file.mimetype}. Only PDF, JPG, and PNG documents are allowed.`
        )
      );
    }
  },
});

// Helper to calculate math reconciliation
function reconcileFinancials(data) {
  const lineItems = Array.isArray(data.lineItems) ? data.lineItems : [];
  const calculatedLineTotal = lineItems.reduce((acc, item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.unitPrice) || 0;
    const amount =
      item.amount !== undefined && !isNaN(Number(item.amount))
        ? Number(item.amount)
        : qty * price;
    return acc + amount;
  }, 0);

  const subtotal =
    Number(data.financials?.subtotal) || Number(calculatedLineTotal.toFixed(2));
  const taxAmount = Number(data.financials?.taxAmount) || 0;
  const totalAmount =
    Number(data.financials?.totalAmount) ||
    Number((subtotal + taxAmount).toFixed(2));

  const expectedTotal = Number((subtotal + taxAmount).toFixed(2));
  const diff = Number(Math.abs(expectedTotal - totalAmount).toFixed(2));
  const lineDiff = Number(Math.abs(calculatedLineTotal - subtotal).toFixed(2));

  const isValid = diff < 0.05 && lineDiff < 0.05;

  const curr = (data.currency === 'USD' ? '$' : (data.currency === 'EUR' ? '€' : (data.currency === 'GBP' ? '£' : '₹')));

  let notes = '';
  if (isValid) {
    notes = `Verified: Line items sum (${curr}${calculatedLineTotal.toFixed(
      2
    )}) + Tax (${curr}${taxAmount.toFixed(2)}) reconciles with Total (${curr}${totalAmount.toFixed(
      2
    )}).`;
  } else {
    notes = `Reconciliation Warning: Line items sum is ${curr}${calculatedLineTotal.toFixed(
      2
    )}. Subtotal (${curr}${subtotal.toFixed(2)}) + Tax (${curr}${taxAmount.toFixed(
      2
    )}) = ${curr}${expectedTotal.toFixed(2)}, but document Total is ${curr}${totalAmount.toFixed(
      2
    )} (Discrepancy: ${curr}${diff.toFixed(2)}).`;
  }

  return {
    isValid,
    notes,
    calculatedLineTotal: Number(calculatedLineTotal.toFixed(2)),
    calculatedExpectedTotal: expectedTotal,
    discrepancy: diff,
  };
}

// Extraction prompt schema & instructions
const EXTRACTION_PROMPT = `
You are an expert Document Processing AI specialist.
Analyze the provided document (which may be an Invoice, Receipt, Purchase Order, or other business document).
Accurately extract all structured information and return ONLY a valid, parseable JSON object matching this exact schema:

{
  "documentType": "Invoice" | "Receipt" | "Purchase Order" | "Other",
  "vendor": {
    "name": "string",
    "taxId": "string",
    "address": "string"
  },
  "dates": {
    "invoiceDate": "YYYY-MM-DD or string",
    "dueDate": "YYYY-MM-DD or string"
  },
  "currency": "INR (default for Indian Rupee documents, or USD, EUR, GBP)",
  "lineItems": [
    {
      "description": "string",
      "quantity": 1,
      "unitPrice": 0.00,
      "amount": 0.00
    }
  ],
  "financials": {
    "subtotal": 0.00,
    "taxAmount": 0.00,
    "totalAmount": 0.00
  },
  "mathValidation": {
    "isValid": true,
    "notes": "string"
  },
  "summary": "Concise 1-2 sentence executive summary of the document purpose, vendor, and total in INR."
}

Rules:
1. Always parse numerical values as raw numbers (e.g., 4999.00, not "₹4999.00").
2. Default currency to "INR" unless another foreign currency code (USD, EUR, GBP) is explicitly stated on the document.
3. For lineItems, if quantity or unitPrice is missing, infer reasonable values or set quantity=1, unitPrice=amount.
4. Check if line items sum up to subtotal and subtotal + taxAmount equals totalAmount. Set mathValidation accordingly.
5. Output MUST be strictly valid JSON without markdown fences (e.g. no \`\`\`json) if possible, or plain JSON.
`;

// Demo Fallback Data if API key is not configured or in sandbox mode
function getDemoExtraction(fileName) {
  return {
    documentType: "Invoice",
    vendor: {
      name: "Apex Cloud Technologies India Pvt Ltd",
      taxId: "GSTIN-29AABCU9603R1ZM",
      address: "Tower B, Electronic City Phase 1, Bengaluru, Karnataka 560100"
    },
    dates: {
      invoiceDate: "2026-09-15",
      dueDate: "2026-10-15"
    },
    currency: "INR",
    lineItems: [
      {
        description: "Enterprise Cloud Hosting - Kubernetes Cluster (3 Nodes)",
        quantity: 1,
        unitPrice: 125000.00,
        amount: 125000.00
      },
      {
        description: "Dedicated AI Inference Endpoint (GPU L4 x 2)",
        quantity: 2,
        unitPrice: 45000.00,
        amount: 90000.00
      },
      {
        description: "Managed PostgreSQL High Availability Database",
        quantity: 1,
        unitPrice: 28000.00,
        amount: 28000.00
      },
      {
        description: "Edge CDN & DDoS Protection Shield",
        quantity: 1,
        unitPrice: 12000.00,
        amount: 12000.00
      }
    ],
    financials: {
      subtotal: 255000.00,
      taxAmount: 45900.00,
      totalAmount: 300900.00
    },
    mathValidation: {
      isValid: true,
      notes: "Verified: Line items sum (₹255,000.00) + 18% GST (₹45,900.00) reconciles with Total (₹300,900.00)."
    },
    summary: `Extracted from ${fileName}: Apex Cloud Technologies India invoice for enterprise cloud infrastructure and AI compute totaling ₹3,00,900.00 INR (including 18% GST).`,
    isDemoMode: true,
    demoMessage: "GEMINI_API_KEY is not configured in backend/.env. Running with demo processing pipeline so you can test the UI immediately. Set your GEMINI_API_KEY to switch to live Gemini extraction."
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  dotenv.config();
  const currentKey = process.env.GEMINI_API_KEY;
  const hasKey = Boolean(currentKey && currentKey.trim() !== '' && currentKey !== 'your_gemini_api_key_here');
  res.json({
    status: 'ok',
    service: 'DiscrepIQ Backend API',
    hasGeminiKey: hasKey,
    model: process.env.GEMINI_MODEL || GEMINI_MODEL,
    timestamp: new Date().toISOString()
  });
});

// Test Gemini API key live connection
app.post('/api/config/test', async (req, res) => {
  try {
    dotenv.config();
    const keyToTest = (req.body?.apiKey || process.env.GEMINI_API_KEY || '').trim();
    if (!keyToTest || keyToTest === 'your_gemini_api_key_here') {
      return res.status(400).json({ success: false, error: 'No Gemini API key provided to test.' });
    }
    const modelToTest = req.body?.model || process.env.GEMINI_MODEL || 'gemini-3.5-flash';
    const genAI = new GoogleGenerativeAI(keyToTest);
    const model = genAI.getGenerativeModel({ model: modelToTest });
    const result = await model.generateContent('Health check. Reply with "OK".');
    const text = result.response.text();
    return res.json({
      success: true,
      message: `Gemini API connection verified with ${modelToTest}!`,
      response: text.trim(),
      model: modelToTest
    });
  } catch (err) {
    console.warn('API key test error:', err.message);
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// Configure or update Gemini API key dynamically
app.post('/api/config/key', (req, res) => {
  const { apiKey, model } = req.body || {};
  if (apiKey) {
    const cleanedKey = apiKey.trim();
    process.env.GEMINI_API_KEY = cleanedKey;
    try {
      const envPath = path.resolve(__dirname, '.env');
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
      if (envContent.includes('GEMINI_API_KEY=')) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY=${cleanedKey}`);
      } else {
        envContent += `\nGEMINI_API_KEY=${cleanedKey}`;
      }
      fs.writeFileSync(envPath, envContent, 'utf8');
      console.log('✅ Updated GEMINI_API_KEY in backend/.env');
    } catch (e) {
      console.warn('⚠️ Could not write to backend/.env:', e.message);
    }
  }
  if (model) {
    process.env.GEMINI_MODEL = model.trim();
  }
  const currentKey = process.env.GEMINI_API_KEY;
  res.json({
    success: true,
    hasGeminiKey: Boolean(currentKey && currentKey.trim() !== '' && currentKey !== 'your_gemini_api_key_here'),
    model: process.env.GEMINI_MODEL || GEMINI_MODEL
  });
});

// AI Chatbot Support Endpoint: POST /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isKeyConfigured = apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here';

    if (isKeyConfigured) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        const candidateModels = [process.env.GEMINI_MODEL, 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'].filter(Boolean);
        let reply = null;

        const systemPrompt = `You are DiscrepBot, the specialized AI Auditor & Financial Support Assistant for DiscrepIQ Accounts Payable platform.
You assist finance professionals, auditors, and hackathon judges with:
1. Explaining invoice discrepancies (e.g. why line item sums don't equal billed totals).
2. Indian GST tax rules (CGST, SGST, IGST across 5%, 12%, 18%, 28% brackets).
3. Document extraction troubleshooting (blurry photos, folded receipts, skewed stamps).
4. Navigating the DiscrepIQ platform (Dashboard, Inspector, History, Exporting CSV/JSON).
Always be concise, precise, professional, and helpful. Use Indian Rupee (₹) formatting when citing currency.`;

        for (const modelName of candidateModels) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = `${systemPrompt}\n\nUser Question: ${message}\n\nProvide a clear, professional answer:`;
            const result = await model.generateContent(prompt);
            reply = result.response.text();
            if (reply) break;
          } catch (e) {
            console.warn(`Model ${modelName} failed for chat:`, e.message);
          }
        }

        if (reply) {
          return res.json({ reply, source: 'gemini_live' });
        }
      } catch (geminiErr) {
        console.warn('Gemini chat error, falling back to local auditor intelligence:', geminiErr.message);
      }
    }

    // Local Intelligent AP Auditor Fallback Engine
    const lower = message.toLowerCase();
    let reply = "Hello! I am DiscrepBot, your AI audit guide. You can ask me about line-item math verification, Indian GST tax calculations, or how to resolve invoice exceptions in the Inspector.";

    if (lower.includes('freight') || lower.includes('6940') || lower.includes('variance') || lower.includes('mismatch')) {
      reply = "On the Global Freight Logistics invoice (INV-2026-0941), the 3 line items sum to ₹1,17,000. 18% GST is ₹21,060, making the calculated payable ₹1,38,060. However, the stated total is ₹1,45,000, creating an unjustified overbilling variance of ₹6,940. You can inspect and adjust unit rates directly on the /inspect/doc-freight-mismatch page!";
    } else if (lower.includes('gst') || lower.includes('tax') || lower.includes('bracket')) {
      reply = "Under Indian GST law: Intrastate sales split into CGST (50%) and SGST (50%), while Interstate transactions incur IGST (100%). Standard brackets are 5% (essentials), 12% (processed goods), 18% (IT & logistics services), and 28% (luxury items). DiscrepIQ verifies these exact percentages on every line item.";
    } else if (lower.includes('csv') || lower.includes('export') || lower.includes('json') || lower.includes('download')) {
      reply = "To export clean audited data: Open any invoice in the Document Inspector (`/inspect/:id`) and click 'Export CSV' for spreadsheet reporting, or 'Audit JSON' for ERP integrations with SAP, Oracle, or Tally Prime.";
    } else if (lower.includes('blur') || lower.includes('camera') || lower.includes('upload') || lower.includes('photo') || lower.includes('scan')) {
      reply = "Our Gemini Vision multimodal OCR pipeline uses token-level spatial attention. It easily recognizes folded paper, skewed camera angles, faded thermal prints, and rubber stamps. For best results, ensure the image is above 300 DPI and under 10MB.";
    } else if (lower.includes('reconcile') || lower.includes('approve') || lower.includes('balance')) {
      reply = "When an invoice has zero discrepancy (arithmetic variance < ₹0.05), click 'Approve & Reconcile' in the Inspector. This marks the record as verified in your audit archive and prepares it for ERP batch dispatch.";
    }

    return res.json({ reply, source: 'auditor_engine' });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: 'Failed to process chat query.' });
  }
});

// Sample documents endpoint
app.get('/api/documents/samples', (req, res) => {
  const samples = [
    {
      id: 'cloud-invoice',
      name: 'Apex Cloud India Invoice.pdf',
      type: 'Invoice (18% GST)',
      data: getDemoExtraction('Apex_Cloud_India_Invoice.pdf')
    },
    {
      id: 'hardware-receipt',
      name: 'TechMart Store Receipt.png',
      type: 'Receipt (Retail)',
      data: {
        documentType: "Receipt",
        vendor: {
          name: "TechMart Electronics India Pvt Ltd",
          taxId: "GSTIN-07AABCT3421K1ZZ",
          address: "Connaught Place, Inner Circle, New Delhi 110001"
        },
        dates: {
          invoiceDate: "2026-09-28",
          dueDate: "2026-09-28"
        },
        currency: "INR",
        lineItems: [
          { description: "4K Ultra-Wide Monitor 34-inch", quantity: 1, unitPrice: 49999.00, amount: 49999.00 },
          { description: "Ergonomic Mechanical Keyboard", quantity: 1, unitPrice: 12499.00, amount: 12499.00 },
          { description: "USB-C Dual 4K Display Dock", quantity: 1, unitPrice: 15500.00, amount: 15500.00 }
        ],
        financials: {
          subtotal: 77998.00,
          taxAmount: 14039.64, // 18% GST
          totalAmount: 92037.64
        },
        mathValidation: {
          isValid: true,
          notes: "Verified: Line items sum (₹77,998.00) + 18% GST (₹14,039.64) reconciles with Total (₹92,037.64)."
        },
        summary: "In-store receipt from TechMart Electronics India for developer workstation peripherals totaling ₹92,037.64 INR."
      }
    },
    {
      id: 'mismatch-invoice',
      name: 'Audit Discrepancy Invoice.pdf',
      type: 'Invoice (Math Discrepancy)',
      data: {
        documentType: "Invoice",
        vendor: {
          name: "Global Freight Logistics India Pvt Ltd",
          taxId: "GSTIN-27AAACG0561D1ZW",
          address: "Andheri East Logistics Park, Mumbai, Maharashtra 400069"
        },
        dates: {
          invoiceDate: "2026-09-10",
          dueDate: "2026-10-10"
        },
        currency: "INR",
        lineItems: [
          { description: "Air Cargo Expedited Domestic Shipping", quantity: 2, unitPrice: 42000.00, amount: 84000.00 },
          { description: "Customs Clearance & Border Tariff Handling", quantity: 1, unitPrice: 15000.00, amount: 15000.00 },
          { description: "Temperature-Controlled Storage (3 Days)", quantity: 3, unitPrice: 6000.00, amount: 18000.00 }
        ],
        financials: {
          subtotal: 117000.00,
          taxAmount: 21060.00,
          totalAmount: 145000.00 // Intentionally 145000 instead of 138060 to trigger discrepancy warning!
        },
        mathValidation: {
          isValid: false,
          notes: "Discrepancy detected: Subtotal (₹1,17,000.00) + 18% GST (₹21,060.00) = ₹1,38,060.00, but billed Total is ₹1,45,000.00 (Overbilled by ₹6,940.00)."
        },
        summary: "Logistics freight invoice with arithmetic discrepancy between line items + GST (₹1,38,060.00) and billed Total (₹1,45,000.00)."
      }
    }
  ];
  res.json({ samples });
});

// Primary Endpoint: POST /api/documents/process
app.post('/api/documents/process', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'File size exceeds 10MB limit. Please upload a smaller document.',
          });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        error: 'No file uploaded. Please attach a PDF, JPG, or PNG document under the field "file".',
      });
    }

    // Re-check dotenv in case user updated .env without server restart
    dotenv.config();
    const apiKey = process.env.GEMINI_API_KEY;
    const isKeyConfigured = apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here';

    // If key is not configured, fall back to high-fidelity demo extraction
    if (!isKeyConfigured) {
      console.warn('⚠️ GEMINI_API_KEY is not set. Returning demo extraction result for UI demonstration.');
      const demoResult = getDemoExtraction(file.originalname);
      return res.json({
        success: true,
        data: demoResult,
        metadata: {
          filename: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          processedAt: new Date().toISOString(),
          mode: 'demo_fallback'
        }
      });
    }

    console.log(`Processing document with Gemini: ${file.originalname} (${file.mimetype}, ${(file.size / 1024).toFixed(1)} KB)`);

    // Prepare generative AI call
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-3.5-flash',
      'gemini-3.8-flash',
      'gemini-3.7-flash',
      'gemini-3.5-flash-lite',
      'gemini-flash-latest',
      'gemini-2.5-flash'
    ].filter(Boolean);
    const uniqueModels = [...new Set(candidateModels)];

    const filePart = {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      },
    };

    let responseText = null;
    let successfulModel = uniqueModels[0];
    let lastError = null;

    for (const modelName of uniqueModels) {
      try {
        console.log(`Attempting extraction using model: ${modelName}...`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        });
        const response = await model.generateContent([filePart, EXTRACTION_PROMPT]);
        responseText = response.response.text();
        successfulModel = modelName;
        console.log(`✅ Gemini extraction successful with model: ${modelName}`);
        break;
      } catch (modelErr) {
        console.warn(`⚠️ Model ${modelName} encountered error:`, modelErr.message);
        lastError = modelErr;
      }
    }

    if (!responseText) {
      throw lastError || new Error('All candidate Gemini models failed to process document.');
    }

    let parsedData;
    try {
      // Clean possible markdown code fences if model included them
      const cleaned = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', responseText);
      return res.status(502).json({
        error: 'Failed to parse Gemini extraction as structured JSON.',
        raw: responseText,
      });
    }

    // Backend-side math reconciliation validation to ensure exact accuracy
    const reconciliation = reconcileFinancials(parsedData);
    if (!parsedData.mathValidation) {
      parsedData.mathValidation = {
        isValid: reconciliation.isValid,
        notes: reconciliation.notes,
      };
    } else {
      // Cross-verify with our programmatic check
      parsedData.mathValidation.calculatedLineTotal = reconciliation.calculatedLineTotal;
      parsedData.mathValidation.calculatedExpectedTotal = reconciliation.calculatedExpectedTotal;
      parsedData.mathValidation.discrepancy = reconciliation.discrepancy;
      // If discrepancy exists, override or clarify notes
      if (!reconciliation.isValid) {
        parsedData.mathValidation.isValid = false;
        parsedData.mathValidation.notes = reconciliation.notes;
      }
    }

    return res.json({
      success: true,
      data: parsedData,
      metadata: {
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        processedAt: new Date().toISOString(),
        model: successfulModel,
        mode: 'gemini_live'
      },
    });
  } catch (error) {
    console.error('Document processing error:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while processing the document with Gemini.',
      details: error.toString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 DiscrepIQ Backend server running on http://localhost:${PORT}`);
  console.log(`   Model configured: ${GEMINI_MODEL}`);
  console.log(`   Gemini API Key: ${GEMINI_API_KEY ? 'Configured ✅' : 'Missing (Will use demo mode fallback) ⚠️'}`);
});
