import fs from 'fs';
import path from 'path';

async function runDiagnostic() {
  console.log('====================================================');
  console.log('🔍 DiscrepIQ Backend Diagnostic Test');
  console.log('====================================================');
  console.log('Target Endpoint: POST http://localhost:5000/api/documents/process');
  console.log('Timestamp:      ', new Date().toISOString());

  // 1. Create a valid test image buffer (1x1 PNG or small test document)
  const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const fileBuffer = Buffer.from(base64Png, 'base64');
  const filename = 'diagnostic_test_receipt.png';

  console.log(`\n📦 Prepared test document: ${filename} (${fileBuffer.length} bytes, image/png)`);

  // 2. Prepare multipart form data
  const formData = new FormData();
  const fileBlob = new Blob([fileBuffer], { type: 'image/png' });
  formData.append('file', fileBlob, filename);

  const startTime = Date.now();

  try {
    console.log('🚀 Sending request to backend...');
    const response = await fetch('http://localhost:5000/api/documents/process', {
      method: 'POST',
      body: formData,
    });

    const elapsed = Date.now() - startTime;
    const statusCode = response.status;
    const statusText = response.statusText;

    console.log(`\n📡 HTTP Status Code: ${statusCode} ${statusText} (Response time: ${elapsed}ms)`);

    const responseBody = await response.json();

    if (!response.ok) {
      console.error('❌ Request failed with error:', responseBody);
      process.exit(1);
    }

    console.log('\n--- 📄 RAW RESPONSE JSON ---');
    console.log(JSON.stringify(responseBody, null, 2));

    // 3. Validate Gemini API JSON structure
    console.log('\n--- 🔬 DIAGNOSTIC CHECKS ---');
    const data = responseBody.data || {};
    const meta = responseBody.metadata || {};

    const checks = [
      { name: 'Response Success Flag', pass: responseBody.success === true },
      { name: 'Document Type Present', pass: Boolean(data.documentType) },
      { name: 'Vendor Object Present', pass: typeof data.vendor === 'object' },
      { name: 'Dates Object Present', pass: typeof data.dates === 'object' },
      { name: 'Line Items Array Present', pass: Array.isArray(data.lineItems) },
      { name: 'Financials Object Present', pass: typeof data.financials === 'object' },
      { name: 'Math Validation Object Present', pass: typeof data.mathValidation === 'object' },
      { name: 'Reconciliation Notes Present', pass: typeof data.mathValidation?.notes === 'string' },
      { name: 'Gemini Model Mode Verified', pass: Boolean(meta.mode) },
    ];

    checks.forEach(c => {
      console.log(`  ${c.pass ? '✅' : '❌'} ${c.name}`);
    });

    // 4. Test Math Reconciliation Logic
    console.log('\n--- 🧮 MATH RECONCILIATION AUDIT ---');
    const mv = data.mathValidation || {};
    console.log(`  Reconciliation Status: ${mv.isValid ? 'MATCH (Valid)' : 'DISCREPANCY (Warning)'}`);
    console.log(`  Audit Notes:           ${mv.notes || 'N/A'}`);
    console.log(`  Calculated Line Total: ${mv.calculatedLineTotal !== undefined ? mv.calculatedLineTotal : 'N/A'}`);
    console.log(`  Expected Total:        ${mv.calculatedExpectedTotal !== undefined ? mv.calculatedExpectedTotal : 'N/A'}`);
    console.log(`  Variance / Diff:       ${mv.discrepancy !== undefined ? mv.discrepancy : 0}`);

    console.log('\n====================================================');
    console.log('🎉 DIAGNOSTIC TEST COMPLETED SUCCESSFULLY');
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n❌ Diagnostic Test Failed:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
    process.exit(1);
  }
}

runDiagnostic();
