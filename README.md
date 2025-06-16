# 🧭 SAM – Smart Assistant for Migrants

**SAM** is a multilingual AI assistant designed to support humanitarian organizations in serving displaced people and migrants more efficiently.

This cloud-based web application allows users to ask questions (via text or voice) and receive answers powered by AWS services such as Transcribe, Translate, and Amazon Bedrock (Claude). NGOs access a dedicated dashboard for real-time insights, moderation, and multilingual co-conversations.

---

## 🌍 Mission

To empower NGOs with smart tools that:
- Break language and literacy barriers.
- Automate repetitive communication and reporting tasks.
- Surface insights from the field to inform better decisions.

---

## ✨ Features

- 🎤 **Voice-to-Text**: Users can speak in their native language – auto-transcribed and translated.
- 🧠 **AI-Powered Q&A**: Smart assistant answers contextual questions based on custom knowledge bases.
- 🌐 **Multilingual Interface**: Text and audio input/output in dozens of supported languages.
- 📊 **NGO Dashboard**: Monitor usage, moderate content, and identify trends across conversations.
- 🗂️ **Conversation Summaries**: Generate meeting notes and structured reports for internal use.
- 🔒 **Hosted on AWS**: Scalable, secure, and GDPR-compliant infrastructure.


## 👥 Team
- Louis – Founder & Product Lead

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change. Let’s build something impactful together.

---

## 📄 License
MIT – Free to use for good causes. Please contact us for NGO deployments or partnerships.

---

## 🛠️ Tech Stack

!(public/sam_architecture.png)

- Frontend: Next.js (TypeScript, Tailwind CSS), AWS Amplify
- Backend: API Gateway, AWS Lambda 
- AI Services: Amazon Transcribe, Translate, Bedrock (Claude), RAG Faiss
- Storage: Amazon S3
- Auth: (TBD - AWS Cognito or custom)

---

## 🚀 Getting Started

> _This project is currently under active development. Contributions and feedback are welcome._

### Prerequisites

- Node.js 18+
- AWS CLI with programmatic access
- Access to Bedrock, Transcribe, Translate, and S3

### Setup

```bash
git clone https://github.com/your-org/sam.git
cd sam
npm install
