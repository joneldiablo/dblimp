# @dblimp/chartjs

Componentes declarativos para visualización de datos basados en **Chart.js** y **react-chartjs-2**, totalmente integrados con el motor Goat de DBLimp.

## Instalación

```bash
npm install @dblimp/chartjs @dblimp/core chart.js react-chartjs-2
# o con yarn
yarn add @dblimp/chartjs @dblimp/core chart.js react-chartjs-2
```

### Dependencias de pares (Peer Dependencies)
- `@dblimp/core`: `^1.0.0-dev`
- `chart.js`: `^4.4.0`
- `react-chartjs-2`: `^5.3.0`
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Componentes Disponibles

- **`LineChartjs`**: Gráfica de líneas para tendencias y series temporales.
- **`BarChartjs`**: Gráfica de barras verticales u horizontales.
- **`DoughnutChartjs`**: Gráfica de rosquilla / dona para proporciones y porcentajes.
- **`ScatterChartjs`**: Gráfica de dispersión para distribución de datos en coordenadas cartesianas.
- **`Chartjs`**: Componente genérico adaptable a cualquier tipo soportado por Chart.js.

---

## Ejemplos de Uso

### Gráfico de Barras

```tsx
import React from "react";
import { BarChartjs } from "@dblimp/chartjs";

const data = {
  labels: ["Enero", "Febrero", "Marzo", "Abril"],
  datasets: [
    {
      label: "Ventas 2026",
      data: [65, 59, 80, 81],
      backgroundColor: "rgba(54, 162, 235, 0.5)"
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Ventas Mensuales" }
  }
};

export const SalesReport = () => (
  <BarChartjs name="salesBarChart" data={data} options={options} />
);
```

### Uso dentro de un esquema Goat

```json
{
  "name": "analytics-view",
  "component": "BarChartjs",
  "data": "$data/analytics",
  "options": "$data/chartOptions"
}
```

---

## Licencia

ISC
