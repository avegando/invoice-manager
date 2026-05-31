# 🧾 Invoice Manager — Free & Open Source

![Invoice Manager](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

A **premium, dark-themed invoice management SPA** — runs entirely in the browser, zero backend required.

## ✨ Features

- 📊 **Dashboard** — live stats: total revenue, paid, pending, overdue
- 📋 **Invoice List** — filter by status, search by client, sort by any column
- ➕ **Create Invoices** — line items, VAT 19%, due dates, client details
- 🔍 **Invoice Detail** — beautiful print-ready view, status management
- 🔐 **Auth** — login with demo credentials
- 💾 **localStorage persistence** — data survives page reloads, no server needed
- 🎨 **Premium dark UI** — purple accent, Inter font, lucide-react icons
- 📱 **Fully responsive**

## 🚀 Quick Start

```bash
git clone https://github.com/avegando/invoice-manager
cd invoice-manager
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔑 Demo Login

| Field | Value |
|-------|-------|
| Email | `admin@demo.de` |
| Password | `admin123` |

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite 5 | Build tool |
| Tailwind CSS | Styling |
| lucide-react | Icons |
| react-router-dom v6 | Routing |
| localStorage | Data persistence |

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/      # Sidebar, AppLayout
│   └── UI/          # Button, Card, Input, Badge, ConfirmDialog
├── context/         # AuthContext, InvoiceContext
├── pages/           # Login, Dashboard, InvoiceList, InvoiceForm, InvoiceDetail
├── types/           # TypeScript interfaces
└── utils/           # storage.ts, seed.ts, format.ts
```

## 📸 Screenshots

> Dashboard with live revenue stats, dark premium design

## 📄 License

MIT — free to use, modify and distribute.

---

> Built with ❤️ by [avegando](https://github.com/avegando)
