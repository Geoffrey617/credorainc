// Generate static params for static export
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

export default function ApartmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
