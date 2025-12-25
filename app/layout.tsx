export const metadata = {
  title: 'Lyon Promo Finder',
  description: 'Trouvez les meilleurs codes promo à Lyon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
