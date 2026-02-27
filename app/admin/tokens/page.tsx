// app/admin/tokens/page.tsx
'use client';

import { useState, useEffect } from 'react';

// Definir la interfaz para los tokens
interface TokenInvitacion {
  id: number;
  token: string;
  email_destino: string | null;
  usado: boolean;
  usado_por: number | null;
  fecha_creacion: string;
  fecha_expiracion: string | null;
  nombre_usuario?: string;
}

export default function AdminTokensPage() {
  const [tokens, setTokens] = useState<TokenInvitacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const res = await fetch('/api/admin/tokens');
      const data = await res.json();
      setTokens(data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarTokens = async (cantidad: number) => {
    try {
      const res = await fetch('/api/admin/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad })
      });
      const nuevosTokens = await res.json();
      setTokens([...nuevosTokens, ...tokens]);
    } catch (error) {
      console.error('Error generating tokens:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d] p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center">Cargando tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#f0d9b5] mb-6 font-permanent">
          Administrar Tokens de Invitación
        </h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => generarTokens(1)}
            className="bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
          >
            Generar 1 Token
          </button>
          <button
            onClick={() => generarTokens(5)}
            className="bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
          >
            Generar 5 Tokens
          </button>
        </div>

        {tokens.length === 0 ? (
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-8 text-center">
            <p className="text-[#8b6f4c]">No hay tokens generados aún.</p>
            <p className="text-sm text-[#4a3a28] mt-2">Haz clic en "Generar Tokens" para crear los primeros.</p>
          </div>
        ) : (
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] overflow-hidden backdrop-blur-sm">
            <table className="w-full">
              <thead className="bg-[#2a2f33] border-b-2 border-[#8b6f4c]">
                <tr>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Token</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Estado</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Creado</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Expira</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Usado por</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => (
                  <tr key={token.id} className="border-b border-[#8b6f4c] hover:bg-[#2a2f33] transition-colors">
                    <td className="p-3 font-mono text-sm">{token.token}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs ${
                        token.usado 
                          ? 'bg-red-900/80 text-red-200 border border-red-700' 
                          : 'bg-green-900/80 text-green-200 border border-green-700'
                      }`}>
                        {token.usado ? 'Usado' : 'Disponible'}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(token.fecha_creacion).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm">
                      {token.fecha_expiracion 
                        ? new Date(token.fecha_expiracion).toLocaleDateString()
                        : 'Sin expiración'}
                    </td>
                    <td className="p-3 text-sm">
                      {token.nombre_usuario || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}