'use client';

interface Categoria {
  id: number;
  nombre: string;
  tipo: string;
  color: string;
}

interface Props {
  categorias: Categoria[];
  seleccionadas: number[];
  onChange: (ids: number[]) => void;
  maxSeleccion?: number;
}

export default function SelectorCategorias({ 
  categorias, 
  seleccionadas, 
  onChange, 
  maxSeleccion = 3 
}: Props) {
  const toggleCategoria = (id: number) => {
    if (seleccionadas.includes(id)) {
      onChange(seleccionadas.filter(c => c !== id));
    } else if (seleccionadas.length < maxSeleccion) {
      onChange([...seleccionadas, id]);
    }
  };

  const generales = categorias.filter(c => c.tipo === 'general');
  const clases = categorias.filter(c => c.tipo === 'clase');

  return (
    <div className="space-y-4">
      {seleccionadas.length > 0 && (
        <p className="text-[#8b6f4c] text-xs">
          Seleccionadas: {seleccionadas.length} / {maxSeleccion}
        </p>
      )}
      
      <div>
        <h4 className="text-[#c4aa7d] text-sm mb-2">Generales</h4>
        <div className="flex flex-wrap gap-2">
          {generales.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategoria(cat.id)}
              className={`px-3 py-1 text-xs border-2 transition-all ${
                seleccionadas.includes(cat.id)
                  ? 'border-[#f0d9b5] bg-[#8b6f4c] text-[#0a0c0e]'
                  : 'border-[#8b6f4c] text-[#c4aa7d] hover:border-[#f0d9b5]'
              }`}
              style={{ borderColor: seleccionadas.includes(cat.id) ? '#f0d9b5' : cat.color }}
              disabled={!seleccionadas.includes(cat.id) && seleccionadas.length >= maxSeleccion}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[#c4aa7d] text-sm mb-2">Clases</h4>
        <div className="flex flex-wrap gap-2">
          {clases.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategoria(cat.id)}
              className={`px-3 py-1 text-xs border-2 transition-all ${
                seleccionadas.includes(cat.id)
                  ? 'border-[#f0d9b5] bg-[#8b6f4c] text-[#0a0c0e]'
                  : 'border-[#8b6f4c] text-[#c4aa7d] hover:border-[#f0d9b5]'
              }`}
              style={{ borderColor: seleccionadas.includes(cat.id) ? '#f0d9b5' : cat.color }}
              disabled={!seleccionadas.includes(cat.id) && seleccionadas.length >= maxSeleccion}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}