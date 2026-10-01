# DiscrepIQ ⚖️
### Intelligent Multimodal Document Processing & Financial Discrepancy Auditor

DiscrepIQ is an AI-powered document processing platform engineered for automated invoice, receipt, and purchase order auditing. Powered by **Google Gemini 3.5 Flash**, DiscrepIQ extracts structured entities, verifies mathematical reconciliation across line items and taxes, flags arithmetic discrepancies, and enables real-time edits and JSON/CSV exports.

---

## 🌟 Key Features

- **Multimodal Zero-Shot Extraction**: Upload PDF, JPG, PNG, or WebP documents up to 10MB. Gemini extracts line items, quantities, unit prices, tax amounts, vendor details, and billing dates.
- **Arithmetic Reconciliation Engine**: Compares $\sum(\text{Line Items}) + \text{Tax}$ against the stated Billed Total to detect arithmetic variance, overbilling, and rounding discrepancies.
- **Dynamic Interactive Table**: Real-time editable grid where adjustments to quantities, prices, or line amounts instantly re-run the mathematical reconciliation audit live.
- **Instant Audit Test Scenarios**: 1-click test suite including:
  - *Apex Cloud Services Invoice*: 100% Balanced valid invoice.
  - *TechMart Store Receipt*: Valid retail receipt.
  - *Audit Discrepancy Invoice*: Arithmetic mismatch invoice with €46 variance to test discrepancy alerting.
- **Multi-Format Export**: Export verified audit data as structured **JSON** or tabular **CSV** spreadsheets, or print formatted audit summaries.
- **Dynamic Key & Model Switcher**: In-browser API key configuration with live connectivity testing (`gemini-3.5-flash`, `gemini-3.8-flash`, etc.).

---

## 🚀 Getting Started

### 1. Backend Server
```bash
cd backend
npm install
npm run dev
```
Runs at `http://localhost:5000`.

### 2. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.
