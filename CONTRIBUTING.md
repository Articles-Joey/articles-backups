# 🤝 Contributing to Articles Backups

Thanks for your interest in contributing to **Articles Backups**! We welcome thoughtful contributions that help improve functionality, performance, and user experience.

To ensure a smooth workflow for everyone, please read the following guidelines before submitting changes.

---

## 📌 Before You Start

### 🧠 Plan First, Code Second

If you're working on a **large feature or major change**, **please open an issue first** to discuss the idea with the maintainers and community. This prevents duplicate work and ensures your contribution aligns with the project vision.

We recommend using issues to:
- Propose new features or enhancements
- Discuss architectural changes
- Clarify design or implementation details

---

## 💻 Development Guidelines

### 🔃 Pull Request Scope

- Keep your pull requests **small and focused**. Each PR should ideally touch only one concern or area of the codebase.
- If your feature requires changes in multiple places, consider breaking it into smaller PRs or drafting a sequence.
- Add clear, descriptive commit messages.

### 📁 File Colocation

We are using the **App Router** from Next.js, which supports colocated components, styles, and logic. Please:
- Keep page-specific components in their respective route folders under `app/`.
- Use colocated `loading.tsx`, `error.tsx`, and `page.tsx` when relevant.
- Organize shared components under `components/` if reused across multiple routes.

### 🧪 Testing & Linting

- Ensure your code passes linting: `npm run lint`
- Add tests where applicable (coming soon).
- Manual test your feature or fix in the browser before submitting.

---

## ✅ Submitting Your Contribution

1. Fork the repo and create your branch from `main`.
2. Run `npm install` to install dependencies.
3. Make your changes.
4. Commit using clear and conventional messages.
5. Push your branch and open a pull request.
6. Add a summary of what your PR changes and link any related issues.

---

## 🙌 Code of Conduct

We are committed to a safe and welcoming environment. By contributing, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

Thanks again, and happy coding! 🧑‍💻
