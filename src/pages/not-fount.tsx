export default function NotFounPage() {
  return (
    <div className="h-svh font-mono dark:bg-[#1b1a19] flex items-center flex-col">
      <div className="flex-grow grid gap-2 place-content-center text-center">
        <h1 className="text-3xl font-medium">4O4 | Not Found</h1>
        <p className="text-xs opacity-60">
          The page you are looking for does not exist.
          <br />
          Please check the URL or go back to the{' '}
          <a href="/" className="underline">
            home page
          </a>
          .
        </p>
      </div>
      <footer className="pb-4 text-xs">
        Developed by{' '}
        <a
          href="https://daustinn.com"
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Daustinn
        </a>
      </footer>
    </div>
  )
}
