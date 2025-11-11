document.getElementById('footprint-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Obtener los valores de entrada
    const energia = parseFloat(document.getElementById('energia').value) || 0; // kWh/mes
    const agua = parseFloat(document.getElementById('agua').value) || 0;     // m³/mes
    const transporte = parseFloat(document.getElementById('transporte').value) || 0; // km/mes
    const alimentacionFactor = parseFloat(document.getElementById('alimentacion').value) || 0; // Factor de impacto por dieta

    // 2. Factores de Conversión Simplificados (por año, convertidos a hag)
    // Estos factores son *ejemplos simplificados* para hacer que la calculadora funcione.
    // Los cálculos reales son mucho más complejos.
    
    // Convertir consumo mensual a anual
    const mesesAnio = 12;

    // Factor Energía (hag por kWh anual) - Ejemplo: Asumiendo una matriz energética mixta
    const FACTOR_ENERGIA = 0.0003; // hag por kWh anual
    // Cálculo: (kWh/mes * 12 meses) * FACTOR_ENERGIA
    const huellaEnergia = (energia * mesesAnio) * FACTOR_ENERGIA;

    // Factor Agua (hag por m³ anual) - Ejemplo: Uso y energía para tratamiento
    const FACTOR_AGUA = 0.005; // hag por m³ anual
    // Cálculo: (m³/mes * 12 meses) * FACTOR_AGUA
    const huellaAgua = (agua * mesesAnio) * FACTOR_AGUA;

    // Factor Transporte (hag por km anual) - Ejemplo: Coche promedio, combustible
    const FACTOR_TRANSPORTE = 0.00008; // hag por km anual
    // Cálculo: (km/mes * 12 meses) * FACTOR_TRANSPORTE
    const huellaTransporte = (transporte * mesesAnio) * FACTOR_TRANSPORTE;

    // Factor Alimentación (hag fijo base ajustado por factor de dieta)
    const HUELLA_ALIMENTACION_BASE = 1.0; // hag base de una dieta
    const huellaAlimentacion = HUELLA_ALIMENTACION_BASE * (alimentacionFactor / 25); 

    // 3. Cálculo de la Huella Total
    const huellaTotal = huellaEnergia + huellaAgua + huellaTransporte + huellaAlimentacion;
    const promedioMundial = 2.7; // hag

    // 4. Determinar la Mayor Área de Impacto
    const breakdown = {
        'Energía': huellaEnergia,
        'Agua': huellaAgua,
        'Transporte': huellaTransporte,
        'Alimentación': huellaAlimentacion
    };

    let mayorImpacto = '';
    let maxHag = -1;

    for (const pilar in breakdown) {
        if (breakdown[pilar] > maxHag) {
            maxHag = breakdown[pilar];
            mayorImpacto = pilar;
        }
    }

    // 5. Generar Recomendación Personalizada (Basada en el Pilar con mayor impacto)
    let recomendacionTexto = '';
    switch (mayorImpacto) {
        case 'Energía':
            recomendacionTexto = 'Tu mayor impacto es la <strong>Energía</strong>. Considera cambiar a bombillas LED y desconectar electrodomésticos, o investigar opciones de energía renovable, lo que puede reducir tu huella energética hasta 80%.';
            break;
        case 'Agua':
            recomendacionTexto = 'Tu mayor impacto es el <strong>Agua</strong>. Reduce la duración de tus duchas y revisa grifos e inodoros para evitar fugas. Esto puede generar ahorros de ~0,3 hag/año.';
            break;
        case 'Transporte':
            recomendacionTexto = 'Tu mayor impacto es el <strong>Transporte</strong>. Utiliza más transporte público o bicicleta. Usar transporte público 5 días/semana reduce tu impacto de movilidad en ~60%.';
            break;
        case 'Alimentación':
            recomendacionTexto = 'Tu mayor impacto es la <strong>Alimentación</strong>. Intenta un día vegetariano o vegano a la semana, ya que la carne y lácteos tienen el mayor impacto. Cada día vegetariano ahorra ~0,2 hag anuales.';
            break;
        default:
            recomendacionTexto = '¡Excelente! Tu impacto está bien distribuido. Sigue trabajando en reducir el consumo de todos los pilares.';
    }

    // 6. Mostrar Resultados
    document.getElementById('total-hag').textContent = huellaTotal.toFixed(2);
    document.getElementById('energy-hag').textContent = huellaEnergia.toFixed(2) + ' hag';
    document.getElementById('water-hag').textContent = huellaAgua.toFixed(2) + ' hag';
    document.getElementById('transport-hag').textContent = huellaTransporte.toFixed(2) + ' hag';
    document.getElementById('food-hag').textContent = huellaAlimentacion.toFixed(2) + ' hag';
    
    // Comparación con el promedio
    let comparisonText;
    if (huellaTotal <= 1.7) {
        comparisonText = '¡Fantástico! Tu huella es <strong>sostenible</strong> y está por debajo de la capacidad de regeneración del planeta (<strong>1.7 hag</strong> per cápita).';
    } else if (huellaTotal <= promedioMundial) {
        comparisonText = '¡Muy bien! Tu huella está por debajo del promedio mundial (<strong>2.7 hag</strong>), pero aún por encima de la capacidad planetaria. ¡Sigue mejorando!';
    } else {
        comparisonText = 'Tu huella está <strong>por encima del promedio mundial</strong> (<strong>2.7 hag</strong>). Necesitamos tomar acción inmediata en tu pilar de mayor impacto.';
    }
    
    document.getElementById('comparison-text').innerHTML = comparisonText;
    document.getElementById('recommendation-text').innerHTML = recomendacionTexto;

    // Mostrar el contenedor de resultados
    document.getElementById('results-container').style.display = 'block';
});