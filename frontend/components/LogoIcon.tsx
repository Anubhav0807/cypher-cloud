export default function LogoIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="9" fill="url(#lg)" />
      <path d="M21 6L12 20h7l-4 10 13-16h-8l4-8z" fill="white" />
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F72FF" />
          <stop offset="1" stopColor="#6C3FE8" />
        </linearGradient>
      </defs>
    </svg>
  );
}