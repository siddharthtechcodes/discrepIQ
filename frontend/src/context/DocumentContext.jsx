import React, { createContext, useContext, useState, useEffect } from 'react';

const DocumentContext = createContext(null);

const STORAGE_KEY = 'discrepiq_audit_documents';

const INITIAL_DOCS = [
  {
    id: 'test-1-coffee',
    name: 'Blue_Tokai_Coffee_Receipt.pdf',
    presetLabel: 'Test 1: Valid Coffee Receipt (Clean)',
    vendor: 'Blue Tokai Coffee Roasters',
    gstin: 'GSTIN-07AAACB1294F1Z8',
    invoiceNumber: 'BT-DL-8821',
    invoiceDate: '2026-09-29',
    dueDate: '2026-09-29',
    currency: 'INR',
    subtotal: 1610.00,
    taxTotal: 80.50,
    statedTotal: 1690.50,
    calculatedTotal: 1690.50,
    discrepancy: 0.00,
    status: 'verified',
    reconciled: true,
    timestamp: '2026-09-29 09:30 AM',
    fileSize: '185 KB',
    engine: 'Gemini 3.5 Flash',
    complianceReport: {
      status: 'COMPLIANT',
      violations: []
    },
    forensicAnalysis: {
      integrityScore: 98,
      riskLevel: 'LOW',
      tamperingDetected: false,
      anomalies: []
    },
    lineItems: [
      { id: 'item-1', description: 'Specialty Roasted Espresso Beans (500g)', quantity: 1, unitPrice: 750.00, taxRate: 5, total: 750.00 },
      { id: 'item-2', description: 'Cold Brew Roast Bottle (Pack of 2)', quantity: 1, unitPrice: 420.00, taxRate: 5, total: 420.00 },
      { id: 'item-3', description: 'Artisanal Butter Almond Croissant', quantity: 2, unitPrice: 220.00, taxRate: 5, total: 440.00 }
    ],
    taxBreakdown: { cgst: 40.25, sgst: 40.25, igst: 0.00 },
    notes: 'Clean receipt for corporate breakfast. Zero mathematical variance and 100% PolicyGuard compliant.'
  },
  {
    id: 'test-2-alcohol',
    name: 'The_Oberoi_SkyLounge_Bill.pdf',
    presetLabel: 'Test 2: Restaurant Bill (Alcohol Violation Caught)',
    vendor: 'The Oberoi Sky Lounge & Bar',
    gstin: 'GSTIN-27AAATB4912J1ZR',
    invoiceNumber: 'OBR-MUM-491',
    invoiceDate: '2026-09-27', // Sunday
    dueDate: '2026-09-27',
    currency: 'INR',
    subtotal: 9610.00,
    taxTotal: 1729.80,
    statedTotal: 11339.80,
    calculatedTotal: 11339.80,
    discrepancy: 0.00,
    status: 'flagged_compliance',
    reconciled: false,
    timestamp: '2026-09-27 10:45 PM',
    fileSize: '320 KB',
    engine: 'Gemini 3.5 Flash',
    complianceReport: {
      status: 'FLAGGED',
      violations: [
        {
          rule: 'ALCOHOL_RESTRICTION',
          item: 'Glenfiddich 18yr Single Malt Scotch Whisky',
          reason: 'Restricted beverage/substance ("WHISKY") detected. Corporate expense policy strictly prohibits alcohol reimbursement.'
        },
        {
          rule: 'PER_DIEM_CAP',
          item: 'Glenfiddich 18yr Single Malt Scotch Whisky',
          reason: 'Single item cost (₹4,800.00) exceeds corporate per-diem cap of ₹4,000 ($50 USD equivalent). Requires VP exception authorization.'
        },
        {
          rule: 'WEEKEND_EXPENSE',
          item: 'Transaction Date: 2026-09-27',
          reason: 'Expense was incurred on a weekend (Sunday). Weekend business dining requires pre-approved client project code.'
        }
      ]
    },
    forensicAnalysis: {
      integrityScore: 94,
      riskLevel: 'LOW',
      tamperingDetected: false,
      anomalies: []
    },
    lineItems: [
      { id: 'item-1', description: 'Wild Mushroom & Truffle Risotto', quantity: 1, unitPrice: 1650.00, taxRate: 18, total: 1650.00 },
      { id: 'item-2', description: 'Norwegian Grilled Salmon Fillet', quantity: 1, unitPrice: 2400.00, taxRate: 18, total: 2400.00 },
      { id: 'item-3', description: 'Glenfiddich 18yr Single Malt Scotch Whisky', quantity: 1, unitPrice: 4800.00, taxRate: 18, total: 4800.00 },
      { id: 'item-4', description: 'San Pellegrino Sparkling Water (750ml)', quantity: 2, unitPrice: 380.00, taxRate: 18, total: 760.00 }
    ],
    taxBreakdown: { cgst: 864.90, sgst: 864.90, igst: 0.00 },
    notes: 'PolicyGuard Warning: 3 compliance infractions detected including prohibited liquor and weekend non-business hours.'
  },
  {
    id: 'test-3-contractor',
    name: 'Apex_Contractor_Tech_Services.pdf',
    presetLabel: 'Test 3: Contractor Invoice (Math Discrepancy Caught)',
    vendor: 'Apex Engineering & Cloud Contractors Pvt Ltd',
    gstin: 'GSTIN-29AAACE4910M1ZU',
    invoiceNumber: 'APX-2026-884',
    invoiceDate: '2026-09-22',
    dueDate: '2026-10-22',
    currency: 'INR',
    subtotal: 170000.00,
    taxTotal: 30600.00,
    statedTotal: 218000.00, // Should be 200600
    calculatedTotal: 200600.00,
    discrepancy: 17400.00,
    status: 'discrepancy',
    reconciled: false,
    timestamp: '2026-09-22 02:15 PM',
    fileSize: '410 KB',
    engine: 'Gemini 3.5 Flash',
    complianceReport: {
      status: 'COMPLIANT',
      violations: []
    },
    forensicAnalysis: {
      integrityScore: 91,
      riskLevel: 'LOW',
      tamperingDetected: false,
      anomalies: []
    },
    lineItems: [
      { id: 'item-1', description: 'Lead Cloud Infrastructure Architect (40 Hours)', quantity: 40, unitPrice: 2500.00, taxRate: 18, total: 100000.00 },
      { id: 'item-2', description: 'Kubernetes Zero-Trust Security Hardening', quantity: 1, unitPrice: 45000.00, taxRate: 18, total: 45000.00 },
      { id: 'item-3', description: 'CI/CD Production Deployment Pipeline', quantity: 1, unitPrice: 25000.00, taxRate: 18, total: 25000.00 }
    ],
    taxBreakdown: { cgst: 0.00, sgst: 0.00, igst: 30600.00 },
    notes: 'Math Discrepancy: Subtotal (₹1,70,000) + 18% GST (₹30,600) = ₹2,00,600.00, but invoice billed ₹2,18,000.00 (Overbilled by ₹17,400.00).'
  },
  {
    id: 'demo-4-tampering',
    name: 'Altered_Vendor_Invoice_Forged.pdf',
    presetLabel: 'Demo 4: Altered Invoice (Tampering Caught)',
    vendor: 'Global Freight Logistics India Pvt Ltd',
    gstin: 'GSTIN-27AAACG0561D1ZW',
    invoiceNumber: 'INV-2026-FORGED',
    invoiceDate: '2026-09-18',
    dueDate: '2026-10-18',
    currency: 'INR',
    subtotal: 117000.00,
    taxTotal: 21060.00,
    statedTotal: 345000.00, // Digit '3' spliced over '1'
    calculatedTotal: 138060.00,
    discrepancy: 206940.00,
    status: 'tampered',
    reconciled: false,
    timestamp: '2026-09-18 11:10 AM',
    fileSize: '512 KB',
    engine: 'Gemini 3.5 Flash',
    complianceReport: {
      status: 'COMPLIANT',
      violations: []
    },
    forensicAnalysis: {
      integrityScore: 32,
      riskLevel: 'HIGH',
      tamperingDetected: true,
      anomalies: [
        {
          type: 'FONT_MISMATCH',
          targetArea: 'Grand Total Box (Row 14, Col 4)',
          description: 'Font rasterization mismatch: Numeric glyph "3" has 1.8x pixel edge sharpness compared to adjacent OCR text.'
        },
        {
          type: 'PIXEL_ARTIFACT',
          targetArea: 'Invoice Total Bounding Rectangle',
          description: 'JPEG double-compression ghosts detected around stated total. Luminance gradient discontinuities confirm pixel splicing.'
        },
        {
          type: 'SUSPICIOUS_ALIGNMENT',
          targetArea: 'Currency Symbol Baseline',
          description: 'Currency prefix baseline sits 4.2 pixels lower than the numeric string, indicating digital text box insertion.'
        }
      ]
    },
    lineItems: [
      { id: 'item-1', description: 'Air Freight Domestic Cargo Container (2x)', quantity: 2, unitPrice: 45000.00, taxRate: 18, total: 90000.00 },
      { id: 'item-2', description: 'Priority Customs Handling & Documentation', quantity: 1, unitPrice: 15000.00, taxRate: 18, total: 15000.00 },
      { id: 'item-3', description: 'Cold Chain Pharma Express Storage', quantity: 1, unitPrice: 12000.00, taxRate: 18, total: 12000.00 }
    ],
    taxBreakdown: { cgst: 10530.00, sgst: 10530.00, igst: 0.00 },
    notes: '🚨 Tampering Alert: Visual Inconsistencies Detected in Grand Total. Digit alteration and JPEG pixel splicing verified by TamperShield.'
  },
  {
    id: 'doc-freight-mismatch',
    name: 'Freight_Logistics_Tax_Invoice.pdf',
    presetLabel: 'Freight Logistics Variance (+₹6,940)',
    vendor: 'Global Freight Logistics India Pvt Ltd',
    gstin: 'GSTIN-27AAACG0561D1ZW',
    invoiceNumber: 'INV-2026-0941',
    invoiceDate: '2026-10-01',
    dueDate: '2026-10-31',
    currency: 'INR',
    subtotal: 117000.00,
    taxTotal: 21060.00,
    statedTotal: 145000.00, // Stated 145000 vs 138060
    calculatedTotal: 138060.00,
    discrepancy: 6940.00,
    status: 'discrepancy',
    reconciled: false,
    timestamp: '2026-10-01 10:48 AM',
    fileSize: '480 KB',
    engine: 'Gemini 3.5 Flash',
    complianceReport: {
      status: 'COMPLIANT',
      violations: []
    },
    forensicAnalysis: {
      integrityScore: 89,
      riskLevel: 'LOW',
      tamperingDetected: false,
      anomalies: []
    },
    lineItems: [
      { id: 'item-1', description: 'Priority Interstate Air Freight (2x Containers)', quantity: 2, unitPrice: 45000.00, taxRate: 18, total: 90000.00 },
      { id: 'item-2', description: 'Cold Chain Pharmaceutical Storage Unit', quantity: 1, unitPrice: 15000.00, taxRate: 18, total: 15000.00 },
      { id: 'item-3', description: 'Customs Handling, Quarantine & Toll Documentation', quantity: 1, unitPrice: 12000.00, taxRate: 18, total: 12000.00 }
    ],
    taxBreakdown: { cgst: 10530.00, sgst: 10530.00, igst: 0.00 },
    notes: 'Reconciliation Warning: Line items sum is ₹1,17,000.00. Subtotal (₹1,17,000.00) + 18% GST (₹21,060.00) = ₹1,38,060.00, but document Total is ₹1,45,000.00 (Discrepancy: ₹6,940.00).'
  },
  {
    id: 'doc-cloud-reconciled',
    name: 'Apex_Cloud_India_Services.pdf',
    presetLabel: 'Apex Cloud Reconciled (₹3,00,900)',
    vendor: 'Apex Cloud Technologies India Pvt Ltd',
    gstin: 'GSTIN-29AABCU9603R1ZM',
    invoiceNumber: 'INV-2026-0940',
    invoiceDate: '2026-10-01',
    dueDate: '2026-10-31',
    currency: 'INR',
    subtotal: 255000.00,
    taxTotal: 45900.00,
    statedTotal: 300900.00,
    calculatedTotal: 300900.00,
    discrepancy: 0.00,
    status: 'verified',
    reconciled: true,
    timestamp: '2026-10-01 09:15 AM',
    fileSize: '360 KB',
    engine: 'Gemini 3.5 Flash',
    complianceReport: {
      status: 'COMPLIANT',
      violations: []
    },
    forensicAnalysis: {
      integrityScore: 99,
      riskLevel: 'LOW',
      tamperingDetected: false,
      anomalies: []
    },
    lineItems: [
      { id: 'item-1', description: 'Enterprise Cloud Hosting - Kubernetes Cluster (3 Nodes)', quantity: 1, unitPrice: 125000.00, taxRate: 18, total: 125000.00 },
      { id: 'item-2', description: 'Dedicated AI Inference Endpoint (GPU L4 x 2)', quantity: 2, unitPrice: 45000.00, taxRate: 18, total: 90000.00 },
      { id: 'item-3', description: 'Managed PostgreSQL High Availability Database', quantity: 1, unitPrice: 28000.00, taxRate: 18, total: 28000.00 },
      { id: 'item-4', description: 'Edge CDN & DDoS Protection Shield', quantity: 1, unitPrice: 12000.00, taxRate: 18, total: 12000.00 }
    ],
    taxBreakdown: { cgst: 22950.00, sgst: 22950.00, igst: 0.00 },
    notes: 'Verified: Line items sum (₹2,55,000.00) + 18% GST (₹45,900.00) reconciles with Total (₹3,00,900.00).'
  },
  {
    id: 'doc-receipt-reconciled',
    name: 'TechMart_Store_Receipt.png',
    presetLabel: 'TechMart Store Receipt (₹92,038.82)',
    vendor: 'TechMart Electronics India Pvt Ltd',
    gstin: 'GSTIN-07AABCT3421K1ZZ',
    invoiceNumber: 'TM-DEL-3421',
    invoiceDate: '2026-09-30',
    dueDate: '2026-09-30',
    currency: 'INR',
    subtotal: 77999.00,
    taxTotal: 14039.82,
    statedTotal: 92038.82,
    calculatedTotal: 92038.82,
    discrepancy: 0.00,
    status: 'verified',
    reconciled: true,
    timestamp: '2026-09-30 04:30 PM',
    fileSize: '210 KB',
    engine: 'Gemini 3.5 Flash',
    complianceReport: {
      status: 'COMPLIANT',
      violations: []
    },
    forensicAnalysis: {
      integrityScore: 97,
      riskLevel: 'LOW',
      tamperingDetected: false,
      anomalies: []
    },
    lineItems: [
      { id: 'item-1', description: 'Ultra-Wide 34-Inch Developer Monitor', quantity: 1, unitPrice: 42999.00, taxRate: 18, total: 42999.00 },
      { id: 'item-2', description: 'Ergonomic Mechanical Keyboard & Precision Mouse', quantity: 2, unitPrice: 12500.00, taxRate: 18, total: 25000.00 },
      { id: 'item-3', description: 'Thunderbolt 4 High-Speed Multiport Dock', quantity: 1, unitPrice: 10000.00, taxRate: 18, total: 10000.00 }
    ],
    taxBreakdown: { cgst: 7019.91, sgst: 7019.91, igst: 0.00 },
    notes: 'Verified: Hardware procurement receipt fully balanced with zero discrepancy.'
  }
];


export function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any newly introduced INITIAL_DOCS that might be missing from cached storage
          const existingIds = new Set(parsed.map(d => d.id));
          const missingInitial = INITIAL_DOCS.filter(d => !existingIds.has(d.id));
          return [...parsed, ...missingInitial];
        }
      }
    } catch (e) {
      console.error('Failed to load documents from storage:', e);
    }
    return INITIAL_DOCS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to persist documents:', e);
    }
  }, [documents]);

  const addDocument = (doc) => {
    setDocuments(prev => [doc, ...prev]);
    return doc.id;
  };

  const getDocument = (id) => {
    if (!id) return documents[0] || INITIAL_DOCS[0];
    
    // 1. Direct match in active state
    let found = documents.find(d => d.id === id);
    
    // 2. Direct match in INITIAL_DOCS
    if (!found) {
      found = INITIAL_DOCS.find(d => d.id === id);
    }
    
    // 3. Substring / Alias matching
    if (!found) {
      const lowerId = id.toLowerCase();
      if (lowerId.includes('freight')) {
        found = documents.find(d => d.id.includes('freight')) || INITIAL_DOCS.find(d => d.id.includes('freight'));
      } else if (lowerId.includes('cloud')) {
        found = documents.find(d => d.id.includes('cloud')) || INITIAL_DOCS.find(d => d.id.includes('cloud'));
      } else if (lowerId.includes('receipt') || lowerId.includes('coffee')) {
        found = documents.find(d => d.id.includes('receipt') || d.id.includes('coffee')) || INITIAL_DOCS[0];
      } else if (lowerId.includes('contractor')) {
        found = documents.find(d => d.id.includes('contractor')) || INITIAL_DOCS[2];
      } else if (lowerId.includes('alcohol') || lowerId.includes('oberoi')) {
        found = documents.find(d => d.id.includes('alcohol')) || INITIAL_DOCS[1];
      } else if (lowerId.includes('tamper') || lowerId.includes('forged')) {
        found = documents.find(d => d.id.includes('tamper')) || INITIAL_DOCS[3];
      }
    }

    // 4. Guaranteed non-null fallback to prevent any blank page
    return found || documents[0] || INITIAL_DOCS[0];
  };

  const updateDocument = (id, updates) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        const updated = { ...doc, ...updates };
        // Recalculate math if line items or stated total were modified
        if (updates.lineItems || updates.statedTotal !== undefined) {
          const items = updated.lineItems || [];
          const calculatedSubtotal = items.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
          const taxSum = items.reduce((acc, item) => {
            const rate = Number(item.taxRate) || 18;
            return acc + ((Number(item.total) || 0) * (rate / 100));
          }, 0);
          const calculatedTotal = calculatedSubtotal + taxSum;
          const diff = Math.abs(calculatedTotal - (Number(updated.statedTotal) || 0));
          
          updated.subtotal = calculatedSubtotal;
          updated.taxTotal = taxSum;
          updated.calculatedTotal = calculatedTotal;
          updated.discrepancy = Number(diff.toFixed(2));
          updated.status = diff < 0.05 ? 'verified' : 'discrepancy';
        }
        return updated;
      }
      return doc;
    }));
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const stats = {
    totalProcessed: documents.length,
    verifiedCount: documents.filter(d => d.status === 'verified' || d.reconciled).length,
    discrepancyCount: documents.filter(d => d.status === 'discrepancy' && !d.reconciled).length,
    totalVarianceRupees: documents.reduce((sum, d) => sum + (d.discrepancy || 0), 0)
  };

  return (
    <DocumentContext.Provider value={{ documents, addDocument, getDocument, updateDocument, deleteDocument, stats }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
