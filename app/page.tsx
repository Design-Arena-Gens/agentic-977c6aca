'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const findPromos = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/find-promos', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.message);
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '50px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5em',
          color: '#333',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          🎯 Bons Plans Lyon
        </h1>

        <p style={{
          fontSize: '1.1em',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Découvrez les 5 meilleurs codes promo actuellement valides dans les grandes enseignes de Lyon
        </p>

        <button
          onClick={findPromos}
          disabled={loading}
          style={{
            background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '18px 40px',
            fontSize: '1.2em',
            borderRadius: '50px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
            width: '100%',
            marginBottom: '20px'
          }}
          onMouseOver={(e) => {
            if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {loading ? '🔍 Recherche en cours...' : '✨ Trouver les Bons Plans'}
        </button>

        {result && (
          <div style={{
            background: '#d4edda',
            border: '2px solid #c3e6cb',
            color: '#155724',
            padding: '20px',
            borderRadius: '10px',
            marginTop: '20px',
            textAlign: 'left'
          }}>
            <strong>✅ Succès!</strong>
            <p style={{ marginTop: '10px', marginBottom: 0 }}>{result}</p>
          </div>
        )}

        {error && (
          <div style={{
            background: '#f8d7da',
            border: '2px solid #f5c6cb',
            color: '#721c24',
            padding: '20px',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <strong>❌ Erreur:</strong>
            <p style={{ marginTop: '10px', marginBottom: 0 }}>{error}</p>
          </div>
        )}

        <p style={{
          fontSize: '0.9em',
          color: '#999',
          marginTop: '30px',
          borderTop: '1px solid #eee',
          paddingTop: '20px'
        }}>
          📧 Les résultats seront envoyés à <strong>maevapativa@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}
