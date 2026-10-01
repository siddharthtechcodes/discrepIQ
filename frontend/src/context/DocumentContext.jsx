import React, { createContext, useContext, useState, useEffect } from 'react';

const DocumentContext = createContext(null);

const STORAGE_KEY = 'discrepiq_audit_documents';

const INITIAL_DOCS = [
  {
    id: 'doc-freight-mismatch',
    name: 'Freight_Logistics_Tax_Invoice_0941.pdf',
    vendor: 'Global Freight Logistics India Pvt Ltd',
    gstin: 'GSTIN-27AAACG0561D1ZW',
    invoiceNumber: 'INV-2026-0941',
    invoiceDate: '2026-10-01',
    dueDate: '2026-10-15',
    currency: 'INR',
    subtotal: 117000.00,
    taxTotal: 21060.00,
    statedTotal: 145000.00,
    calculatedTotal: 138060.00,
    discrepancy: 6940.00,
    status: 'discrepancy', // 'discrepancy' | 'verified'
    reconciled: false,
    timestamp: '2026-10-01 10:48 AM',
    fileSize: '412 KB',
    engine: 'Gemini 3.5 Flash',
    lineItems: [
      { id: 'item-1', description: 'Air Freight Dedicated Container Mumbai-Delhi', quantity: 2, unitPrice: 45000.00, taxRate: 18, total: 90000.00 },
      { id: 'item-2', description: 'Priority Customs Clearance & Documentation Handling', quantity: 1, unitPrice: 15000.00, taxRate: 18, total: 15000.00 },
      { id: 'item-3', description: 'Cold Chain Pharma Express Storage Surcharge', quantity: 1, unitPrice: 12000.00, taxRate: 18, total: 12000.00 }
    ],
    taxBreakdown: {
      cgst: 10530.00,
      sgst: 10530.00,
      igst: 0.00
    },
    notes: 'Line item sum (₹1,17,000) + 18% GST (₹21,060) equals ₹1,38,060. Vendor stated ₹1,45,000, creating an unjustified overbilling variance of ₹6,940.00.'
  },
  {
    id: 'doc-cloud-reconciled',
    name: 'Apex_Cloud_Infrastructure_Monthly.pdf',
    vendor: 'Apex Cloud Technologies India Pvt Ltd',
    gstin: 'GSTIN-29AABCU9603R1ZM',
    invoiceNumber: 'APX-IND-8820',
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
    fileSize: '298 KB',
    engine: 'Gemini 3.5 Flash',
    lineItems: [
      { id: 'item-1', description: 'Kubernetes Dedicated Enterprise Worker Nodes (4x)', quantity: 4, unitPrice: 45000.00, taxRate: 18, total: 180000.00 },
      { id: 'item-2', description: 'High-Throughput NVMe Object Storage Volume (50TB)', quantity: 1, unitPrice: 55000.00, taxRate: 18, total: 55000.00 },
      { id: 'item-3', description: 'Virtual Private Cloud Multi-AZ NAT Gateways', quantity: 2, unitPrice: 10000.00, taxRate: 18, total: 20000.00 }
    ],
    taxBreakdown: {
      cgst: 0.00,
      sgst: 0.00,
      igst: 45900.00
    },
    notes: 'Mathematical parity verified. Line items sum perfectly to ₹2,55,000.00 and 18% IGST ₹45,900.00 matches stated total ₹3,00,900.00.'
  },
  {
    id: 'doc-receipt-reconciled',
    name: 'TechMart_Workstation_Receipt.jpg',
    vendor: 'TechMart Electronics India Pvt Ltd',
    gstin: 'GSTIN-07AABCT3421K1ZZ',
    invoiceNumber: 'TM-DEL-44120',
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
    fileSize: '1.2 MB',
    engine: 'Gemini 3.5 Flash',
    lineItems: [
      { id: 'item-1', description: 'Dell UltraSharp 27" 4K IPS USB-C Monitor', quantity: 2, unitPrice: 28500.00, taxRate: 18, total: 57000.00 },
      { id: 'item-2', description: 'Logitech MX Master 3S Wireless Ergonomic Mouse', quantity: 2, unitPrice: 7999.00, taxRate: 18, total: 15998.00 },
      { id: 'item-3', description: 'Anker Prime 100W GaN Wall Charging Station', quantity: 1, unitPrice: 5001.00, taxRate: 18, total: 5001.00 }
    ],
    taxBreakdown: {
      cgst: 7019.91,
      sgst: 7019.91,
      igst: 0.00
    },
    notes: 'Store POS receipt extracted cleanly from mobile camera capture. Zero arithmetic variance.'
  }
];

export function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
    return documents.find(d => d.id === id) || null;
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
