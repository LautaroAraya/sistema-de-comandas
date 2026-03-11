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
const dailyReportEl = document.getElementById("daily-report");
const exportCsvBtn = document.getElementById("export-csv-btn");
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
  direccion: document.getElementById("direccion"),
  horario: document.getElementById("horario"),
  total: document.getElementById("total"),
  pago: document.getElementById("pago"),
  estadoTransferencia: document.getElementById("estado-transferencia"),
};

const preview = {
  numeroComanda: document.getElementById("v-numero-comanda"),
  fecha: document.getElementById("v-fecha"),
  cliente: document.getElementById("v-cliente"),
  telefono: document.getElementById("v-telefono"),
  pedido: document.getElementById("v-pedido"),
  direccion: document.getElementById("v-direccion"),
  horario: document.getElementById("v-horario"),
  total: document.getElementById("v-total"),
  pago: document.getElementById("v-pago"),
  estadoTransferencia: document.getElementById("v-estado-transferencia"),
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
    minimumFractionDigits: 2,
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
    direccion: fields.direccion.value.trim(),
    horario: fields.horario.value,
    total: fields.total.value,
    pago: fields.pago.value,
    estadoTransferencia: fields.estadoTransferencia.value.trim(),
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
  fields.direccion.value = values.direccion || "";
  fields.horario.value = values.horario || "";
  fields.total.value = formatAmountForInput(values.total || "");
  fields.pago.value = values.pago || "";
  fields.estadoTransferencia.value = values.estadoTransferencia || "";
  updateTransferStatusVisibility();
}

function updateTransferStatusVisibility() {
  const isTransfer = fields.pago.value === "Transferencia";
  transferStatusFieldEl.classList.toggle("visible", isTransfer);
  fields.estadoTransferencia.required = isTransfer;

  if (!isTransfer) {
    fields.estadoTransferencia.value = "";
  }
}

function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.className = `toast${isError ? " error" : ""}`;
  toast.textContent = message;
  toastContainerEl.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, TOAST_DURATION_MS);
}

function setStatus(message, isError = false, withAlert = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#991b1b" : "#065f46";
  if (withAlert && ACTION_ALERTS_ENABLED) {
    showToast(message, isError);
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
  localStorage.setItem(keyFor(PROFILE_BASE_KEYS.DRAFT), JSON.stringify(data));
  setStatus("Borrador guardado automáticamente");
}

function renderTicket(data) {
  preview.numeroComanda.textContent = data.numeroComanda
    ? formatOrderNumber(data.numeroComanda)
    : "-";
  preview.fecha.textContent = data.fecha || "-";
  preview.cliente.textContent = data.cliente || "-";
  preview.telefono.textContent = data.telefono || "-";
  preview.pedido.textContent = data.pedido || "-";
  preview.direccion.textContent = data.direccion || "-";
  preview.horario.textContent = data.horario || "-";
  preview.total.textContent = data.total ? money(data.total) : "-";
  preview.pago.textContent = data.pago || "-";
  const isTransfer = data.pago === "Transferencia";
  transferStatusRowEl.style.display = isTransfer ? "flex" : "none";
  preview.estadoTransferencia.textContent = isTransfer
    ? data.estadoTransferencia || "Pendiente de pago"
    : "-";
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
    html, body { margin: 0; padding: 0; background: #fff; color: #000; font-family: "Segoe UI", Tahoma, sans-serif; }
    .ticket { width: 58mm; max-width: 58mm; padding: ${simpleMode ? "1.5mm" : "2mm"}; font-size: ${simpleMode ? "10px" : "11px"}; line-height: ${simpleMode ? "1.15" : "1.25"}; }
    .ticket h2 { margin: ${simpleMode ? "0 0 2px" : "0 0 4px"}; padding-bottom: ${simpleMode ? "2px" : "0"}; text-align: ${simpleMode ? "center" : "left"}; font-size: ${simpleMode ? "12px" : "14px"}; border-bottom: ${simpleMode ? "1px dashed #000" : "none"}; }
    .ticket-business { border-bottom: 1px dashed #000; padding-bottom: ${simpleMode ? "2px" : "4px"}; margin-bottom: ${simpleMode ? "2px" : "4px"}; display: grid; gap: 2px; }
    .ticket-business strong { font-size: ${simpleMode ? "11px" : "12px"}; }
    .ticket-business div { font-size: ${simpleMode ? "9px" : "10px"}; }
    .ticket-row { display: flex; justify-content: space-between; gap: 6px; padding: ${simpleMode ? "1px 0" : "2px 0"}; }
    .ticket-row span { color: #333; }
    .ticket-row strong { text-align: right; white-space: pre-wrap; word-break: break-word; }
    .ticket-row.align-start { align-items: flex-start; }
  `;
}

function buildPrintableTicketMarkup(ticket, simpleMode, isTestPrint = false) {
  const showTransferStatus = ticket.pago === "Transferencia";
  const transferStatus = showTransferStatus
    ? ticket.estadoTransferencia || "Pendiente de pago"
    : "-";

  return `
    <section class="ticket">
      <h2>${isTestPrint ? "Comanda - Prueba" : "Comanda"}</h2>
      <div class="ticket-business">
        <strong>${escapeHtml(businessPreview.nombre.textContent || "Rotiseria")}</strong>
        <div>${escapeHtml(businessPreview.telefono.textContent || "Tel: -")}</div>
        <div>${escapeHtml(businessPreview.direccion.textContent || "Direccion: -")}</div>
      </div>
      <div class="ticket-row"><span>N comanda:</span><strong>${escapeHtml(ticket.numeroComanda ? formatOrderNumber(ticket.numeroComanda) : "-")}</strong></div>
      <div class="ticket-row"><span>Fecha:</span><strong>${escapeHtml(ticket.fecha || "-")}</strong></div>
      <div class="ticket-row"><span>Cliente:</span><strong>${escapeHtml(ticket.cliente || "-")}</strong></div>
      <div class="ticket-row"><span>Telefono:</span><strong>${escapeHtml(ticket.telefono || "-")}</strong></div>
      <div class="ticket-row"><span>Direccion:</span><strong>${escapeHtml(ticket.direccion || "-")}</strong></div>
      <div class="ticket-row"><span>Horario:</span><strong>${escapeHtml(ticket.horario || "-")}</strong></div>
      <div class="ticket-row align-start"><span>Pedido:</span><strong>${escapeHtml(ticket.pedido || "-")}</strong></div>
      <div class="ticket-row"><span>Total:</span><strong>${escapeHtml(ticket.total ? money(ticket.total) : "-")}</strong></div>
      <div class="ticket-row"><span>Paga con:</span><strong>${escapeHtml(ticket.pago || "-")}</strong></div>
      ${showTransferStatus ? `<div class="ticket-row"><span>Estado transf.:</span><strong>${escapeHtml(transferStatus)}</strong></div>` : ""}
    </section>
  `;
}

function estimatePrintableTicketHeightMm(ticket, simpleMode, isTestPrint = false) {
  const measurementHost = document.createElement("div");
  measurementHost.style.position = "fixed";
  measurementHost.style.left = "-9999px";
  measurementHost.style.top = "0";
  measurementHost.style.visibility = "hidden";
  measurementHost.style.pointerEvents = "none";
  measurementHost.style.width = "58mm";
  measurementHost.innerHTML = `<style>${getPrintableTicketStyles(simpleMode)}</style>${buildPrintableTicketMarkup(ticket, simpleMode, isTestPrint)}`;
  document.body.appendChild(measurementHost);
  const heightPx = measurementHost.scrollHeight;
  measurementHost.remove();
  const heightMm = (heightPx * 25.4) / 96;
  return Math.max(70, Math.ceil(heightMm + 6));
}

function buildPrintableTicketHtml(ticket, simpleMode, pageHeightMm, isTestPrint = false) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${isTestPrint ? "Impresion de prueba" : "Comanda"}</title>
    <style>
      @page { size: 58mm ${pageHeightMm}mm; margin: 0; }
      ${getPrintableTicketStyles(simpleMode)}
    </style>
  </head>
  <body>
    ${buildPrintableTicketMarkup(ticket, simpleMode, isTestPrint)}
  </body>
</html>`;
}

function printTicketUsingFrame(ticket, isTestPrint = false) {
  const simpleMode = Boolean(simpleModeEl.checked);
  const pageHeightMm = estimatePrintableTicketHeightMm(ticket, simpleMode, isTestPrint);
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

  iframe.srcdoc = buildPrintableTicketHtml(ticket, simpleMode, pageHeightMm, isTestPrint);
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

    const draftRaw = localStorage.getItem(keyFor(PROFILE_BASE_KEYS.DRAFT));
    if (draftRaw) {
      writeFormValues(JSON.parse(draftRaw));
    }

    const lastTicketRaw = localStorage.getItem(keyFor(PROFILE_BASE_KEYS.LAST_TICKET));
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

function renderDailySummary() {
  const now = new Date();
  const todayItems = getPrintedTickets().filter((item) =>
    isSameLocalDay(new Date(item.printedAt), now)
  );
  const activeToday = todayItems.filter((item) => !item.cancelled);
  const totalToday = activeToday.reduce((sum, item) => sum + parseAmount(item.total), 0);
  const pendingTransfers = activeToday.filter(
    (item) => item.pago === "Transferencia" && item.estadoTransferencia !== "Ya pagó"
  ).length;

  dailyReportEl.textContent = `Hoy: ${activeToday.length} comandas activas · Ventas ${money(totalToday)} · Transferencias pendientes ${pendingTransfers}`;
}

function getPaymentBadgeData(item) {
  if (item.pago === "Transferencia") {
    const paid = item.estadoTransferencia === "Ya pagó";
    return paid
      ? { label: "Transferencia pagada", className: "paid" }
      : { label: "Transferencia pendiente", className: "pending" };
  }

  return { label: "Efectivo", className: "cash" };
}

function renderHistory() {
  renderDailySummary();
  const selectedMonth = historyMonthEl.value;
  const query = historySearchEl.value.trim().toLowerCase();
  clearHistorySearchBtn.disabled = query.length === 0;
  const monthItems = getTicketsByMonth(selectedMonth);
  const filtered = query
    ? monthItems.filter((item) => {
        const orderNumber = item.numeroComanda ? formatOrderNumber(item.numeroComanda) : "";
        const haystack = [
          orderNumber,
          item.cliente,
          item.telefono,
          item.direccion,
          item.pedido,
          item.pago,
          item.estadoTransferencia,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
    : monthItems;
  const monthTotal = monthItems
    .filter((item) => !item.cancelled)
    .reduce((sum, item) => sum + parseAmount(item.total), 0);
  monthlyReportEl.textContent = `Ingreso de ventas del mes: ${money(monthTotal)}`;

  if (filtered.length === 0) {
    historySummaryEl.textContent = query
      ? "No hay coincidencias para la búsqueda en el mes seleccionado."
      : "Sin comandas impresas en el mes seleccionado.";
    historyListEl.innerHTML = "";
    return;
  }

  const activeItems = filtered.filter((item) => !item.cancelled);
  const cancelledItems = filtered.filter((item) => item.cancelled);
  const totalMes = activeItems.reduce((sum, item) => sum + parseAmount(item.total), 0);
  historySummaryEl.textContent = `${activeItems.length} activa(s), ${cancelledItems.length} cancelada(s) · Mostrando ${filtered.length} de ${monthItems.length} · Total ${money(totalMes)}`;

  historyListEl.innerHTML = filtered
    .map((item) => {
      const paymentBadge = getPaymentBadgeData(item);

      return `
        <article class="history-item${item.cancelled ? " cancelled" : ""}">
          <div class="history-item-head">
            <div class="history-item-title">
              <span>${
                item.numeroComanda
                  ? `#${formatOrderNumber(item.numeroComanda)} · ${item.cliente}`
                  : item.cliente
              }</span>
              <span class="payment-badge ${paymentBadge.className}">${paymentBadge.label}</span>
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
            <div>Dirección: ${item.direccion}</div>
            <div>Horario: ${item.horario}</div>
            <div>Pago: ${item.pago}</div>
            <div>Estado transferencia: ${
              item.pago === "Transferencia"
                ? item.estadoTransferencia || "Pendiente de pago"
                : "-"
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
    "direccion",
    "horario",
    "pedido",
    "total",
    "pago",
    "estado_transferencia",
    "estado_comanda",
  ];

  const rows = items.map((item) => [
    item.numeroComanda || "",
    formatDateTime(item.printedAt),
    item.cliente,
    item.telefono,
    item.direccion,
    item.horario,
    item.pedido,
    parseAmount(item.total).toFixed(2),
    item.pago,
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

function savePrintedTicket() {
  const raw = localStorage.getItem(keyFor(PROFILE_BASE_KEYS.LAST_TICKET));
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

  if (fields.pago.value === "Transferencia" && !fields.estadoTransferencia.value.trim()) {
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
    localStorage.setItem(keyFor(PROFILE_BASE_KEYS.LAST_TICKET), JSON.stringify(updatedTicket));
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

  localStorage.setItem(keyFor(PROFILE_BASE_KEYS.LAST_TICKET), JSON.stringify(ticketData));
  saveDraft();
  setTicketVisibility(false);
  printBtn.disabled = false;
  printTestBtn.disabled = false;
  setStatus("Comanda generada. Se mostrará al imprimir.", false, true);
});

printBtn.addEventListener("click", () => {
  const raw = localStorage.getItem(keyFor(PROFILE_BASE_KEYS.LAST_TICKET));
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
  const raw = localStorage.getItem(keyFor(PROFILE_BASE_KEYS.LAST_TICKET));
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
    renderTicket({});
    setTicketVisibility(false);
    localStorage.removeItem(keyFor(PROFILE_BASE_KEYS.DRAFT));
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
fields.pago.addEventListener("change", updateTransferStatusVisibility);

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
