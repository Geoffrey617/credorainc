import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-200">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
          <p className="text-slate-600 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-sm hover:shadow-md inline-block"
          >
            Go Home
          </Link>
          <div className="text-sm text-slate-500">
            <Link href="/contact" className="text-slate-600 hover:text-slate-700 underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
