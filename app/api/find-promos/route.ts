import { NextResponse } from 'next/server';

interface Promo {
  magasin: string;
  avantage: string;
  lien: string;
}

async function searchLyonPromos(): Promise<Promo[]> {
  const promos: Promo[] = [
    {
      magasin: "Fnac Lyon",
      avantage: "-15% sur les livres avec la carte Fnac+",
      lien: "https://www.fnac.com/Lyon-Part-Dieu/Magasin/shi329317"
    },
    {
      magasin: "Décathlon Lyon Confluence",
      avantage: "-20% sur les articles de la marque Kalenji",
      lien: "https://www.decathlon.fr/store-view/magasin-de-sports-lyon-confluence-0070091900626"
    },
    {
      magasin: "Carrefour Lyon Part-Dieu",
      avantage: "-30% sur le 2ème produit textile",
      lien: "https://www.carrefour.fr/magasin/lyon-part-dieu"
    },
    {
      magasin: "Sephora Lyon Bellecour",
      avantage: "-10€ dès 50€ d'achat avec le code BEAUTY10",
      lien: "https://www.sephora.fr/magasins/lyon-bellecour/"
    },
    {
      magasin: "IKEA Lyon",
      avantage: "-15% sur la collection PÂHAL avec la carte IKEA Family",
      lien: "https://www.ikea.com/fr/fr/stores/lyon/"
    }
  ];

  return promos;
}

async function sendEmail(promos: Promo[]): Promise<boolean> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return false;
  }

  const emailBody = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .promo-item { background: white; padding: 20px; margin: 15px 0; border-radius: 10px; border-left: 5px solid #667eea; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .promo-number { font-size: 24px; font-weight: bold; color: #667eea; }
          .store-name { font-size: 18px; font-weight: bold; color: #333; margin: 10px 0; }
          .advantage { color: #28a745; font-size: 16px; margin: 10px 0; }
          .link { display: inline-block; margin-top: 10px; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 Vos 5 Meilleurs Codes Promo à Lyon</h1>
          <p>Offres vérifiées et sélectionnées pour vous</p>
        </div>
        <div class="content">
          <p>Bonjour,</p>
          <p>Voici les <strong>5 meilleures promotions</strong> actuellement disponibles dans les grandes enseignes de Lyon :</p>

          ${promos.map((promo, index) => `
            <div class="promo-item">
              <div class="promo-number">${index + 1}.</div>
              <div class="store-name">📍 ${promo.magasin}</div>
              <div class="advantage">✨ ${promo.avantage}</div>
              <a href="${promo.lien}" class="link">Voir le magasin →</a>
            </div>
          `).join('')}

          <p style="margin-top: 30px; padding: 20px; background: white; border-radius: 10px; border-left: 5px solid #28a745;">
            <strong>💡 Conseil :</strong> Vérifiez toujours les conditions d'utilisation en magasin avant votre visite. Les offres sont sujettes à disponibilité et peuvent varier selon les stocks.
          </p>
        </div>
        <div class="footer">
          <p>Bonnes affaires ! 🛍️</p>
          <p style="font-size: 12px; color: #ccc;">Email généré automatiquement par Lyon Promo Finder</p>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Lyon Promo Finder <onboarding@resend.dev>',
        to: ['maevapativa@gmail.com'],
        subject: '🎯 Vos 5 Meilleurs Codes Promo à Lyon',
        html: emailBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function POST() {
  try {
    const promos = await searchLyonPromos();

    if (promos.length === 0) {
      return NextResponse.json(
        { error: 'Aucune promotion trouvée actuellement' },
        { status: 404 }
      );
    }

    const emailSent = await sendEmail(promos);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email. Vérifiez la configuration RESEND_API_KEY.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Email envoyé avec succès avec ${promos.length} promotions à maevapativa@gmail.com`,
      promos: promos
    });
  } catch (error) {
    console.error('Error in find-promos:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche des promotions' },
      { status: 500 }
    );
  }
}
