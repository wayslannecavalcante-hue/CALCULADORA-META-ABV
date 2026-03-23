import React, { useState, useMemo } from 'react';

// Tipagem para os dados do consultor
interface ConsultorData {
  id: number;
  nome: string;
  meta: number;
  realizado: number;
}

// Dados iniciais baseados na imagem
const dadosIniciais: ConsultorData[] = [
  { id: 1, nome: 'Micalea', meta: 15, realizado: 11 },
  { id: 2, nome: 'Thalys', meta: 15, realizado: 11 },
  { id: 3, nome: 'Luana', meta: 22, realizado: 15 },
  { id: 4, nome: 'Izabela', meta: 15, realizado: 9 },
  { id: 5, nome: 'Jessica', meta: 15, realizado: 7 },
  { id: 6, nome: 'Victoria', meta: 20, realizado: 8 },
  { id: 7, nome: 'Bruno', meta: 10, realizado: 4 },
  { id: 8, nome: 'André', meta: 20, realizado: 7 },
];

// Paleta de cores da ABV
const coresABV = {
  azulEscuro: '#1c2b78', // Cor do cabeçalho da imagem original
  teal: '#1d6b87',       // Azul/Verde da logo (usado para Alto Desempenho)
  amarelo: '#d99b38',    // Amarelo da logo (usado para Médio Desempenho)
  vermelho: '#c94f53',   // Vermelho da logo (usado para Baixo Desempenho)
};

export default function App() {
  const [consultores, setConsultores] = useState<ConsultorData[]>(dadosIniciais);

  // Função para atualizar os valores editáveis
  const handleInputChange = (id: number, campo: 'meta' | 'realizado', valor: string) => {
    const numero = parseInt(valor, 10);
    if (isNaN(numero) && valor !== '') return; // Permite apagar, mas só aceita números

    setConsultores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [campo]: valor === '' ? 0 : numero } : c))
    );
  };

  // Calcula a data atual formatada
  const dataFormatada = useMemo(() => {
    const data = new Date();
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(data);
  }, []);

  // Função para determinar a cor baseada na conversão usando as cores da ABV
  const getStatusColor = (conversao: number) => {
    if (conversao >= 65) return coresABV.teal; // Alto
    if (conversao >= 40) return coresABV.amarelo; // Médio
    return coresABV.vermelho; // Baixo
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      {/* Cabeçalho Principal */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-5xl mx-auto py-6 px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            {/* Logo ABV */}
            <div className="flex items-center justify-center">
               <div className="flex font-black text-6xl tracking-tighter">
                  <span style={{ color: coresABV.teal }}>a</span>
                  <span style={{ color: coresABV.vermelho }}>b</span>
                  <span style={{ color: coresABV.amarelo }}>v</span>
               </div>
            </div>
            
            {/* Divisor */}
            <div className="hidden md:block w-px h-14 bg-gray-200"></div>
            
            <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: coresABV.azulEscuro }}>
              Detalhamento por<br />Consultor
            </h1>
          </div>
          <div className="text-right text-sm md:text-base font-medium text-gray-500 capitalize">
            {dataFormatada}
          </div>
        </div>
        
        {/* Barra inferior com as cores da marca */}
        <div className="flex h-2 w-full">
          <div className="flex-1" style={{ backgroundColor: coresABV.teal }}></div>
          <div className="flex-1" style={{ backgroundColor: coresABV.vermelho }}></div>
          <div className="flex-1" style={{ backgroundColor: coresABV.amarelo }}></div>
        </div>
      </header>

      {/* Container Principal */}
      <main className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold" style={{ color: coresABV.azulEscuro }}>
              Ranking de Adesão (Calculadora)
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Altere os valores de Meta e Realizado para recalcular as porcentagens.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-white text-left text-sm" style={{ backgroundColor: coresABV.azulEscuro }}>
                  <th className="py-4 px-6 font-semibold rounded-tl-lg">Consultor</th>
                  <th className="py-4 px-6 font-semibold">Meta</th>
                  <th className="py-4 px-6 font-semibold">Realizado</th>
                  <th className="py-4 px-6 font-semibold">% Progresso</th>
                  <th className="py-4 px-6 font-semibold text-center rounded-tr-lg">Conversão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {consultores.map((consultor) => {
                  const conversao = consultor.meta > 0 ? (consultor.realizado / consultor.meta) * 100 : 0;
                  const progressoLimitado = Math.min(conversao, 100);
                  const corStatus = getStatusColor(conversao);

                  return (
                    <tr key={consultor.id} className="hover:bg-gray-50 transition-colors">
                      {/* Consultor */}
                      <td className="py-4 px-6 flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-lg shadow-sm"
                          style={{ backgroundColor: coresABV.azulEscuro }}
                        >
                          {consultor.nome.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{consultor.nome}</span>
                      </td>

                      {/* Meta (Editável) */}
                      <td className="py-4 px-6">
                        <input
                          type="number"
                          value={consultor.meta || ''}
                          onChange={(e) => handleInputChange(consultor.id, 'meta', e.target.value)}
                          className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:outline-none text-center font-medium"
                          style={{ focusRingColor: coresABV.teal }}
                        />
                      </td>

                      {/* Realizado (Editável) */}
                      <td className="py-4 px-6">
                        <input
                          type="number"
                          value={consultor.realizado || ''}
                          onChange={(e) => handleInputChange(consultor.id, 'realizado', e.target.value)}
                          className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:outline-none text-center font-medium"
                        />
                      </td>

                      {/* % Progresso (Barra) */}
                      <td className="py-4 px-6 w-48">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{
                                width: `${progressoLimitado}%`,
                                backgroundColor: corStatus,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Conversão (Badge) */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className="inline-block px-4 py-1.5 rounded text-white font-bold text-sm shadow-sm min-w-[80px]"
                          style={{ backgroundColor: corStatus }}
                        >
                          {conversao.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
