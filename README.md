# Sistema de Comandas - Rotisería

Aplicación web simple para cargar y **imprimir comandas**.

## Datos que incluye
- Número automático de comanda
- Nombre del cliente
- Número de teléfono
- Pedido
- Dirección
- Horario
- Total
- Forma de pago (Efectivo o Transferencia)
- Si el pago es por transferencia, pide **Estado de transferencia** con selección fija (Ya pagó / Pendiente de pago)

## Configuración del local
- Nombre de la rotisería
- Teléfono del local
- Dirección del local
- Estos datos se guardan localmente y se imprimen en el encabezado del ticket.

## Backup por perfil
- Desde Configuración (sesión admin), podés usar **Exportar backup perfil** para descargar un JSON.
- Con **Importar backup perfil** restaurás datos de un perfil (configuración, credenciales, historial y numeración).
- La importación puede crear el perfil si no existe y sobreescribe los datos del perfil importado.

## Perfiles de rotisería (sin mezclar datos)
- En **Configuración del local** podés elegir el perfil activo.
- Con **Nuevo perfil** creás otro negocio dentro de la misma URL.
- Con **Eliminar perfil** podés borrar un perfil secundario (no permite borrar `principal`).
- Cada perfil guarda por separado: configuración, borradores, última comanda e historial mensual.
- Al cambiar de perfil, se cargan solo los datos de ese negocio.

## Ingreso por rotisería (automático por usuario)
- Cada perfil puede tener su propio **usuario y contraseña** (se guardan desde Configuración con sesión admin).
- Al abrir la página, el operador ingresa usuario/contraseña en **Ingreso por rotisería**.
- El sistema detecta automáticamente a qué perfil pertenece ese usuario y carga sus datos.
- Así no hace falta que vos vayas a cambiar el perfil manualmente en cada local.
- Opción **Recordar usuario** disponible (solo guarda usuario, nunca la contraseña).

## Acceso administrador
- La sección **Configuración del local** está oculta por defecto para operadores.
- Solo se muestra cuando el administrador inicia sesión con:
	- Usuario: `admin`
	- Contraseña: `admin159357`
- Crear o eliminar perfiles también requiere sesión admin activa.
- La sesión admin se cierra automáticamente tras 5 minutos de inactividad.

## Cómo usar
1. Abrir `index.html` en el navegador.
2. Completar el formulario.
3. Presionar **Generar comanda**.
4. Presionar **Imprimir comanda**.

## Notas
- El total se muestra en formato moneda ARS.
- El campo total acepta miles con punto (ej: 1.000 o 100.000).
- Al imprimir, se oculta el formulario y queda solo la comanda.
- El formulario se guarda automáticamente en el navegador (respaldo local).
- Si recargás la página, recupera el borrador y la última comanda generada.
- Incluye modo offline mediante service worker.
- La impresión está ajustada para ticket térmico de 58 mm.

## Configuración recomendada de impresión
En el diálogo de impresión del navegador:
1. Impresora: seleccionar la térmica de 58 mm.
2. Escala: 100%.
3. Márgenes: Ninguno.
4. Encabezados y pies de página: Desactivados.

## Modo Ticket simple
- Activar la casilla **Modo Ticket simple (cocina)** antes de imprimir.
- La preferencia queda guardada y se recupera automáticamente al volver a abrir.
- Este modo usa texto más compacto para tickets cortos en impresora térmica de 58 mm.

## Historial mensual de impresiones
- Cada vez que presionás **Imprimir comanda**, se guarda en el historial.
- El apartado **Comandas impresas por mes** permite elegir el mes y ver el listado.
- Muestra cantidad de comandas y total acumulado del mes.
- Los datos quedan guardados localmente en el navegador.
- Incluye botón **Exportar CSV** para descargar el mes seleccionado.
- Cada comanda del historial tiene botón **Cancelar/Restaurar comanda** (sin borrar historial).
- Se muestra un resumen claro: **Ingreso de ventas del mes**.
- El ingreso mensual suma solo comandas activas (las canceladas no suman).

## Recomendación de uso offline
Para que el modo offline funcione correctamente, abrir el sistema desde un servidor local (no desde `file://`).

Ejemplo rápido con VS Code:
1. Instalar la extensión **Live Server**.
2. Abrir `index.html` con **Open with Live Server**.
