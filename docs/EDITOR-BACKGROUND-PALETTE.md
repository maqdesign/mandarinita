# Paleta de fondos del editor

La pestaña **Componentes → Fondos** tiene colores listos para aplicar al fondo de la viñeta activa. La elección se guarda en la propiedad `backgroundColor` del proyecto editable; no rasteriza el lienzo ni altera los demás elementos. El selector **Elegir otro color** permite definir un tono personalizado.

## Colores de marca

Los valores proceden de las variables CSS oficiales de `styles.css`:

| Nombre en el editor | Valor | Referencia |
| --- | --- | --- |
| Crema Mandarinita | `#FFF8EC` | `--canvas` |
| Naranja Mandarinita | `#F87209` | `--orange` |
| Verde Mandarinita | `#607D38` | `--green` |
| Amarillo Mandarinita | `#FAC421` | `--yellow` |
| Morado Mandarinita | `#68387D` | `--purple` |

También se incluye blanco (`#FFFFFF`) como base neutra.

## Muestras de episodios

Estos valores aproximados se muestrearon de los campos de color dominantes de los paneles indicados. Se pueden usar como puntos de partida para fondos nuevos, pero no sustituyen el archivo original, no representan una extracción de fondo y pueden requerir ajuste visual:

| Nombre | Valor | Panel de referencia |
| --- | --- | --- |
| Miel cálida | `#FFDB9F` | 05.1 |
| Arena dorada | `#EBD79B` | 14.1 |
| Amarillo sol | `#FFC551` | 31.1 |
| Lila vivo | `#B490FF` | 36.1 |
| Cian tropical | `#36F0FF` | 37.1 |
| Verde lima | `#B7FF48` | 42.1 |
| Azul cielo | `#87DEFA` | 52.1 |
| Azul claro | `#93CCFF` | 70.1 |

Al filtrar fondos, las escenas de episodios continúan presentándose como referencias completas, no como fondos insertables. El service worker recibe una nueva versión de caché cuando cambian los recursos de la aplicación, para que la PWA recargue la paleta y los estilos nuevos.
