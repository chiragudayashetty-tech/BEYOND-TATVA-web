# Shadcn/React Integration Guide

The current codebase is a flat HTML/CSS structure. It does not currently support React, TypeScript, or Tailwind CSS natively. To deploy the requested `HeroGeometric` React component, you will need to initialize a Next.js environment or a Vite React project.

Here are the step-by-step instructions to set up the project via the shadcn CLI with Tailwind and TypeScript:

## 1. Initialize a React Framework (Next.js)
Open your terminal and run the following command to create a new Next.js project with Tailwind CSS and TypeScript pre-configured:
```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint
cd my-app
```

## 2. Initialize Shadcn UI CLI
Run the shadcn CLI setup to configure the component paths:
```bash
npx shadcn@latest init
```

During the setup process, you will be prompted to define your paths. It is highly recommended to follow the standard structure:
- **Default component path:** `components`
- **Default UI path:** `components/ui`
- **lib/utils path:** `lib/utils`

### Why `components/ui` is Important
If the default path for UI components is not set to `components/ui`, you will break the standard convention of shadcn projects. Isolating base/reusable UI components inside `components/ui` keeps them separated from your domain-specific business logic and complex layout components (which reside in `components/`). This structure guarantees easier alias configurations (like `@/components/ui/`) and makes maintaining your expanding UI library straightforward and modular over time. 

## 3. Install Required NPM Dependencies
The `HeroGeometric` component relies on `framer-motion` for complex animations and `lucide-react` for SVG icons. Inside your initialized project directory, install them:

```bash
npm install framer-motion lucide-react clsx tailwind-merge
```
*(Note: `clsx` and `tailwind-merge` are typically installed automatically by shadcn to power the `cn` utility function in `lib/utils.ts`.)*

## 4. Copying the Components
I have already copied the requested components into your current `Website` workspace under a mock `components/ui` folder for your convenience. When you initialize your Next.js project, you can simply drag these over!
- The main component with **Beyond Tatva brand colors applied** is at: `./components/ui/shape-landing-hero.tsx`
- The demo component is at: `./components/demo.tsx`
