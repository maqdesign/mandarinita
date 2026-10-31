# Mandarinita Design System · v0.1 (Foundation)

**Estado:** borrador de trabajo; no sustituye el manual oficial ni los registros de ONAPI.

Este repositorio mantiene la fuente de verdad técnica compartida entre **Figma**, `mandarinita.art`, nuevos productos y aplicaciones del universo Mandarinita.

## Regla de autoridad
1. **Identidad legal/maestra (bloqueada):** logotipo oficial original, su lettering, geometría y colores contenidos en el archivo aprobado. No modificar, trazar nuevamente, redibujar ni reconstruir por CSS.
2. **Arte original (bloqueado en identidad):** siluetas, proporciones y rasgos de personajes se conservan; prohibido agregar nariz. Los originales tienen prioridad sobre recreaciones.
3. **Diseño de producto (evolutivo):** tokens de superficies, botones, tipografía de interfaz, navegación, espaciados, rejillas, estados, accesibilidad, animación, cards y sistemas temáticos.
4. **Archivo histórico:** material de referencia, nunca autoridad automática cuando contradice los originales.

## Estructura
- `tokens.json`: tokens semánticos de interfaz; los valores **no se aplican al logotipo**.
- `BRAND-GUARDRAILS.md`: límites de uso y normas canónicas.
- `HISTORICAL-AUDIT.md`: evidencia revisada, procedencia, lagunas.
- `COMPONENTS.md`: contrato de componentes web y futuros aplicativos.

## Evolución
Versionado semántico del sistema, revisiones de diseño en Figma antes de incorporar cambios a producción, y pruebas automatizadas en las aplicaciones que consuman tokens. Las apps deben importar tokens compartidos en vez de copiar hexadecimales. No utilizar una librería UI externa sin tematización y revisión visual.

**Importante:** la tipografía propia del logotipo es inmutable. Work Sans para interfaz y Fredoka para titulares expresivos son opciones de trabajo heredadas, sujetas a confirmación por el propietario; nunca sustituyen el lettering del logo.
