# MVA Standard TortX

A React application for personal injury claims qualification and evaluation. This web application helps users determine if they qualify for a personal injury case and connects them with legal professionals.

## Features

- Multi-step qualification form with conditional logic
- Real-time form validation
- Accessible UI components
- Mobile-responsive design
- Error boundary implementation for fault tolerance
- Form submissions with CSRF protection
- Offline detection and notification

## Tech Stack

- React 18
- TailwindCSS
- Framer Motion for animations
- React Error Boundary
- Jest & React Testing Library

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/mva-standard-tortx.git
   cd mva-standard-tortx
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production to the `build` folder
- `npm run lint` - Runs ESLint to check for code issues
- `npm run format` - Formats code using Prettier

## Project Structure

```
├── public/             # Static files
├── src/                # Source code
│   ├── components/     # React components
│   │   ├── ContactForm.jsx
│   │   ├── QualificationForm.jsx
│   │   └── ... 
│   ├── App.jsx         # Main application component
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## Form Features

### Qualification Form

The multi-step qualification form guides users through a series of questions to determine if they qualify for a personal injury case. Key features include:

- Progressive disclosure of questions
- Conditional follow-up questions based on previous answers
- Date validation for accident and medical treatment dates
- Early disqualification for certain answers
- Insurance coverage selection

### Contact Form

The contact form collects information from qualified applicants. Features include:

- Real-time validation
- Accessible error messages
- Phone number auto-formatting
- Preferred contact method selection
- Form submission error handling

## Accessibility Features

This application follows WCAG 2.1 guidelines for accessibility:

- ARIA attributes for screen readers
- Keyboard navigation support
- Color contrast compliance
- Form validation error announcements
- Focus management

## Browser Support

The application supports all modern browsers including:

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TailwindCSS for utility-first CSS
- Framer Motion for animations
- React team for React 18 features
