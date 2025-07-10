import { formatPrice, categories } from './utils.js';
import { db } from "./firebaseConfig.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";

function printWrappedText(doc, text, x, y, maxWidth, lineHeight = 5) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach(line => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

export async function generateStyledMenuPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Sort categories by order
  categories.sort((a, b) => (a.order || 999) - (b.order || 999));

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Bahn Thai Menu', 14, 20);

  let y = 30;

  // Fetch menu items ordered
  const q = query(collection(db, 'applebyline'), orderBy('order'));
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(d => d.data());

  // Group items by category
  const catMap = {};
  items.forEach(item => {
    if (!catMap[item.category]) catMap[item.category] = [];
    catMap[item.category].push(item);
  });

  for (const cat of categories) {
    const group = catMap[cat.key];
    if (!group) continue;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');  // added
    doc.setTextColor('orange');
    doc.text(cat.name, 14, y);
    doc.setLineWidth(0.5);
    doc.line(14, y + 2, 195, y + 2);
    y += 8;

    for (const item of group) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);

      // Options
      if (item.options) {
        for (const [opt, price] of Object.entries(item.options)) {
          doc.setTextColor(0, 128, 0);
          doc.text(opt, 16, y);
          doc.setTextColor(0);
          doc.text(formatPrice(price), 190, y, { align: 'right' });
          y += 7;
        }
      }

      // Single name + price
      else if (item.name) {
        doc.setTextColor(0, 128, 0);
        doc.text(item.name, 16, y);
        if (item.price) {
          doc.setTextColor(0);
          doc.text(formatPrice(item.price), 190, y, { align: 'right' });
        }
        y += 7;
      }

      // Choices
      if (item.choices) {
        doc.setFontSize(12);
        doc.setTextColor(0, 128, 0);
        doc.text('Choices:', 18, y);
        y += 5;

        for (const [choice, price] of Object.entries(item.choices)) {
          doc.text(`${choice}: ${formatPrice(price)}`, 18, y);
          y += 5;
        }
      }

      // Description
      if (item.description) {
        doc.setFontSize(10).setTextColor(100);
        doc.setFont('helvetica', 'italic');  // added
        y = printWrappedText(doc, item.description, 18, y, 170);
      }

      // Spacer after each item
      y += 4;
    }

    y += 6; // Spacer after category
  }

  const filename = `BahnThaiMenu_${Date.now()}.pdf`;
  doc.save(filename);
}
