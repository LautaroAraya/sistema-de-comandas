const form = document.getElementById("comanda-form");
const printBtn = document.getElementById("print-btn");
const printTestBtn = document.getElementById("print-test-btn");
const statusEl = document.getElementById("status");
const quickLogoutBtn = document.getElementById("quick-logout-btn");
const toastContainerEl = document.getElementById("toast-container");
const appVersionEl = document.getElementById("app-version");
const activeRotiseriaEl = document.getElementById("active-rotiseria");
const operatorUserEl = document.getElementById("operator-user");
const operatorPasswordEl = document.getElementById("operator-password");
const operatorLoginBtn = document.getElementById("operator-login-btn");
const operatorLogoutBtn = document.getElementById("operator-logout-btn");
const operatorAccessStatusEl = document.getElementById("operator-access-status");
const operatorRememberUserEl = document.getElementById("operator-remember-user");
const adminUserEl = document.getElementById("admin-user");
const adminPasswordEl = document.getElementById("admin-password");
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminLogoutBtn = document.getElementById("admin-logout-btn");
const adminAccessStatusEl = document.getElementById("admin-access-status");
const simpleModeEl = document.getElementById("simple-mode");
const profileSelectEl = document.getElementById("profile-select");
const addProfileBtn = document.getElementById("add-profile-btn");
const deleteProfileBtn = document.getElementById("delete-profile-btn");
const historyMonthEl = document.getElementById("history-month");
const historySearchEl = document.getElementById("history-search");
const clearHistorySearchBtn = document.getElementById("clear-history-search-btn");
const historyListEl = document.getElementById("history-list");
const historySummaryEl = document.getElementById("history-summary");
const monthlyReportEl = document.getElementById("monthly-report");
const weeklyReportEl = document.getElementById("weekly-report");
const dailyReportEl = document.getElementById("daily-report");
const exportCsvBtn = document.getElementById("export-csv-btn");
const printReportBtn = document.getElementById("print-report-btn");
const resetBusinessBtn = document.getElementById("reset-business-btn");
const saveProfileAuthBtn = document.getElementById("save-profile-auth-btn");
const exportProfileBackupBtn = document.getElementById("export-profile-backup-btn");
const importProfileBackupBtn = document.getElementById("import-profile-backup-btn");
const importProfileBackupFile = document.getElementById("import-profile-backup-file");
const bgColorStartEl = document.getElementById("bg-color-start");
const bgColorEndEl = document.getElementById("bg-color-end");
const resetBackgroundBtn = document.getElementById("reset-background-btn");
const profileUserEl = document.getElementById("perfil-usuario");
const profilePasswordEl = document.getElementById("perfil-password");
const transferStatusFieldEl = document.getElementById("transfer-status-field");
const transferStatusRowEl = document.getElementById("transfer-status-row");
const printCopiesNoticeEl = document.getElementById("print-copies-notice");
const combinedCashFieldEl = document.getElementById("combined-cash-field");
const combinedTransferFieldEl = document.getElementById("combined-transfer-field");
const combinedCashRowEl = document.getElementById("combined-cash-row");
const combinedTransferRowEl = document.getElementById("combined-transfer-row");
const deliveryAddressFieldEl = document.getElementById("delivery-address-field");
const direccionRowEl = document.getElementById("direccion-row");
const ticketPanelEl = document.getElementById("ticket");
const businessFields = {
  nombre: document.getElementById("negocio-nombre"),
  telefono: document.getElementById("negocio-telefono"),
  direccion: document.getElementById("negocio-direccion"),
};
const businessPreview = {
  nombre: document.getElementById("v-negocio-nombre"),
  telefono: document.getElementById("v-negocio-telefono"),
  direccion: document.getElementById("v-negocio-direccion"),
};
const STORAGE_PREFIX = "rotiseria.comanda";
const PROFILE_INDEX_KEY = `${STORAGE_PREFIX}.profiles`;
const ACTIVE_PROFILE_KEY = `${STORAGE_PREFIX}.activeProfile`;
const ADMIN_SESSION_KEY = `${STORAGE_PREFIX}.adminSession`;
const OPERATOR_SESSION_KEY = `${STORAGE_PREFIX}.operatorSession`;
const OPERATOR_REMEMBER_USER_KEY = `${STORAGE_PREFIX}.operatorRememberUser`;
const APP_VERSION = "v2026.03.04-5";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin159357";
const ADMIN_IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const ACTION_ALERTS_ENABLED = true;
const TOAST_DURATION_MS = 2800;
const PROFILE_DEFAULT = "principal";
const DEFAULT_BACKGROUND_START = "#f5f5f5";
const DEFAULT_BACKGROUND_END = "#e5e7eb";
const PROFILE_BASE_KEYS = {
  DRAFT: "draft",
  LAST_TICKET: "lastTicket",
  PRINT_MODE: "simplePrint",
  PRINTED_TICKETS: "printedTickets",
  BUSINESS: "businessConfig",
  AUTH: "profileAuth",
  NEXT_ORDER_NUMBER: "nextOrderNumber",
  BACKGROUND_GRADIENT: "backgroundGradient",
};

let activeProfileId = PROFILE_DEFAULT;
let adminIdleTimer = null;
let editingPrintedTicketId = null;

const fields = {
  cliente: document.getElementById("cliente"),
  telefono: document.getElementById("telefono"),
  pedido: document.getElementById("pedido"),
  envio: document.getElementById("envio"),
  direccion: document.getElementById("direccion"),
  horario: document.getElementById("horario"),
  total: document.getElementById("total"),
  pago: document.getElementById("pago"),
  estadoTransferencia: document.getElementById("estado-transferencia"),
  montoEfectivo: document.getElementById("monto-efectivo"),
  montoTransferencia: document.getElementById("monto-transferencia"),
};

const preview = {
  numeroComanda: document.getElementById("v-numero-comanda"),
  fecha: document.getElementById("v-fecha"),
  cliente: document.getElementById("v-cliente"),
  telefono: document.getElementById("v-telefono"),
  envio: document.getElementById("v-envio"),
  pedido: document.getElementById("v-pedido"),
  direccion: document.getElementById("v-direccion"),
  horario: document.getElementById("v-horario"),
  total: document.getElementById("v-total"),
  pago: document.getElementById("v-pago"),
  estadoTransferencia: document.getElementById("v-estado-transferencia"),
  montoEfectivo: document.getElementById("v-monto-efectivo"),
  montoTransferencia: document.getElementById("v-monto-transferencia"),
};

function formatAmountForInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function normalizeHexColor(value, fallback) {
  const text = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(text)) {
    return text.toLowerCase();
  }
  return fallback;
}

function applyBackgroundGradient(startColor, endColor) {
  document.documentElement.style.setProperty("--page-bg-start", startColor);
  document.documentElement.style.setProperty("--page-bg-end", endColor);
}

function readBackgroundGradientValues() {
  return {
    start: normalizeHexColor(bgColorStartEl.value, DEFAULT_BACKGROUND_START),
    end: normalizeHexColor(bgColorEndEl.value, DEFAULT_BACKGROUND_END),
  };
}

function writeBackgroundGradientValues(values) {
  bgColorStartEl.value = normalizeHexColor(values.start, DEFAULT_BACKGROUND_START);
  bgColorEndEl.value = normalizeHexColor(values.end, DEFAULT_BACKGROUND_END);
}

function saveBackgroundGradient(showStatus = false) {
  const values = readBackgroundGradientValues();
  applyBackgroundGradient(values.start, values.end);
  localStorage.setItem(keyFor(PROFILE_BASE_KEYS.BACKGROUND_GRADIENT), JSON.stringify(values));
  if (showStatus) {
    setStatus("Fondo degradado guardado", false, true);
  }
}

function loadBackgroundGradient() {
  try {
    const raw = localStorage.getItem(keyFor(PROFILE_BASE_KEYS.BACKGROUND_GRADIENT));
    if (!raw) {
      writeBackgroundGradientValues({
        start: DEFAULT_BACKGROUND_START,
        end: DEFAULT_BACKGROUND_END,
      });
      applyBackgroundGradient(DEFAULT_BACKGROUND_START, DEFAULT_BACKGROUND_END);
      return;
    }

    const parsed = JSON.parse(raw);
    const start = normalizeHexColor(parsed.start, DEFAULT_BACKGROUND_START);
    const end = normalizeHexColor(parsed.end, DEFAULT_BACKGROUND_END);
    writeBackgroundGradientValues({ start, end });
    applyBackgroundGradient(start, end);
  } catch {
    writeBackgroundGradientValues({
      start: DEFAULT_BACKGROUND_START,
      end: DEFAULT_BACKGROUND_END,
    });
    applyBackgroundGradient(DEFAULT_BACKGROUND_START, DEFAULT_BACKGROUND_END);
  }
}

function resetBackgroundGradient() {
  writeBackgroundGradientValues({
    start: DEFAULT_BACKGROUND_START,
    end: DEFAULT_BACKGROUND_END,
  });
  applyBackgroundGradient(DEFAULT_BACKGROUND_START, DEFAULT_BACKGROUND_END);
  localStorage.removeItem(keyFor(PROFILE_BASE_KEYS.BACKGROUND_GRADIENT));
  setStatus("Fondo restablecido", false, true);
}

function keyFor(baseKey) {
  return `${STORAGE_PREFIX}.${activeProfileId}.${baseKey}`;
}

function getSessionProfileValue(baseKey) {
  return sessionStorage.getItem(keyFor(baseKey));
}

function setSessionProfileValue(baseKey, value) {
  sessionStorage.setItem(keyFor(baseKey), value);
}

function removeSessionProfileValue(baseKey) {
  sessionStorage.removeItem(keyFor(baseKey));
}

function sanitizeProfileId(value) {
  const sanitized = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
  return sanitized || PROFILE_DEFAULT;
}

function getProfiles() {
  try {
    const raw = localStorage.getItem(PROFILE_INDEX_KEY);
    const parsed = raw ? JSON.parse(raw) : [PROFILE_DEFAULT];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [PROFILE_DEFAULT];
    }
    return parsed;
  } catch {
    return [PROFILE_DEFAULT];
  }
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILE_INDEX_KEY, JSON.stringify(profiles));
}

function renderProfileOptions() {
  const profiles = getProfiles();
  profileSelectEl.innerHTML = profiles
    .map((profile) => `<option value="${profile}">${profile}</option>`)
    .join("");
  profileSelectEl.value = activeProfileId;
}

function setActiveProfile(profileId) {
  activeProfileId = profileId;
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
  renderProfileOptions();
}

function setupProfiles() {
  const profiles = getProfiles();
  const savedActive = sanitizeProfileId(localStorage.getItem(ACTIVE_PROFILE_KEY));
  const initialActive = profiles.includes(savedActive) ? savedActive : profiles[0];
  setActiveProfile(initialActive);
}

function setAdminSession(isAuthenticated) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(isAuthenticated));
  document.body.classList.toggle("admin-authenticated", isAuthenticated);
  adminLogoutBtn.disabled = !isAuthenticated;
  adminAccessStatusEl.textContent = isAuthenticated
    ? "Sesión admin activa. Configuración visible."
    : "Configuración oculta para operadores.";

  if (isAuthenticated) {
    resetAdminIdleTimer();
  } else {
    clearAdminIdleTimer();
  }
}

function setOperatorSession(session) {
  const isAuthenticated = Boolean(session && session.profileId);
  if (isAuthenticated) {
    localStorage.setItem(OPERATOR_SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(OPERATOR_SESSION_KEY);
  }

  document.body.classList.toggle("profile-authenticated", isAuthenticated);
  operatorLogoutBtn.disabled = !isAuthenticated;
  operatorAccessStatusEl.textContent = isAuthenticated
    ? `Sesión iniciada: ${session.username} (${session.profileId})`
    : "Ingresá con usuario y contraseña de la rotisería.";

  if (!isAuthenticated) {
    activeRotiseriaEl.textContent = "Rotisería activa: ninguna";
  }
}

function getRememberedOperatorUser() {
  return localStorage.getItem(OPERATOR_REMEMBER_USER_KEY) || "";
}

function saveRememberedOperatorUser(username) {
  localStorage.setItem(OPERATOR_REMEMBER_USER_KEY, username);
}

function clearRememberedOperatorUser() {
  localStorage.removeItem(OPERATOR_REMEMBER_USER_KEY);
}

function getOperatorSession() {
  try {
    const raw = localStorage.getItem(OPERATOR_SESSION_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.profileId || !parsed.username) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function clearAdminIdleTimer() {
  if (adminIdleTimer) {
    window.clearTimeout(adminIdleTimer);
    adminIdleTimer = null;
  }
}

function resetAdminIdleTimer() {
  if (!isAdminSessionActive()) {
    return;
  }

  clearAdminIdleTimer();
  adminIdleTimer = window.setTimeout(() => {
    if (!isAdminSessionActive()) {
      return;
    }

    setAdminSession(false);
    setStatus("Sesión admin cerrada por inactividad");
  }, ADMIN_IDLE_TIMEOUT_MS);
}

function bindAdminActivityTracking() {
  const activityEvents = ["click", "keydown", "mousemove", "touchstart", "scroll"];
  activityEvents.forEach((eventName) => {
    window.addEventListener(eventName, () => {
      if (isAdminSessionActive()) {
        resetAdminIdleTimer();
      }
    });
  });
}

function isAdminSessionActive() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || "false") === true;
  } catch {
    return false;
  }
}

function requireAdminSession() {
  if (!isAdminSessionActive()) {
    setStatus("Acción permitida solo para administrador", true);
    return false;
  }

  return true;
}

function readProfileAuthValues() {
  return {
    username: profileUserEl.value.trim(),
    password: profilePasswordEl.value,
  };
}

function writeProfileAuthValues(values) {
  profileUserEl.value = values.username || "";
  profilePasswordEl.value = values.password || "";
}

function getProfileAuth(profileId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}.${profileId}.${PROFILE_BASE_KEYS.AUTH}`);
    if (!raw) {
      return { username: "", password: "" };
    }
    const parsed = JSON.parse(raw);
    return {
      username: parsed.username || "",
      password: parsed.password || "",
    };
  } catch {
    return { username: "", password: "" };
  }
}

function saveCurrentProfileAuth() {
  if (!requireAdminSession()) {
    return;
  }

  const auth = readProfileAuthValues();
  if (!auth.username || !auth.password) {
    setStatus("Completá usuario y contraseña del perfil", true, true);
    return;
  }

  const confirmed = window.confirm(
    "Vas a guardar usuario y contraseña del perfil en este dispositivo. ¿Querés continuar?"
  );
  if (!confirmed) {
    setStatus("Guardado de credenciales cancelado", true, true);
    return;
  }

  localStorage.setItem(keyFor(PROFILE_BASE_KEYS.AUTH), JSON.stringify(auth));
  setStatus(`Credenciales guardadas para perfil: ${activeProfileId}`, false, true);
}

function findProfileByCredentials(username, password) {
  const profiles = getProfiles();
  return profiles.find((profileId) => {
    const auth = getProfileAuth(profileId);
    return auth.username === username && auth.password === password;
  });
}

function handleOperatorLogin() {
  const username = operatorUserEl.value.trim();
  const password = operatorPasswordEl.value;

  if (!username || !password) {
    setStatus("Ingresá usuario y contraseña de la rotisería", true, true);
    return;
  }

  const matchedProfile = findProfileByCredentials(username, password);
  if (!matchedProfile) {
    setStatus("Usuario o contraseña de rotisería incorrectos", true, true);
    return;
  }

  setActiveProfile(matchedProfile);
  setOperatorSession({ profileId: matchedProfile, username });
  if (operatorRememberUserEl.checked) {
    saveRememberedOperatorUser(username);
  } else {
    clearRememberedOperatorUser();
  }
  loadProfileData();
  operatorUserEl.value = "";
  operatorPasswordEl.value = "";
  setStatus(`Ingreso correcto: ${matchedProfile}`, false, true);
}

function handleOperatorLogout() {
  setOperatorSession(null);
  writeFormValues({});
  renderTicket({});
  setTicketVisibility(false);
  setStatus("Sesión de rotisería cerrada", false, true);
}

function handleQuickLogout() {
  setOperatorSession(null);
  setAdminSession(false);
  writeFormValues({});
  renderTicket({});
  setTicketVisibility(false);
  editingPrintedTicketId = null;
  setStatus("Sesiones cerradas", false, true);
}

function handleAdminLogin() {
  const user = adminUserEl.value.trim();
  const password = adminPasswordEl.value;

  if (user !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    setStatus("Usuario o contraseña admin incorrectos", true, true);
    return false;
  }

  setAdminSession(true);
  adminUserEl.value = "";
  adminPasswordEl.value = "";
  setStatus("Acceso administrador habilitado", false, true);
  return true;
}

function clearProfileData(profileId) {
  Object.values(PROFILE_BASE_KEYS).forEach((baseKey) => {
    localStorage.removeItem(`${STORAGE_PREFIX}.${profileId}.${baseKey}`);
  });
}

function generateTicketId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `ticket-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function getCurrentOrderNumber() {
  const raw = localStorage.getItem(keyFor(PROFILE_BASE_KEYS.NEXT_ORDER_NUMBER));
  const parsed = Number.parseInt(raw || "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function getNextOrderNumber() {
  const current = getCurrentOrderNumber();
  localStorage.setItem(keyFor(PROFILE_BASE_KEYS.NEXT_ORDER_NUMBER), String(current + 1));
  return current;
}

function formatOrderNumber(number) {
  return String(number).padStart(4, "0");
}

function exportProfileBackup() {
  if (!requireAdminSession()) {
    return;
  }

  const backupData = {
    backupVersion: 1,
    exportedAt: new Date().toISOString(),
    profileId: activeProfileId,
    data: {
      business: localStorage.getItem(keyFor(PROFILE_BASE_KEYS.BUSINESS)),
      auth: localStorage.getItem(keyFor(PROFILE_BASE_KEYS.AUTH)),
      draft: localStorage.getItem(keyFor(PROFILE_BASE_KEYS.DRAFT)),
      lastTicket: localStorage.getItem(keyFor(PROFILE_BASE_KEYS.LAST_TICKET)),
      printedTickets: localStorage.getItem(keyFor(PROFILE_BASE_KEYS.PRINTED_TICKETS)),
      printMode: localStorage.getItem(keyFor(PROFILE_BASE_KEYS.PRINT_MODE)),
      nextOrderNumber: localStorage.getItem(keyFor(PROFILE_BASE_KEYS.NEXT_ORDER_NUMBER)),
      backgroundGradient: localStorage.getItem(keyFor(PROFILE_BASE_KEYS.BACKGROUND_GRADIENT)),
    },
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `backup-${activeProfileId}-${monthValue(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  setStatus(`Backup exportado del perfil: ${activeProfileId}`, false, true);
}

function importProfileBackupFromFile(file) {
  if (!requireAdminSession()) {
    return;
  }

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      if (!parsed || !parsed.profileId || !parsed.data) {
        setStatus("Archivo de backup inválido", true, true);
        return;
      }

      const backupProfileId = sanitizeProfileId(parsed.profileId);
      const confirmed = window.confirm(
        `Se importará el backup al perfil \"${backupProfileId}\" y se sobrescribirán sus datos. ¿Continuar?`
      );
      if (!confirmed) {
        setStatus("Importación cancelada", true, true);
        return;
      }

      const profiles = getProfiles();
      if (!profiles.includes(backupProfileId)) {
        saveProfiles([...profiles, backupProfileId]);
      }

      Object.entries(PROFILE_BASE_KEYS).forEach(([name, baseKey]) => {
        const sourceKey =
          name === "BUSINESS"
            ? "business"
            : name === "AUTH"
              ? "auth"
              : name === "DRAFT"
                ? "draft"
                : name === "LAST_TICKET"
                  ? "lastTicket"
                  : name === "PRINTED_TICKETS"
                    ? "printedTickets"
                    : name === "PRINT_MODE"
                      ? "printMode"
                      : name === "NEXT_ORDER_NUMBER"
                        ? "nextOrderNumber"
                        : name === "BACKGROUND_GRADIENT"
                          ? "backgroundGradient"
                        : null;

        if (!sourceKey) {
          return;
        }

        const value = parsed.data[sourceKey];
        const storageKey = `${STORAGE_PREFIX}.${backupProfileId}.${baseKey}`;
        if (value === null || value === undefined || value === "") {
          localStorage.removeItem(storageKey);
        } else {
          localStorage.setItem(storageKey, String(value));
        }
      });

      setActiveProfile(backupProfileId);
      loadProfileData();
      setStatus(`Backup importado en perfil: ${backupProfileId}`, false, true);
    } catch {
      setStatus("No se pudo leer el backup", true, true);
    } finally {
      importProfileBackupFile.value = "";
    }
  };
  reader.onerror = () => {
    setStatus("No se pudo abrir el archivo de backup", true, true);
    importProfileBackupFile.value = "";
  };
  reader.readAsText(file);
}

function parseAmount(value) {
  const normalized = String(value ?? "").replace(/\./g, "").replace(/,/g, ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function money(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseAmount(value));
}

function fechaActual() {
  return new Date().toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function monthValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function startOfWeek(date) {
  const result = new Date(date);
  const day = result.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diffToMonday);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfWeek(date) {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

function formatShortDate(dateInput) {
  return new Date(dateInput).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function renderWeeklySummary(monthItems) {
  const activeItems = monthItems.filter((item) => !item.cancelled);

  if (activeItems.length === 0) {
    weeklyReportEl.textContent = "Ventas por semana: sin ventas activas en el mes seleccionado.";
    return;
  }

  const weeklyGroups = activeItems.reduce((acc, item) => {
    const printedDate = new Date(item.printedAt);
    const weekStart = startOfWeek(printedDate);
    const weekEnd = endOfWeek(printedDate);
    const weekKey = weekStart.toISOString().slice(0, 10);

    if (!acc[weekKey]) {
      acc[weekKey] = {
        start: weekStart,
        end: weekEnd,
        count: 0,
        transferTotal: 0,
        cashTotal: 0,
      };
    }

    const split = getPaymentBreakdown(item);
    acc[weekKey].count += 1;
    acc[weekKey].transferTotal += split.transfer;
    acc[weekKey].cashTotal += split.cash;

    return acc;
  }, {});

  const rows = Object.values(weeklyGroups)
    .sort((a, b) => b.start - a.start)
    .map((week) => {
      const total = week.transferTotal + week.cashTotal;
      return `<div class="weekly-report-item">Semana ${formatShortDate(week.start)} al ${formatShortDate(
        week.end
      )} · ${week.count} venta(s) · Transferencias: ${money(week.transferTotal)} · Efectivo: ${money(
        week.cashTotal
      )} · Total: ${money(total)}</div>`;
    })
    .join("");

  weeklyReportEl.innerHTML = `<div>Ventas por semana</div>${rows}`;
}

function getEnvioLabel(value) {
  if (value === "Busca") {
    return "Retira en local";
  }

  return value || "-";
}

function getShippingBadgeData(data) {
  if (isDeliveryOrder(data)) {
    return { label: "Delivery", className: "delivery" };
  }

  if (data.envio) {
    return { label: getEnvioLabel(data.envio), className: "pickup" };
  }

  return { label: "-", className: "unknown" };
}

function hasTransferComponent(paymentMethod) {
  return paymentMethod === "Transferencia" || paymentMethod === "Combinado";
}

function isCombinedPayment(paymentMethod) {
  return paymentMethod === "Combinado";
}

function getPaymentBreakdown(item) {
  const total = parseAmount(item.total);

  if (item.pago === "Transferencia") {
    return { transfer: total, cash: 0 };
  }

  if (item.pago === "Efectivo") {
    return { transfer: 0, cash: total };
  }

  if (item.pago === "Combinado") {
    return {
      transfer: parseAmount(item.montoTransferencia),
      cash: parseAmount(item.montoEfectivo),
    };
  }

  return { transfer: 0, cash: 0 };
}

function formatDateTime(dateInput) {
  return new Date(dateInput).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function readFormValues() {
  return {
    cliente: fields.cliente.value.trim(),
    telefono: fields.telefono.value.trim(),
    pedido: fields.pedido.value.trim(),
    envio: fields.envio.value,
    direccion: fields.direccion.value.trim(),
    horario: fields.horario.value,
    total: fields.total.value,
    pago: fields.pago.value,
    estadoTransferencia: fields.estadoTransferencia.value.trim(),
    montoEfectivo: fields.montoEfectivo.value,
    montoTransferencia: fields.montoTransferencia.value,
  };
}

function readBusinessValues() {
  return {
    nombre: businessFields.nombre.value.trim(),
    telefono: businessFields.telefono.value.trim(),
    direccion: businessFields.direccion.value.trim(),
  };
}

function writeBusinessValues(values) {
  businessFields.nombre.value = values.nombre || "";
  businessFields.telefono.value = values.telefono || "";
  businessFields.direccion.value = values.direccion || "";
}

function writeFormValues(values) {
  fields.cliente.value = values.cliente || "";
  fields.telefono.value = values.telefono || "";
  fields.pedido.value = values.pedido || "";
  fields.envio.value = values.envio || (values.direccion ? "Delivery" : "");
  fields.direccion.value = values.direccion || "";
  fields.horario.value = values.horario || "";
  fields.total.value = formatAmountForInput(values.total || "");
  fields.pago.value = values.pago || "";
  fields.estadoTransferencia.value = values.estadoTransferencia || "";
  fields.montoEfectivo.value = formatAmountForInput(values.montoEfectivo || "");
  fields.montoTransferencia.value = formatAmountForInput(values.montoTransferencia || "");
  updateDeliveryAddressVisibility();
  updateTransferStatusVisibility();
  updateCombinedPaymentVisibility();
  updatePrintCopiesNotice();
}

function isDeliveryOrder(data) {
  if (data.envio) {
    return data.envio === "Delivery";
  }

  return Boolean(data.direccion);
}

function updateDeliveryAddressVisibility() {
  const isDelivery = fields.envio.value === "Delivery";
  deliveryAddressFieldEl.classList.toggle("visible", isDelivery);
  fields.direccion.required = isDelivery;

  if (!isDelivery) {
    fields.direccion.value = "";
  }
}

function updateTransferStatusVisibility() {
  const isTransfer = hasTransferComponent(fields.pago.value);
  transferStatusFieldEl.classList.toggle("visible", isTransfer);
  fields.estadoTransferencia.required = isTransfer;

  if (!isTransfer) {
    fields.estadoTransferencia.value = "";
  }
}

function updateCombinedPaymentVisibility() {
  const isCombined = isCombinedPayment(fields.pago.value);
  combinedCashFieldEl.classList.toggle("visible", isCombined);
  combinedTransferFieldEl.classList.toggle("visible", isCombined);
  fields.montoEfectivo.required = isCombined;
  fields.montoTransferencia.required = isCombined;

  if (!isCombined) {
    fields.montoEfectivo.value = "";
    fields.montoTransferencia.value = "";
  }
}

function updatePrintCopiesNotice() {
  if (!printCopiesNoticeEl) {
    return;
  }

  if (fields.pago.value === "Efectivo" || fields.pago.value === "Combinado") {
    printCopiesNoticeEl.textContent = "Se imprimirán 2 copias automáticamente";
    printCopiesNoticeEl.classList.add("visible");
    return;
  }

  if (fields.pago.value === "Transferencia") {
    printCopiesNoticeEl.textContent = "Se imprimirá 1 copia automáticamente";
    printCopiesNoticeEl.classList.add("visible");
    return;
  }

  printCopiesNoticeEl.textContent = "Seleccioná un método de pago para ver cuántas copias saldrán";
  printCopiesNoticeEl.classList.add("visible");
}

function showToast(message, isError = false, variant = "default") {
  const toast = document.createElement("div");
  toast.className = `toast${isError ? " error" : ""}${variant === "copies" ? " copies" : ""}`;
  toast.textContent = message;
  toastContainerEl.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, TOAST_DURATION_MS);
}

function setStatus(message, isError = false, withAlert = false, variant = "default") {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#991b1b" : "#065f46";
  if (withAlert && ACTION_ALERTS_ENABLED) {
    showToast(message, isError, variant);
  }
}

function setSimplePrintMode(enabled) {
  document.body.classList.toggle("simple-ticket", enabled);
  localStorage.setItem(keyFor(PROFILE_BASE_KEYS.PRINT_MODE), JSON.stringify(enabled));
}

function renderBusinessInfo(values) {
  const businessName = values.nombre || "Rotisería";
  businessPreview.nombre.textContent = businessName;
  businessPreview.telefono.textContent = `Tel: ${values.telefono || "-"}`;
  businessPreview.direccion.textContent = `Dirección: ${values.direccion || "-"}`;

  const operatorSession = getOperatorSession();
  if (!operatorSession) {
    activeRotiseriaEl.textContent = "Rotisería activa: ninguna";
    return;
  }

  activeRotiseriaEl.textContent = `Rotisería activa: ${values.nombre || activeProfileId}`;
}

function saveBusinessConfig() {
  const data = readBusinessValues();
  localStorage.setItem(keyFor(PROFILE_BASE_KEYS.BUSINESS), JSON.stringify(data));
  renderBusinessInfo(data);
  setStatus("Configuración del local guardada");
}

function resetBusinessConfig() {
  const confirmed = window.confirm("¿Querés restablecer la configuración del local?");
  if (!confirmed) {
    return;
  }

  writeBusinessValues({});
  localStorage.removeItem(keyFor(PROFILE_BASE_KEYS.BUSINESS));
  renderBusinessInfo({});
  setStatus("Configuración del local restablecida", false, true);
}

function saveDraft() {
  const data = readFormValues();
  data.total = formatAmountForInput(data.total);
  data.montoEfectivo = formatAmountForInput(data.montoEfectivo);
  data.montoTransferencia = formatAmountForInput(data.montoTransferencia);
  setSessionProfileValue(PROFILE_BASE_KEYS.DRAFT, JSON.stringify(data));
  setStatus("Borrador guardado automáticamente");
}

function renderTicket(data) {
  const shippingBadge = getShippingBadgeData(data);
  preview.numeroComanda.textContent = data.numeroComanda
    ? formatOrderNumber(data.numeroComanda)
    : "-";
  preview.fecha.textContent = data.fecha || "-";
  preview.cliente.textContent = data.cliente || "-";
  preview.telefono.textContent = data.telefono || "-";
  preview.envio.textContent = shippingBadge.label;
  preview.pedido.textContent = data.pedido || "-";
  const showAddress = isDeliveryOrder(data);
  direccionRowEl.style.display = showAddress ? "flex" : "none";
  preview.direccion.textContent = showAddress ? data.direccion || "-" : "-";
  preview.horario.textContent = data.horario || "-";
  preview.total.textContent = data.total ? money(data.total) : "-";
  preview.pago.textContent = data.pago || "-";
  const isCombined = isCombinedPayment(data.pago);
  const isTransfer = hasTransferComponent(data.pago);
  transferStatusRowEl.style.display = isTransfer ? "flex" : "none";
  preview.estadoTransferencia.textContent = isTransfer
    ? data.estadoTransferencia || "Pendiente de pago"
    : "-";
  combinedCashRowEl.style.display = isCombined ? "flex" : "none";
  combinedTransferRowEl.style.display = isCombined ? "flex" : "none";
  preview.montoEfectivo.textContent =
    isCombined && data.montoEfectivo ? money(data.montoEfectivo) : "-";
  preview.montoTransferencia.textContent =
    isCombined && data.montoTransferencia ? money(data.montoTransferencia) : "-";
  printBtn.disabled = !data.fecha;
  printTestBtn.disabled = !data.fecha;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getPrintableTicketStyles(simpleMode) {
  return `
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; color: #000; font-family: "Courier New", monospace; font-weight: bold; }
    .ticket { width: 58mm; max-width: 58mm; padding: 3mm; font-size: 12px; line-height: 1.4; font-weight: bold; }
    .ticket-header { text-align: center; margin-bottom: 4mm; border-bottom: 3px solid #000; padding-bottom: 3mm; }
    .ticket-header-title { font-size: 14px; font-weight: bold; margin: 0; text-transform: uppercase; }
    .ticket-header-subtitle { font-size: 11px; margin: 2px 0 0 0; font-weight: bold; }
    .ticket-section { margin: 3mm 0; }
    .ticket-section-divider { border-bottom: 3px solid #000; margin: 3mm 0; padding-bottom: 0; }
    .ticket-row { display: flex; justify-content: space-between; gap: 4px; padding: 3px 0; font-size: 12px; font-weight: bold; }
    .ticket-row.header { font-weight: bold; border-bottom: 1px solid #000; padding: 3px 0; margin-bottom: 2mm; }
    .ticket-row span { flex: 1; font-weight: bold; }
    .ticket-row strong { text-align: right; white-space: pre-wrap; word-break: break-word; font-weight: bold; }
    .ticket-footer { text-align: center; margin-top: 3mm; font-weight: bold; font-size: 12px; }
    .ticket-total-section { margin: 3mm 0; padding: 2mm 0; border-top: 3px solid #000; border-bottom: 3px solid #000; }
    .ticket-total-row { display: flex; justify-content: space-between; padding: 2mm 0; font-weight: bold; font-size: 13px; }
  `;
}

function buildPrintableTicketMarkup(ticket, simpleMode, isTestPrint = false) {
  const showTransferStatus = hasTransferComponent(ticket.pago);
  const showCombinedSplit = isCombinedPayment(ticket.pago);
  const shippingBadge = getShippingBadgeData(ticket);
  const showAddress = isDeliveryOrder(ticket);
  const transferStatus = showTransferStatus
    ? ticket.estadoTransferencia || "Pendiente de pago"
    : "-";

  return `
    <section class="ticket">
      <div class="ticket-header">
        <div class="ticket-header-title">${escapeHtml(businessPreview.nombre.textContent || "Rotiseria")}</div>
        <div class="ticket-header-subtitle">${escapeHtml(businessPreview.telefono.textContent || "Tel: -")}</div>
        <div class="ticket-header-subtitle">${escapeHtml(businessPreview.direccion.textContent || "")}</div>
      </div>
      <div class="ticket-section">
        <div class="ticket-row"><span>COMANDA Nº</span><strong>${escapeHtml(ticket.numeroComanda ? formatOrderNumber(ticket.numeroComanda) : "-")}</strong></div>
        <div class="ticket-row"><span>Fecha:</span><strong>${escapeHtml(ticket.fecha || "-")}</strong></div>
        <div class="ticket-row"><span>Cliente:</span><strong>${escapeHtml(ticket.cliente || "-")}</strong></div>
      </div>
      <div class="ticket-section-divider"></div>
      <div class="ticket-section">
        <div class="ticket-row"><span>Teléfono:</span><strong>${escapeHtml(ticket.telefono || "-")}</strong></div>
        <div class="ticket-row"><span>Envío:</span><strong>${escapeHtml(shippingBadge.label)}</strong></div>
        ${showAddress ? `<div class="ticket-row"><span>Dirección:</span><strong>${escapeHtml(ticket.direccion || "-")}</strong></div>` : ""}
        <div class="ticket-row"><span>Horario:</span><strong>${escapeHtml(ticket.horario || "-")}</strong></div>
      </div>
      <div class="ticket-section-divider"></div>
      <div class="ticket-section">
        <div style="font-size: 12px; font-weight: bold; white-space: pre-wrap; word-break: break-word; line-height: 1.4; padding: 1mm 0;">${escapeHtml(ticket.pedido || "-")}</div>
      </div>
      <div class="ticket-section-divider"></div>
      <div class="ticket-total-section">
        <div class="ticket-total-row">
          <span>TOTAL</span>
          <strong>${escapeHtml(ticket.total ? money(ticket.total) : "-")}</strong>
        </div>
        <div class="ticket-row"><span>Paga con:</span><strong>${escapeHtml(ticket.pago || "-")}</strong></div>
        ${showTransferStatus ? `<div class="ticket-row"><span>Estado transf.:</span><strong>${escapeHtml(transferStatus)}</strong></div>` : ""}
        ${showCombinedSplit ? `<div class="ticket-row"><span>Efectivo:</span><strong>${escapeHtml(ticket.montoEfectivo ? money(ticket.montoEfectivo) : "-")}</strong></div>` : ""}
        ${showCombinedSplit ? `<div class="ticket-row"><span>Transferencia:</span><strong>${escapeHtml(ticket.montoTransferencia ? money(ticket.montoTransferencia) : "-")}</strong></div>` : ""}
      </div>
      <div class="ticket-footer">¡GRACIAS!</div>
    </section>
  `;
}

function getPrintCopies(ticket, isTestPrint = false) {
  if (isTestPrint) {
    return 1;
  }

  return ticket.pago === "Efectivo" || ticket.pago === "Combinado" ? 2 : 1;
}

function buildPrintableTicketBody(ticket, simpleMode, isTestPrint = false, copies = 1) {
  return Array.from({ length: copies }, (_, index) => {
    const cutLine = index < copies - 1 ? '<div class="ticket-cut-line"></div>' : "";
    return `${buildPrintableTicketMarkup(ticket, simpleMode, isTestPrint)}${cutLine}`;
  }).join("");
}

function estimatePrintableTicketHeightMm(ticket, simpleMode, isTestPrint = false, copies = 1) {
  const measurementHost = document.createElement("div");
  measurementHost.style.position = "fixed";
  measurementHost.style.left = "-9999px";
  measurementHost.style.top = "0";
  measurementHost.style.visibility = "hidden";
  measurementHost.style.pointerEvents = "none";
  measurementHost.style.width = "58mm";
  measurementHost.innerHTML = `<style>${getPrintableTicketStyles(simpleMode)} .ticket-cut-line { border-top: 1px dashed #000; margin: 2mm 0; }</style>${buildPrintableTicketBody(ticket, simpleMode, isTestPrint, copies)}`;
  document.body.appendChild(measurementHost);
  const heightPx = measurementHost.scrollHeight;
  measurementHost.remove();
  const heightMm = (heightPx * 25.4) / 96;
  return Math.max(70, Math.ceil(heightMm + 6));
}

function buildPrintableTicketHtml(ticket, simpleMode, pageHeightMm, isTestPrint = false, copies = 1) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${isTestPrint ? "Impresion de prueba" : "Comanda"}</title>
    <style>
      @page { size: 58mm ${pageHeightMm}mm; margin: 0; }
      ${getPrintableTicketStyles(simpleMode)}
      .ticket-cut-line { border-top: 1px dashed #000; margin: 2mm 0; }
    </style>
  </head>
  <body>
    ${buildPrintableTicketBody(ticket, simpleMode, isTestPrint, copies)}
  </body>
</html>`;
}

function printTicketUsingFrame(ticket, isTestPrint = false) {
  const simpleMode = Boolean(simpleModeEl.checked);
  const copies = getPrintCopies(ticket, isTestPrint);
  const pageHeightMm = estimatePrintableTicketHeightMm(ticket, simpleMode, isTestPrint, copies);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");

  iframe.addEventListener("load", () => {
    const frameWindow = iframe.contentWindow;
    if (!frameWindow) {
      iframe.remove();
      setStatus("No se pudo abrir la impresion", true, true);
      return;
    }

    frameWindow.focus();
    window.setTimeout(() => {
      frameWindow.print();
      window.setTimeout(() => {
        iframe.remove();
      }, 1500);
    }, 80);
  });

  iframe.srcdoc = buildPrintableTicketHtml(ticket, simpleMode, pageHeightMm, isTestPrint, copies);
  document.body.appendChild(iframe);
}

function setTicketVisibility(visible) {
  ticketPanelEl.classList.toggle("visible", Boolean(visible));
}

function loadProfileData() {
  try {
    const businessRaw = localStorage.getItem(keyFor(PROFILE_BASE_KEYS.BUSINESS));
    if (businessRaw) {
      const businessData = JSON.parse(businessRaw);
      writeBusinessValues(businessData);
      renderBusinessInfo(businessData);
    } else {
      writeBusinessValues({});
      renderBusinessInfo({});
    }

    writeProfileAuthValues(getProfileAuth(activeProfileId));
    loadBackgroundGradient();

    writeFormValues({});
    renderTicket({});
    setTicketVisibility(false);
    historySearchEl.value = "";

    const draftRaw = getSessionProfileValue(PROFILE_BASE_KEYS.DRAFT);
    if (draftRaw) {
      writeFormValues(JSON.parse(draftRaw));
    }

    const lastTicketRaw = getSessionProfileValue(PROFILE_BASE_KEYS.LAST_TICKET);
    if (lastTicketRaw) {
      printBtn.disabled = false;
      printTestBtn.disabled = false;
    }

    const simplePrintRaw = localStorage.getItem(keyFor(PROFILE_BASE_KEYS.PRINT_MODE));
    if (simplePrintRaw) {
      const simpleEnabled = JSON.parse(simplePrintRaw);
      simpleModeEl.checked = simpleEnabled;
      setSimplePrintMode(simpleEnabled);
    } else {
      simpleModeEl.checked = false;
      document.body.classList.remove("simple-ticket");
    }

    if (!localStorage.getItem(keyFor(PROFILE_BASE_KEYS.NEXT_ORDER_NUMBER))) {
      localStorage.setItem(keyFor(PROFILE_BASE_KEYS.NEXT_ORDER_NUMBER), "1");
    }

    renderHistory();
    const operatorSession = getOperatorSession();
    if (operatorSession?.profileId === activeProfileId) {
      setStatus(`Perfil activo: ${activeProfileId}`);
    }
  } catch (error) {
    setStatus("No se pudo recuperar el respaldo local del perfil", true);
  }
}

function getPrintedTickets() {
  try {
    const raw = localStorage.getItem(keyFor(PROFILE_BASE_KEYS.PRINTED_TICKETS));
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : [];
    let changed = false;
    const normalized = items.map((item) => {
      const nextItem = { ...item };

      if (!nextItem.ticketId) {
        changed = true;
        nextItem.ticketId = generateTicketId();
      }

      if (typeof nextItem.cancelled !== "boolean") {
        changed = true;
        nextItem.cancelled = false;
      }

      if (!nextItem.originId) {
        changed = true;
        nextItem.originId = getTicketIdentity(nextItem);
      }

      return nextItem;
    });

    if (changed) {
      savePrintedTickets(normalized);
    }

    return normalized;
  } catch {
    return [];
  }
}

function savePrintedTickets(items) {
  localStorage.setItem(keyFor(PROFILE_BASE_KEYS.PRINTED_TICKETS), JSON.stringify(items));
}

function getTicketsByMonth(selectedMonth) {
  return getPrintedTickets()
    .filter((item) => monthValue(new Date(item.printedAt)) === selectedMonth)
    .sort((a, b) => new Date(b.printedAt) - new Date(a.printedAt));
}

function isSameLocalDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function getTicketIdentity(ticket) {
  if (ticket.originId) {
    return String(ticket.originId);
  }

  return [
    ticket.createdAt || "",
    ticket.numeroComanda || "",
    ticket.cliente || "",
    ticket.telefono || "",
    ticket.total || "",
  ].join("|");
}

function formatDayKey(dateInput) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderDailySummary(monthItems = []) {
  const now = new Date();
  const todayItems = getPrintedTickets().filter((item) =>
    isSameLocalDay(new Date(item.printedAt), now)
  );
  const activeToday = todayItems.filter((item) => !item.cancelled);
  const totalsToday = activeToday.reduce(
    (acc, item) => {
      const split = getPaymentBreakdown(item);
      acc.transfer += split.transfer;
      acc.cash += split.cash;
      return acc;
    },
    { transfer: 0, cash: 0 }
  );
  const totalToday = totalsToday.transfer + totalsToday.cash;
  const pendingTransfers = activeToday.filter(
    (item) => hasTransferComponent(item.pago) && item.estadoTransferencia !== "Ya pagó"
  ).length;

  const activeMonthItems = monthItems.filter((item) => !item.cancelled);
  const groupedByDay = activeMonthItems.reduce((acc, item) => {
    const dayKey = formatDayKey(item.printedAt);
    if (!acc[dayKey]) {
      acc[dayKey] = {
        date: new Date(item.printedAt),
        total: 0,
        delivery: 0,
        pickup: 0,
        transfer: 0,
        cash: 0,
      };
    }

    acc[dayKey].total += 1;
    if (isDeliveryOrder(item)) {
      acc[dayKey].delivery += 1;
    } else {
      acc[dayKey].pickup += 1;
    }

    const split = getPaymentBreakdown(item);
    acc[dayKey].transfer += split.transfer;
    acc[dayKey].cash += split.cash;

    return acc;
  }, {});

  const dayRows = Object.values(groupedByDay)
    .sort((a, b) => b.date - a.date)
    .map(
      (day) => {
        const dayTotal = day.transfer + day.cash;
        return `<div class="daily-report-item">${formatShortDate(day.date)} · ${day.total} comanda(s) · Delivery: ${day.delivery} · Retira en local: ${day.pickup} · Se hizo: ${money(dayTotal)}</div>`;
      }
    )
    .join("");

  const byDayMarkup = dayRows
    ? `<div class="daily-report-title">Por día (mes seleccionado)</div>${dayRows}`
    : '<div class="daily-report-item">Por día (mes seleccionado): sin comandas activas.</div>';

  dailyReportEl.innerHTML = `<div>Hoy: ${activeToday.length} comandas activas · Transferencias: ${money(totalsToday.transfer)} · Efectivo: ${money(totalsToday.cash)} · Total final: ${money(totalToday)} · Transferencias pendientes ${pendingTransfers}</div>${byDayMarkup}`;
}

function getPaymentBadgeData(item) {
  if (item.pago === "Combinado") {
    const paid = item.estadoTransferencia === "Ya pagó";
    return paid
      ? { label: "Combinado (transferencia paga)", className: "paid" }
      : { label: "Combinado (transferencia pendiente)", className: "pending" };
  }

  if (item.pago === "Transferencia") {
    const paid = item.estadoTransferencia === "Ya pagó";
    return paid
      ? { label: "Transferencia pagada", className: "paid" }
      : { label: "Transferencia pendiente", className: "pending" };
  }

  return { label: "Efectivo", className: "cash" };
}

function renderHistory() {
  const selectedMonth = historyMonthEl.value;
  const query = historySearchEl.value.trim().toLowerCase();
  clearHistorySearchBtn.disabled = query.length === 0;
  const monthItems = selectedMonth ? getTicketsByMonth(selectedMonth) : getPrintedTickets();
  renderDailySummary(monthItems);
  renderWeeklySummary(monthItems);
  const filtered = query
    ? monthItems.filter((item) => {
        const orderNumber = item.numeroComanda ? formatOrderNumber(item.numeroComanda) : "";
        const haystack = [
          orderNumber,
          item.cliente,
          item.telefono,
          item.envio,
          item.direccion,
          item.pedido,
          item.pago,
          item.estadoTransferencia,
          item.montoEfectivo,
          item.montoTransferencia,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
    : monthItems;
  const activeMonthItems = monthItems.filter((item) => !item.cancelled);
  const monthTotals = activeMonthItems.reduce(
    (acc, item) => {
      const split = getPaymentBreakdown(item);
      acc.transfer += split.transfer;
      acc.cash += split.cash;
      return acc;
    },
    { transfer: 0, cash: 0 }
  );
  const monthFinalTotal = monthTotals.transfer + monthTotals.cash;
  monthlyReportEl.textContent = `Ingreso del mes · Transferencias: ${money(monthTotals.transfer)} · Efectivo: ${money(monthTotals.cash)} · Total final: ${money(monthFinalTotal)}`;

  if (filtered.length === 0) {
    historySummaryEl.textContent = query
      ? "No hay coincidencias para la búsqueda en el mes seleccionado."
      : "Sin comandas impresas en el mes seleccionado.";
    historyListEl.innerHTML = "";
    return;
  }

  const activeItems = filtered.filter((item) => !item.cancelled);
  const totalMes = activeItems.reduce((sum, item) => sum + parseAmount(item.total), 0);
  historySummaryEl.textContent = `${activeItems.length} activa(s) · Mostrando ${filtered.length} de ${monthItems.length} · Total ${money(totalMes)}`;

  historyListEl.innerHTML = filtered
    .map((item) => {
      const paymentBadge = getPaymentBadgeData(item);
      const shippingBadge = getShippingBadgeData(item);

      return `
        <article class="history-item shipping-${shippingBadge.className}${item.cancelled ? " cancelled" : ""}">
          <div class="history-item-head">
            <div class="history-item-title">
              <span>${
                item.numeroComanda
                  ? `#${formatOrderNumber(item.numeroComanda)} · ${item.cliente}`
                  : item.cliente
              }</span>
              <span class="payment-badge ${paymentBadge.className}">${paymentBadge.label}</span>
              <span class="shipping-badge ${shippingBadge.className}">${shippingBadge.label}</span>
              <div class="history-actions">
                <button class="history-edit-btn" type="button" data-action="edit" data-ticket-id="${item.ticketId}">Editar</button>
                <button class="history-delete-btn" type="button" data-action="delete" data-ticket-id="${item.ticketId}">Eliminar</button>
              </div>
            </div>
            <span>${money(item.total)}</span>
          </div>
          <div class="history-item-body">
            <div>Impresa: ${formatDateTime(item.printedAt)}</div>
            <div>Tel: ${item.telefono}</div>
            <div>Envío: ${shippingBadge.label}</div>
            <div>Dirección: ${isDeliveryOrder(item) ? item.direccion || "-" : "-"}</div>
            <div>Horario: ${item.horario}</div>
            <div>Pago: ${item.pago}</div>
            <div>Estado transferencia: ${
              hasTransferComponent(item.pago)
                ? item.estadoTransferencia || "Pendiente de pago"
                : "-"
            }</div>
            <div>Efectivo (combinado): ${
              isCombinedPayment(item.pago) ? money(item.montoEfectivo || 0) : "-"
            }</div>
            <div>Transferencia (combinado): ${
              isCombinedPayment(item.pago) ? money(item.montoTransferencia || 0) : "-"
            }</div>
            <div>Estado comanda: ${item.cancelled ? "Cancelada" : "Activa"}</div>
            <div>Pedido: ${item.pedido}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function startEditingPrintedTicket(ticketId) {
  const printedItems = getPrintedTickets();
  const ticket = printedItems.find((item) => item.ticketId === ticketId);
  if (!ticket) {
    setStatus("No se encontró la comanda para editar", true, true);
    return;
  }

  editingPrintedTicketId = ticketId;
  writeFormValues(ticket);
  setTicketVisibility(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
  setStatus("Editando comanda. Presioná Generar comanda para guardar cambios.", false, true);
}

function deletePrintedTicket(ticketId) {
  const printedItems = getPrintedTickets();
  const index = printedItems.findIndex((item) => item.ticketId === ticketId);
  if (index === -1) {
    setStatus("No se encontró la comanda para eliminar", true, true);
    return;
  }

  const confirmed = window.confirm("¿Eliminar esta comanda del historial? Esta acción no se puede deshacer.");
  if (!confirmed) {
    return;
  }

  printedItems.splice(index, 1);
  savePrintedTickets(printedItems);
  renderHistory();
  setStatus("Comanda eliminada", false, true);
}

function toCsvCell(value) {
  const text = String(value ?? "").replace(/"/g, '""');
  return `"${text}"`;
}

function exportMonthToCsv() {
  const selectedMonth = historyMonthEl.value;
  const items = getTicketsByMonth(selectedMonth);

  if (items.length === 0) {
    setStatus("No hay comandas para exportar en ese mes", true, true);
    return;
  }

  const headers = [
    "numero_comanda",
    "fecha_impresion",
    "cliente",
    "telefono",
    "envio",
    "direccion",
    "horario",
    "pedido",
    "total",
    "pago",
    "monto_efectivo",
    "monto_transferencia",
    "estado_transferencia",
    "estado_comanda",
  ];

  const rows = items.map((item) => [
    item.numeroComanda || "",
    formatDateTime(item.printedAt),
    item.cliente,
    item.telefono,
    item.envio || "",
    isDeliveryOrder(item) ? item.direccion || "" : "",
    item.horario,
    item.pedido,
    String(Math.round(parseAmount(item.total))),
    item.pago,
    item.montoEfectivo || "",
    item.montoTransferencia || "",
    item.estadoTransferencia || "",
    item.cancelled ? "Cancelada" : "Activa",
  ]);

  const csvContent = [
    headers.map(toCsvCell).join(","),
    ...rows.map((row) => row.map(toCsvCell).join(",")),
  ].join("\n");

  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `comandas-${selectedMonth}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  setStatus("CSV mensual exportado correctamente", false, true);
}

function monthLabelFromValue(value) {
  const monthDate = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(monthDate.getTime())) {
    return value;
  }

  return monthDate.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
}

function buildWeeklyReportRows(items) {
  const groupedByWeek = items.reduce((acc, item) => {
    const printedDate = new Date(item.printedAt);
    const weekStart = startOfWeek(printedDate);
    const weekEnd = endOfWeek(printedDate);
    const weekKey = weekStart.toISOString().slice(0, 10);

    if (!acc[weekKey]) {
      acc[weekKey] = {
        start: weekStart,
        end: weekEnd,
        count: 0,
        total: 0,
      };
    }

    acc[weekKey].count += 1;
    acc[weekKey].total += parseAmount(item.total);
    return acc;
  }, {});

  return Object.values(groupedByWeek)
    .sort((a, b) => b.start - a.start)
    .map(
      (week) => `
        <tr>
          <td>${escapeHtml(formatShortDate(week.start))} al ${escapeHtml(formatShortDate(week.end))}</td>
          <td>${week.count}</td>
          <td>${escapeHtml(money(week.total))}</td>
        </tr>
      `
    )
    .join("");
}

function buildFinalReportHtml({
  selectedMonth,
  activeItems,
  transferTotal,
  cashTotal,
}) {
  const totalFinal = transferTotal + cashTotal;
  const weeklyRows = buildWeeklyReportRows(activeItems);
  const businessName = businessPreview.nombre.textContent || activeProfileId;
  const businessPhone = businessPreview.telefono.textContent || "Tel: -";
  const businessAddress = businessPreview.direccion.textContent || "Direccion: -";
  const monthLabel = monthLabelFromValue(selectedMonth);

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reporte final ${escapeHtml(selectedMonth)}</title>
    <style>
      @page { size: A4 portrait; margin: 12mm; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #111827; font-family: "Segoe UI", Tahoma, sans-serif; font-size: 12px; }
      .report { display: grid; gap: 10px; }
      .header h1 { margin: 0; font-size: 20px; }
      .header p { margin: 2px 0; }
      .summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
      .card { border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; }
      .card strong { display: block; font-size: 13px; margin-bottom: 2px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #d1d5db; padding: 6px; text-align: left; }
      th { background: #f3f4f6; font-weight: 700; }
      .footer { margin-top: 8px; font-size: 11px; color: #4b5563; }
    </style>
  </head>
  <body>
    <section class="report">
      <header class="header">
        <h1>Reporte final mensual</h1>
        <p><strong>Mes:</strong> ${escapeHtml(monthLabel)}</p>
        <p><strong>Rotiseria:</strong> ${escapeHtml(businessName)}</p>
        <p>${escapeHtml(businessPhone)} · ${escapeHtml(businessAddress)}</p>
      </header>

      <section class="summary">
        <div class="card">
          <strong>Resumen</strong>
          <div>Comandas: ${activeItems.length}</div>
          <div>Transferencias: ${escapeHtml(money(transferTotal))}</div>
          <div>Efectivo: ${escapeHtml(money(cashTotal))}</div>
          <div>Total final: ${escapeHtml(money(totalFinal))}</div>
        </div>
      </section>

      <section>
        <strong>Total por semana</strong>
        <table>
          <thead>
            <tr>
              <th>Semana</th>
              <th>Comandas</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${
              weeklyRows ||
              '<tr><td colspan="3">Sin comandas activas para el mes seleccionado.</td></tr>'
            }
          </tbody>
        </table>
      </section>

      <div class="footer">Emitido el ${escapeHtml(formatDateTime(new Date().toISOString()))}</div>
    </section>
  </body>
</html>`;
}

function buildFinalReportTicketContent({ selectedMonth, activeItems, transferTotal, cashTotal }) {
  const totalFinal = transferTotal + cashTotal;
  const businessName = businessPreview.nombre.textContent || activeProfileId;
  const businessPhone = businessPreview.telefono.textContent || "Tel: -";
  const businessAddress = businessPreview.direccion.textContent || "Direccion: -";
  const monthLabel = monthLabelFromValue(selectedMonth);

  const rows = activeItems
    .map((item) => {
      const date = formatShortDate(item.printedAt);
      const total = money(parseAmount(item.total));
      const payer = item.pago || "-";
      return `
        <div class="report-row">
          <div class="r-left">${escapeHtml(date)} · #${escapeHtml(formatOrderNumber(item.numeroComanda || ""))}</div>
          <div class="r-right">${escapeHtml(total)}</div>
          <div class="r-sub">${escapeHtml(item.cliente || "-")} · ${escapeHtml(payer)}</div>
        </div>
      `;
    })
    .join("");

  return `
    <section class="report">
      <header class="header">
        <div class="title">Reporte final mensual</div>
        <div class="meta">${escapeHtml(monthLabel)}</div>
        <div class="meta">${escapeHtml(businessName)}</div>
      </header>

      <section class="summary">
        <div class="summary-line"><strong>Comandas:</strong> ${activeItems.length}</div>
        <div class="summary-line"><strong>Transferencias:</strong> ${escapeHtml(money(transferTotal))}</div>
        <div class="summary-line"><strong>Efectivo:</strong> ${escapeHtml(money(cashTotal))}</div>
        <div class="summary-line"><strong>Total final:</strong> ${escapeHtml(money(totalFinal))}</div>
      </section>

      <section class="items">
        ${rows || '<div class="no-items">Sin comandas activas para el mes seleccionado.</div>'}
      </section>

      <footer class="footer">Emitido el ${escapeHtml(formatDateTime(new Date().toISOString()))}</footer>
    </section>
  `;
}

function estimateHtmlHeightMm(contentHtml) {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-9999px";
  host.style.top = "0";
  host.style.visibility = "hidden";
  host.style.pointerEvents = "none";
  host.style.width = "58mm";
  host.innerHTML = `
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; font-family: "Segoe UI", Tahoma, sans-serif; font-size: 12px; }
      .report { padding: 2mm; }
      .header .title { font-weight: 700; font-size: 14px; }
      .summary { margin-top: 6px; }
      .report-row { margin: 6px 0; }
    </style>
    ${contentHtml}
  `;
  document.body.appendChild(host);
  const heightPx = host.scrollHeight;
  host.remove();
  const heightMm = (heightPx * 25.4) / 96;
  return Math.max(60, Math.ceil(heightMm + 6));
}

function printHtmlDocument(html, onErrorMessage) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");

  iframe.addEventListener("load", () => {
    const frameWindow = iframe.contentWindow;
    if (!frameWindow) {
      iframe.remove();
      setStatus(onErrorMessage, true, true);
      return;
    }

    frameWindow.focus();
    window.setTimeout(() => {
      frameWindow.print();
      window.setTimeout(() => {
        iframe.remove();
      }, 1500);
    }, 80);
  });

  iframe.srcdoc = html;
  document.body.appendChild(iframe);
}

function printFinalReport() {
  const selectedMonth = historyMonthEl.value;
  const monthItems = selectedMonth ? getTicketsByMonth(selectedMonth) : getPrintedTickets();
  if (monthItems.length === 0) {
    setStatus("No hay comandas para imprimir en ese mes", true, true);
    return;
  }

  const activeItems = monthItems.filter((item) => !item.cancelled);
  const totals = activeItems.reduce(
    (acc, item) => {
      const split = getPaymentBreakdown(item);
      acc.transfer += split.transfer;
      acc.cash += split.cash;
      return acc;
    },
    { transfer: 0, cash: 0 }
  );

  // Generar reporte adaptado a impresora de tickets (58mm)
  const content = buildFinalReportTicketContent({
    selectedMonth,
    activeItems,
    transferTotal: totals.transfer,
    cashTotal: totals.cash,
  });

  try {
    const pageHeightMm = estimateHtmlHeightMm(content);
    const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reporte final ${escapeHtml(selectedMonth)}</title>
    <style>
      @page { size: 58mm ${pageHeightMm}mm; margin: 2mm; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #111827; font-family: "Segoe UI", Tahoma, sans-serif; font-size: 12px; }
      .report { padding: 2mm; width: 54mm; }
      .header .title { font-weight: 700; font-size: 14px; text-align: center; }
      .header .meta { font-size: 10px; text-align: center; color: #374151; }
      .summary { margin-top: 6px; font-size: 11px; }
      .summary-line { margin: 2px 0; }
      .items { margin-top: 6px; font-size: 11px; }
      .report-row { margin: 6px 0; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px; }
      .r-left { font-size: 10px; color: #374151; }
      .r-right { text-align: right; font-weight: 700; }
      .r-sub { font-size: 9px; color: #6b7280; }
      .footer { margin-top: 6px; font-size: 9px; color: #4b5563; text-align: center; }
    </style>
  </head>
  <body>
    ${content}
  </body>
</html>`;

    printHtmlDocument(html, "No se pudo abrir la impresion del reporte");
    setStatus("Reporte final enviado a impresion (formato ticket)", false, true);
  } catch (e) {
    // Fallback: imprimir versión A4
    const fallbackHtml = buildFinalReportHtml({
      selectedMonth,
      activeItems,
      transferTotal: totals.transfer,
      cashTotal: totals.cash,
    });
    printHtmlDocument(fallbackHtml, "No se pudo abrir la impresion del reporte");
    setStatus("Reporte final enviado a impresion (formato A4 - fallback)", false, true);
  }
}

function savePrintedTicket() {
  const raw = getSessionProfileValue(PROFILE_BASE_KEYS.LAST_TICKET);
  if (!raw) {
    return { status: "invalid" };
  }

  const ticket = JSON.parse(raw);
  if (!ticket.fecha) {
    return { status: "invalid" };
  }

  const printedItems = getPrintedTickets();
  const identity = getTicketIdentity(ticket);
  const alreadySaved = printedItems.some((item) => getTicketIdentity(item) === identity);
  if (alreadySaved) {
    return { status: "duplicate" };
  }

  printedItems.push({
    ...ticket,
    ticketId: generateTicketId(),
    originId: identity,
    printedAt: new Date().toISOString(),
  });

  savePrintedTickets(printedItems);
  return { status: "saved" };
}

function togglePrintedTicketCancelled(ticketId) {
  const printedItems = getPrintedTickets();
  const index = printedItems.findIndex((item) => item.ticketId === ticketId);
  if (index === -1) {
    setStatus("No se encontró la comanda", true, true);
    return;
  }

  const current = printedItems[index];
  const willCancel = !current.cancelled;

  const confirmed = window.confirm(
    willCancel
      ? "¿Marcar esta comanda como cancelada? No sumará en ingresos."
      : "¿Restaurar esta comanda como activa? Volverá a sumar en ingresos."
  );
  if (!confirmed) {
    return;
  }

  printedItems[index] = {
    ...current,
    cancelled: willCancel,
  };

  savePrintedTickets(printedItems);
  renderHistory();
  setStatus(willCancel ? "Comanda cancelada" : "Comanda restaurada", false, true);
}

function handleTotalInput() {
  const formatted = formatAmountForInput(fields.total.value);
  if (fields.total.value !== formatted) {
    fields.total.value = formatted;
  }
}

function handleCombinedAmountInput(event) {
  const field = event.target;
  if (!(field instanceof HTMLInputElement)) {
    return;
  }

  const formatted = formatAmountForInput(field.value);
  if (field.value !== formatted) {
    field.value = formatted;
  }

  calculateCombinedTransfer();
}

function calculateCombinedTransfer() {
  if (fields.pago.value !== "Combinado") {
    return;
  }

  const total = parseAmount(fields.total.value);
  const montoEfectivo = parseAmount(fields.montoEfectivo.value);

  if (total > 0 && montoEfectivo > 0 && montoEfectivo <= total) {
    const montoTransferencia = total - montoEfectivo;
    fields.montoTransferencia.value = formatAmountForInput(montoTransferencia.toString());
  }
}

function setupPasswordToggles() {
  const toggleButtons = document.querySelectorAll(".toggle-password-btn");
  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      if (!targetId) {
        return;
      }

      const input = document.getElementById(targetId);
      if (!(input instanceof HTMLInputElement)) {
        return;
      }

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.classList.toggle("is-visible", isPassword);
      button.setAttribute("aria-pressed", String(isPassword));
      button.setAttribute("aria-label", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
    });
  });
}

function isEditableElement(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  return target.matches("input, textarea, select");
}

function setupKeyboardShortcuts() {
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const target = event.target;
    const isCtrlOrMeta = event.ctrlKey || event.metaKey;

    if (event.key === "Escape") {
      event.preventDefault();
      form.reset();
      return;
    }

    if (isCtrlOrMeta && key === "p") {
      event.preventDefault();
      if (event.shiftKey) {
        printFinalReport();
      } else {
        printBtn.click();
      }
      return;
    }

    if (event.key === "Enter" && !event.shiftKey && !isCtrlOrMeta && !event.altKey) {
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.matches("textarea")) {
        return;
      }

      if (isEditableElement(target) || target.matches("button")) {
        event.preventDefault();
        form.requestSubmit();
      }
    }
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!fields.total.value.trim()) {
    setStatus("Ingresá un total válido", true, true);
    fields.total.focus();
    return;
  }

  if (fields.pago.value === "Efectivo" || fields.pago.value === "Combinado") {
    setStatus("Se imprimirán 2 copias automáticamente", false, true, "copies");
  } else if (fields.pago.value === "Transferencia") {
    setStatus("Se imprimirá 1 copia automáticamente", false, true, "copies");
  }

  if (isCombinedPayment(fields.pago.value)) {
    const cashPart = parseAmount(fields.montoEfectivo.value);
    const transferPart = parseAmount(fields.montoTransferencia.value);
    const totalAmount = parseAmount(fields.total.value);

    if (cashPart <= 0 || transferPart <= 0) {
      setStatus("En Combinado debés ingresar montos en efectivo y transferencia", true, true);
      if (cashPart <= 0) {
        fields.montoEfectivo.focus();
      } else {
        fields.montoTransferencia.focus();
      }
      return;
    }

    if (cashPart + transferPart !== totalAmount) {
      setStatus("La suma de efectivo y transferencia debe coincidir con el total", true, true);
      fields.montoEfectivo.focus();
      return;
    }
  }

  if (hasTransferComponent(fields.pago.value) && !fields.estadoTransferencia.value.trim()) {
    setStatus("Completá el estado de transferencia", true, true);
    fields.estadoTransferencia.focus();
    return;
  }

  const formData = readFormValues();

  if (editingPrintedTicketId) {
    const printedItems = getPrintedTickets();
    const index = printedItems.findIndex((item) => item.ticketId === editingPrintedTicketId);

    if (index === -1) {
      editingPrintedTicketId = null;
      setStatus("No se encontró la comanda a editar", true, true);
      return;
    }

    const current = printedItems[index];
    const updatedTicket = {
      ...current,
      ...formData,
      originId: current.originId || getTicketIdentity(current),
    };

    printedItems[index] = updatedTicket;
    savePrintedTickets(printedItems);
    setSessionProfileValue(PROFILE_BASE_KEYS.LAST_TICKET, JSON.stringify(updatedTicket));
    editingPrintedTicketId = null;
    printBtn.disabled = false;
    printTestBtn.disabled = false;
    setTicketVisibility(false);
    renderHistory();
    setStatus("Comanda actualizada", false, true);
    return;
  }

  const ticketData = {
    ...formData,
    numeroComanda: getNextOrderNumber(),
    fecha: fechaActual(),
    createdAt: new Date().toISOString(),
  };

  setSessionProfileValue(PROFILE_BASE_KEYS.LAST_TICKET, JSON.stringify(ticketData));
  saveDraft();
  setTicketVisibility(false);
  printBtn.disabled = false;
  printTestBtn.disabled = false;
  setStatus("Comanda generada. Se mostrará al imprimir.", false, true);
});

printBtn.addEventListener("click", () => {
  const raw = getSessionProfileValue(PROFILE_BASE_KEYS.LAST_TICKET);
  if (!raw) {
    setStatus("Primero generá una comanda", true, true);
    return;
  }

  const ticket = JSON.parse(raw);
  if (!ticket.fecha) {
    setStatus("La comanda no es válida para imprimir", true, true);
    return;
  }

  renderTicket(ticket);
  setTicketVisibility(true);
  const saveResult = savePrintedTicket();
  if (saveResult.status === "saved") {
    renderHistory();
    setStatus("Comanda impresa y guardada en historial mensual", false, true);
  } else if (saveResult.status === "duplicate") {
    setStatus("Comanda ya guardada en historial. Se imprime sin duplicar registro.", false, true);
  }
  printTicketUsingFrame(ticket, false);
});

printTestBtn.addEventListener("click", () => {
  const raw = getSessionProfileValue(PROFILE_BASE_KEYS.LAST_TICKET);
  if (!raw) {
    setStatus("Primero genera una comanda", true, true);
    return;
  }

  const ticket = JSON.parse(raw);
  if (!ticket.fecha) {
    setStatus("La comanda no es valida para imprimir", true, true);
    return;
  }

  printTicketUsingFrame(ticket, true);
  setStatus("Impresion de prueba enviada", false, true);
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    editingPrintedTicketId = null;
    updateDeliveryAddressVisibility();
    updateTransferStatusVisibility();
    updateCombinedPaymentVisibility();
    updatePrintCopiesNotice();
    renderTicket({});
    setTicketVisibility(false);
    removeSessionProfileValue(PROFILE_BASE_KEYS.DRAFT);
    setStatus("Formulario limpio", false, true);
  }, 0);
});

Object.values(fields).forEach((field) => {
  field.addEventListener("input", saveDraft);
  field.addEventListener("change", saveDraft);
});

Object.values(businessFields).forEach((field) => {
  field.addEventListener("input", saveBusinessConfig);
  field.addEventListener("change", saveBusinessConfig);
});

bgColorStartEl.addEventListener("input", () => {
  const values = readBackgroundGradientValues();
  applyBackgroundGradient(values.start, values.end);
});
bgColorEndEl.addEventListener("input", () => {
  const values = readBackgroundGradientValues();
  applyBackgroundGradient(values.start, values.end);
});
bgColorStartEl.addEventListener("change", () => saveBackgroundGradient(false));
bgColorEndEl.addEventListener("change", () => saveBackgroundGradient(false));
resetBackgroundBtn.addEventListener("click", resetBackgroundGradient);

fields.total.addEventListener("input", handleTotalInput);
fields.total.addEventListener("blur", handleTotalInput);
fields.total.addEventListener("input", calculateCombinedTransfer);
fields.total.addEventListener("blur", calculateCombinedTransfer);
fields.montoEfectivo.addEventListener("input", handleCombinedAmountInput);
fields.montoEfectivo.addEventListener("blur", handleCombinedAmountInput);
fields.montoTransferencia.addEventListener("input", handleCombinedAmountInput);
fields.montoTransferencia.addEventListener("blur", handleCombinedAmountInput);
fields.envio.addEventListener("change", updateDeliveryAddressVisibility);
fields.pago.addEventListener("change", () => {
  updateTransferStatusVisibility();
  updateCombinedPaymentVisibility();
  updatePrintCopiesNotice();
  calculateCombinedTransfer();
});

simpleModeEl.addEventListener("change", () => {
  setSimplePrintMode(simpleModeEl.checked);
  setStatus(
    simpleModeEl.checked
      ? "Modo Ticket simple activado"
      : "Modo Ticket simple desactivado"
  );
});

historyMonthEl.addEventListener("change", renderHistory);
historySearchEl.addEventListener("input", renderHistory);
clearHistorySearchBtn.addEventListener("click", () => {
  if (!historySearchEl.value) {
    return;
  }

  historySearchEl.value = "";
  renderHistory();
  historySearchEl.focus();
});
historyListEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const ticketId = target.getAttribute("data-ticket-id");
  if (!ticketId) {
    return;
  }

  const action = target.getAttribute("data-action");
  if (action === "edit") {
    startEditingPrintedTicket(ticketId);
    return;
  }

  if (action === "delete") {
    deletePrintedTicket(ticketId);
  }
});
exportCsvBtn.addEventListener("click", exportMonthToCsv);
printReportBtn.addEventListener("click", printFinalReport);
resetBusinessBtn.addEventListener("click", resetBusinessConfig);
profileSelectEl.addEventListener("change", () => {
  setActiveProfile(profileSelectEl.value);
  loadProfileData();
});
addProfileBtn.addEventListener("click", () => {
  if (!requireAdminSession()) {
    return;
  }

  const input = window.prompt("Nombre corto del perfil (ej: don-pepe):", "");
  if (!input) {
    return;
  }

  const newProfile = sanitizeProfileId(input);
  const profiles = getProfiles();
  if (profiles.includes(newProfile)) {
    setStatus("Ese perfil ya existe", true, true);
    return;
  }

  const updated = [...profiles, newProfile];
  saveProfiles(updated);
  localStorage.setItem(
    `${STORAGE_PREFIX}.${newProfile}.${PROFILE_BASE_KEYS.AUTH}`,
    JSON.stringify({ username: "", password: "" })
  );
  setActiveProfile(newProfile);
  loadProfileData();
  setStatus(`Perfil creado: ${newProfile}`, false, true);
});

deleteProfileBtn.addEventListener("click", () => {
  if (!requireAdminSession()) {
    return;
  }

  const profileToDelete = profileSelectEl.value;
  if (profileToDelete === PROFILE_DEFAULT) {
    setStatus("No se puede eliminar el perfil principal", true, true);
    return;
  }

  const profiles = getProfiles();
  if (!profiles.includes(profileToDelete)) {
    setStatus("El perfil no existe", true, true);
    return;
  }

  const confirmed = window.confirm(
    `¿Querés eliminar el perfil \"${profileToDelete}\"? Esta acción borra su configuración e historial.`
  );
  if (!confirmed) {
    return;
  }

  const updatedProfiles = profiles.filter((profile) => profile !== profileToDelete);
  saveProfiles(updatedProfiles);
  clearProfileData(profileToDelete);
  setOperatorSession(null);

  const nextProfile = updatedProfiles.includes(PROFILE_DEFAULT)
    ? PROFILE_DEFAULT
    : updatedProfiles[0] || PROFILE_DEFAULT;

  setActiveProfile(nextProfile);
  loadProfileData();
  setStatus(`Perfil eliminado: ${profileToDelete}`, false, true);
});
adminLoginBtn.addEventListener("click", handleAdminLogin);
adminLogoutBtn.addEventListener("click", () => {
  setAdminSession(false);
  setStatus("Sesión admin cerrada", false, true);
});
adminPasswordEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAdminLogin();
  }
});
operatorLoginBtn.addEventListener("click", handleOperatorLogin);
operatorLogoutBtn.addEventListener("click", handleOperatorLogout);
quickLogoutBtn.addEventListener("click", handleQuickLogout);
operatorPasswordEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleOperatorLogin();
  }
});
operatorRememberUserEl.addEventListener("change", () => {
  if (operatorRememberUserEl.checked) {
    setStatus("Se recordará solo el usuario en este dispositivo", false, true);
  } else {
    clearRememberedOperatorUser();
    setStatus("Usuario recordado eliminado", false, true);
  }
});
saveProfileAuthBtn.addEventListener("click", saveCurrentProfileAuth);
exportProfileBackupBtn.addEventListener("click", exportProfileBackup);
importProfileBackupBtn.addEventListener("click", () => {
  if (!requireAdminSession()) {
    return;
  }
  importProfileBackupFile.click();
});
importProfileBackupFile.addEventListener("change", () => {
  const file = importProfileBackupFile.files?.[0];
  importProfileBackupFromFile(file);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      setStatus("Auto guardado activo (sin modo offline)", true);
    });
  });
}

historyMonthEl.value = monthValue(new Date());
setupProfiles();
setAdminSession(isAdminSessionActive());
bindAdminActivityTracking();
const rememberedOperatorUser = getRememberedOperatorUser();
if (rememberedOperatorUser) {
  operatorUserEl.value = rememberedOperatorUser;
  operatorRememberUserEl.checked = true;
}
const existingOperatorSession = getOperatorSession();
if (existingOperatorSession) {
  const auth = getProfileAuth(existingOperatorSession.profileId);
  if (auth.username === existingOperatorSession.username) {
    setActiveProfile(existingOperatorSession.profileId);
    setOperatorSession(existingOperatorSession);
    loadProfileData();
  } else {
    setOperatorSession(null);
    loadProfileData();
  }
} else {
  setOperatorSession(null);
  loadProfileData();
}
appVersionEl.textContent = `Versión activa: ${APP_VERSION}`;
setupPasswordToggles();
setupKeyboardShortcuts();
