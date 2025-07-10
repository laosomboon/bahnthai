import { formatPrice, categories } from './utils.js';
import { db } from "./firebaseConfig.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";

export async function generateStyledMenuPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  categories.sort((a, b) => a.order - b.order);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Bahn Thai Menu', 14, 20);
  let y = 30;

  // ✅ Correct Firestore modular query
  const q = query(collection(db, 'applebyline'), orderBy('order'));
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(d => d.data());

  // Group by category
  const catMap = {};
  items.forEach(item => {
    (catMap[item.category] ||= []).push(item);
  });

  categories.forEach(cat => {
    const group = catMap[cat.key];
    if (!group) return;

    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0);
    doc.text(cat.name, 14, y);
    doc.setLineWidth(0.5);
    doc.line(14, y + 2, 195, y + 2);
    y += 8;

    group.forEach(item => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      if (item.options) {
        Object.entries(item.options).forEach(([opt, price]) => {
          doc.setTextColor(0, 128, 0);
          doc.text(opt, 16, y);
          doc.setTextColor(0);
          doc.text(formatPrice(price), 170, y, { align: 'right' });
          y += 7;
        });
      } else if (item.name) {
        doc.setTextColor(0, 128, 0);
        doc.text(item.name, 16, y);
        if (item.price) {
          doc.setTextColor(0);
          doc.text(formatPrice(item.price), 170, y, { align: 'right' });
        }
        y += 7;
      }

      if (item.choices) {
        doc.setFontSize(12);
        doc.setTextColor(0, 128, 0);
        doc.text('Choices:', 18, y);
        y += 5;
        Object.entries(item.choices).forEach(([choice, price]) => {
          doc.text(`${choice}: ${formatPrice(price)}`, 18, y);
          y += 5;
        });
      }

      if (item.description) {
        doc.setFontSize(10).setTextColor(100);
        const lines = doc.splitTextToSize(item.description, 170);
        lines.forEach(line => doc.text(line, 18, y));
        y += lines.length * 5;
      }

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;
  });

  const filename = `BahnThaiMenu_${Date.now()}.pdf`;
  doc.save(filename);
}
