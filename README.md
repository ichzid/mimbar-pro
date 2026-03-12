# Mimbar Pro

Mimbar Pro is a robust Software-as-a-Service (SaaS) application designed to effortlessly generate high-quality, personalized Islamic religious sermons using advanced AI.

## ✨ Features

- **Highly Customizable Sermons:** Tailor every sermon to your exact needs by specifying:
  - **Type of Sermon:** Khutbah Jumat (Friday sermon), Ramadan lectures, short reminders (kultum), or general gatherings.
  - **Tone & Style:** Choose the emotional resonance and delivery style of the speech.
  - **Language:** Extensive multi-language support.
  - **Title & Theme:** Set the core topic or focus of the sermon.
- **AI-Powered Generation:** Leverages advanced AI workflows and agents (via n8n) to craft coherent, inspiring, and contextually accurate sermon materials.
- **Modern & Fast User Interface:** Built for an optimal user experience with cutting-edge web technologies.

## 🚀 Technology Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/) 19
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4 & [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)
- **Icons & UI:** [Lucide React](https://lucide.dev/)
- **Markdown Rendering:** [React Markdown](https://github.com/remarkjs/react-markdown) for rich text sermon previews
- **Automation:** n8n (for AI agent orchestration)

## 🛠️ Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v20 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ichzid/mimbar-pro.git
   cd mimbar-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm start`: Runs the built app in production mode.
- `npm run lint`: Runs ESLint to catch errors in the code.

## 📄 License

This project is proprietary and confidential. All rights reserved.
