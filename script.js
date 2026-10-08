const STORAGE_KEY = "bulk-builder-save-v1";

const SKINS = [
  { id: "beach", label: "Beach", folder: "Beach Skin", maxWeight: 800, difficulty: "easy" },
  { id: "camila", label: "Camila", folder: "Camila skin", maxWeight: 1100, difficulty: "medium" },
  { id: "camila-alt", label: "Camila Alt", folder: "Camila skin/Alt Skin skin", maxWeight: 1000, difficulty: "easy" },
  { id: "catgirl", label: "Cat Girl", folder: "Cat girl skin", maxWeight: 650, difficulty: "easy" },
  { id: "christmas", label: "Christmas", folder: "Chrismas skin", maxWeight: 325, difficulty: "easy" },
  { id: "eating", label: "Eating", folder: "Eating Skin", maxWeight: 625, difficulty: "medium" },
  { id: "endurance", label: "Endurance", folder: "Endurance skin", maxWeight: 1500, difficulty: "hard" },
  { id: "extreme", label: "Extreme Weight Gain", folder: "Extreme Weight Gain", maxWeight: 2250, difficulty: "hard" },
  { id: "few-pounds", label: "Few Pounds", folder: "Few pounds skin", maxWeight: 1750, difficulty: "hard" },
  { id: "gym", label: "Gym", folder: "Gym skin", maxWeight: 625, difficulty: "medium" },
  { id: "kitagawa", label: "Kitagawa", folder: "Kitagawa skin", maxWeight: 1700, difficulty: "hard" },
  { id: "komi", label: "Komi", folder: "Komi skin", maxWeight: 450, difficulty: "easy" },
  { id: "main", label: "Main", folder: "Main Skin", maxWeight: 4000, difficulty: "hard" },
  { id: "mercy", label: "Mercy", folder: "Mercy skin", maxWeight: 550, difficulty: "easy" },
  { id: "ramen", label: "Ramen", folder: "Ramen skin", maxWeight: 650, difficulty: "medium" },
  { id: "resort-a", label: "Resort A", folder: "Resort A skin", maxWeight: 5000, difficulty: "hard" },
  { id: "resort-c", label: "Resort C", folder: "Resort C skin", maxWeight: 7000, difficulty: "hard" },
  { id: "runner", label: "Runner Blobfication", folder: "Runner Blobfication skin", maxWeight: 15000, difficulty: "hard" },
];

const STAGE_COUNTS = {
  "Beach Skin": 9,
  "Camila skin": 3,
  "Camila skin/Alt Skin skin": 5,
  "Cat girl skin": 3,
  "Chrismas skin": 13,
  "Eating Skin": 10,
  "Endurance skin": 6,
  "Extreme Weight Gain": 12,
  "Few pounds skin": 5,
  "Gym skin": 10,
  "Kitagawa skin": 9,
  "Komi skin": 3,
  "Main Skin": 20,
  "Mercy skin": 3,
  "Ramen skin": 3,
  "Resort A skin": 22,
  "Resort C skin": 23,
  "Runner Blobfication skin": 13,
};

const REBIRTH_UPGRADES = [
  { id: "rb-click", label: "Tap Power", icon: "🔆", cost: 1, description: "+2 per tap per level" },
  { id: "rb-auto", label: "Auto Gain", icon: "⚙️", cost: 1, description: "+1/s per level" },
  { id: "rb-calorie", label: "Calorie Boost", icon: "🔐", cost: 2, description: "+5% calories per level" },
  { id: "rb-weight", label: "Weight Gain", icon: "👕", cost: 3, description: "+8% weight gain per level" },
  { id: "rb-prestige", label: "Prestige Bonus", icon: "✨", cost: 5, description: "+10% all gains per level" },
];

const upgradeCatalog = [
  { id: "protein", icon: "🥤", name: "Protein Shake", description: "+6 per tap", baseCost: 50, type: "click", value: 6 },
  { id: "snacks", icon: "🍟", name: "Snack Pack", description: "+18 per tap", baseCost: 220, type: "click", value: 18 },
  { id: "buffet", icon: "🍔", name: "Buffet Pass", description: "+60 per tap", baseCost: 900, type: "click", value: 60 },
  { id: "rest", icon: "😴", name: "Recovery Mode", description: "+4 calories/s", baseCost: 1200, type: "auto", value: 4 },
  { id: "coach", icon: "🏋️", name: "Gains Coach", description: "+12 calories/s", baseCost: 4200, type: "auto", value: 12 },
  { id: "bulk", icon: "💪", name: "Bulk Cycle", description: "+45 calories/s", baseCost: 15000, type: "auto", value: 45 },
];

const defaultState = {
  weight: 180,
  calories: 0,
  perClick: 10,
  autoGain: 0,
  selectedSkinId: "main",
  goalWeight: 250,
  upgrades: { protein: 0, snacks: 0, buffet: 0, rest: 0, coach: 0, bulk: 0 },
  rebirths: 0,
  rebirthUpgrades: { "rb-click": 0, "rb-auto": 0, "rb-calorie": 0, "rb-weight": 0, "rb-prestige": 0 },
  totalCaloriesEarned: 0,
};

const state = loadState();
const selectedSkin = () => SKINS.find((skin) => skin.id === state.selectedSkinId) || SKINS[0];

const els = {
  eatButton: document.getElementById("eatButton"),
  caloriesValue: document.getElementById("caloriesValue"),
  tapValue: document.getElementById("tapValue"),
  autoValue: document.getElementById("autoValue"),
  weightValue: document.getElementById("weightValue"),
  goalText: document.getElementById("goalText"),
  tapGain: document.getElementById("tapGain"),
  progressFill: document.getElementById("progressFill"),
  goalLabel: document.getElementById("goalLabel"),
  statusText: document.getElementById("statusText"),
  shopList: document.getElementById("shopList"),
  resetBtn: document.getElementById("resetBtn"),
  rebirthBtn: document.getElementById("rebirthBtn"),
  rebirthCount: document.getElementById("rebirthCount"),
  rebirthReward: document.getElementById("rebirthReward"),
  rebirthUpgradeBtns: document.getElementById("rebirthUpgradeBtns"),
  skinSelector: document.getElementById("skinSelector"),
  skinImage: document.getElementById("skinImage"),
  skinMeta: document.getElementById("skinMeta"),
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      upgrades: { ...defaultState.upgrades, ...(parsed.upgrades || {}) },
      rebirthUpgrades: { ...defaultState.rebirthUpgrades, ...(parsed.rebirthUpgrades || {}) },
    };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Ignore storage errors.
  }
}

function formatNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${Math.floor(value)}`;
}

function formatWeight(value) {
  return `${value.toFixed(1)} lb`;
}

function calculateUpgradeCost(item) {
  const level = state.upgrades[item.id] || 0;
  return Math.floor(item.baseCost * Math.pow(1.25, level));
}

function getUpgradeValue(item) {
  return (state.upgrades[item.id] || 0) * item.value;
}

function calculateRebirthReward() {
  const skin = selectedSkin();
  const progress = Math.min(Math.max(state.weight / skin.maxWeight, 0), 1);
  const prestigeBonus = state.rebirthUpgrades["rb-prestige"] || 0;
  return Math.floor((progress * 150 + state.rebirths * 25) * (1 + prestigeBonus * 0.1));
}

function canRebirth() {
  const skin = selectedSkin();
  return state.weight >= skin.maxWeight * 0.5;
}

function performRebirth() {
  if (!canRebirth()) {
    els.statusText.textContent = "Need 50% max weight to rebirth";
    return;
  }

  const reward = calculateRebirthReward();
  state.rebirths += 1;
  state.totalCaloriesEarned += reward;

  const clickBonus = (state.rebirthUpgrades["rb-click"] || 0) * 2;
  const autoBonus = (state.rebirthUpgrades["rb-auto"] || 0) * 1;
  const calorieBonus = (state.rebirthUpgrades["rb-calorie"] || 0) * 0.05;

  state.perClick = 10 + clickBonus;
  state.autoGain = autoBonus;
  state.weight = 180;
  state.calories = Math.max(0, Math.floor(state.calories * (1 + calorieBonus)));

  Object.keys(state.upgrades).forEach((key) => {
    state.upgrades[key] = 0;
  });

  render();
  saveState();
  els.statusText.textContent = `Rebirth! Gained ${reward} prestige points!`;
}

function buyRebirthUpgrade(id) {
  const upgrade = REBIRTH_UPGRADES.find((u) => u.id === id);
  if (!upgrade) return;

  if (state.totalCaloriesEarned < upgrade.cost) {
    els.statusText.textContent = `Need ${upgrade.cost} prestige points`;
    return;
  }

  state.totalCaloriesEarned -= upgrade.cost;
  state.rebirthUpgrades[id] = (state.rebirthUpgrades[id] || 0) + 1;

  render();
  saveState();
  els.statusText.textContent = `Upgraded ${upgrade.label}!`;
}

function updateAutoGain() {
  let totalAuto = 0;
  upgradeCatalog.forEach((item) => {
    if (item.type === "auto") totalAuto += getUpgradeValue(item);
  });
  totalAuto += state.rebirthUpgrades["rb-auto"] || 0;
  state.autoGain = totalAuto;
}

function getStageCountForSkin(skinFolder) {
  return STAGE_COUNTS[skinFolder] || 1;
}

function getDifficultyCurve() {
  const skin = selectedSkin();
  const curveMap = { easy: 0.25, medium: 0.35, hard: 0.45 };
  return (curveMap[skin.difficulty] || 0.35) + Math.min(skin.maxWeight / 20000, 0.25);
}

function getCurrentStageIndex() {
  const skin = selectedSkin();
  if (!skin) return 0;

  const stageCount = getStageCountForSkin(skin.folder);
  if (stageCount <= 1) return 0;

  const currentWeight = Math.max(state.weight, 0);
  const normalizedProgress = Math.min(Math.max(currentWeight / skin.maxWeight, 0), 1);
  const scaledProgress = Math.pow(normalizedProgress, getDifficultyCurve());
  const stageIndex = Math.floor(scaledProgress * (stageCount - 1));

  return Math.min(Math.max(stageIndex, 0), stageCount - 1);
}

function updateSkinImage() {
  const skin = selectedSkin();
  const stageIndex = getCurrentStageIndex();
  const stage = stageIndex + 1;
  const stageCount = getStageCountForSkin(skin.folder);

  const imageFolder = skin.folder.split("/").map((part) => encodeURIComponent(part)).join("/");
  const imagePath = `${imageFolder}/${stage}.webp`;

  els.skinImage.src = imagePath;
  els.skinImage.alt = `${skin.label} stage ${stage}`;
  els.skinMeta.textContent = `Stage ${stage}/${stageCount} • Max ${Math.floor(skin.maxWeight)} lb`;
}

function applySelectedSkin() {
  const skin = selectedSkin();
  state.selectedSkinId = skin.id;
  state.weight = Math.min(Math.max(state.weight, 90), skin.maxWeight);
  state.goalWeight = skin.maxWeight;
  updateSkinImage();
  render();
  saveState();
}

function onEat() {
  const gain = state.perClick;
  state.calories += gain;
  state.totalCaloriesEarned += gain;
  state.weight = Math.min(state.weight + gain * 0.08, selectedSkin().maxWeight);
  render();
  saveState();
}

function buyUpgrade(id) {
  const item = upgradeCatalog.find((entry) => entry.id === id);
  if (!item) return;

  const cost = calculateUpgradeCost(item);
  if (state.calories < cost) {
    els.statusText.textContent = "Need more calories";
    return;
  }

  state.calories -= cost;
  state.upgrades[id] = (state.upgrades[id] || 0) + 1;

  if (item.type === "click") state.perClick += item.value;

  updateAutoGain();
  render();
  saveState();
}

function renderShop() {
  els.shopList.innerHTML = "";
  upgradeCatalog.forEach((item) => {
    const level = state.upgrades[item.id] || 0;
    const cost = calculateUpgradeCost(item);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "upgrade-card";
    card.disabled = state.calories < cost;
    card.innerHTML = `
      <span class="upgrade-icon">${item.icon}</span>
      <span class="upgrade-main">
        <span class="upgrade-name">${item.name} <small>x${level}</small></span>
        <span class="upgrade-desc">${item.description}</span>
      </span>
      <span class="upgrade-cost">${formatNumber(cost)}</span>
    `;
    card.addEventListener("click", () => buyUpgrade(item.id));
    els.shopList.appendChild(card);
  });
}

function renderRebirthUpgrades() {
  els.rebirthUpgradeBtns.innerHTML = "";
  REBIRTH_UPGRADES.forEach((upgrade) => {
    const level = state.rebirthUpgrades[upgrade.id] || 0;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "rebirth-upgrade-card";
    card.disabled = state.totalCaloriesEarned < upgrade.cost;
    card.innerHTML = `
      <span class="upgrade-icon">${upgrade.icon}</span>
      <span class="upgrade-main">
        <span class="upgrade-name">${upgrade.label} <small>Lvl ${level}</small></span>
        <span class="upgrade-desc">${upgrade.description}</span>
      </span>
      <span class="upgrade-cost">${upgrade.cost}pt</span>
    `;
    card.addEventListener("click", () => buyRebirthUpgrade(upgrade.id));
    els.rebirthUpgradeBtns.appendChild(card);
  });
}

function render() {
  updateAutoGain();
  const skin = selectedSkin();
  const weight = Math.min(state.weight, skin.maxWeight);
  state.weight = weight;
  state.goalWeight = skin.maxWeight;

  const progress = Math.min((weight / skin.maxWeight) * 100, 100);
  const reward = calculateRebirthReward();
  const canDoRebirthNow = canRebirth();

  els.caloriesValue.textContent = formatNumber(state.calories);
  els.tapValue.textContent = formatNumber(state.perClick);
  els.autoValue.textContent = `${formatNumber(state.autoGain)}/s`;
  els.weightValue.textContent = formatWeight(weight);
  els.goalText.textContent = `Goal: ${formatWeight(skin.maxWeight)}`;
  els.tapGain.textContent = formatNumber(state.perClick);
  els.progressFill.style.width = `${progress}%`;
  els.goalLabel.textContent = formatWeight(skin.maxWeight);
  els.rebirthCount.textContent = `Rebirths: ${state.rebirths}`;
  els.rebirthReward.textContent = `Next reward: ${reward} points`; 
  els.rebirthBtn.disabled = !canDoRebirthNow;
  els.rebirthBtn.textContent = canDoRebirthNow ? `Rebirth for ${reward} points` : `Need ${Math.floor(skin.maxWeight * 0.5)} lbs to Rebirth`;

  if (weight >= skin.maxWeight) {
    els.statusText.textContent = "Maxed out! Ready to rebirth!";
  } else if (state.calories >= 1000) {
    els.statusText.textContent = "Bulk in progress";
  } else {
    els.statusText.textContent = "Ready";
  }

  renderShop();
  renderRebirthUpgrades();
  updateSkinImage();
}

function passiveTick() {
  if (state.autoGain > 0) {
    const gained = state.autoGain * 0.25;
    state.calories += gained;
    state.totalCaloriesEarned += gained;
    state.weight = Math.min(state.weight + gained * 0.08, selectedSkin().maxWeight);
    render();
    saveState();
  }
}

function resetGame() {
  const confirmReset = window.confirm("Reset your gain progress?");
  if (!confirmReset) return;

  Object.assign(state, structuredClone(defaultState));
  state.selectedSkinId = selectedSkin().id;
  saveState();
  render();
}

function initSkinSelector() {
  els.skinSelector.innerHTML = SKINS.map((skin) => `<option value="${skin.id}">${skin.label}</option>`).join("");
  els.skinSelector.value = state.selectedSkinId;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Ignore registration errors in local dev.
    });
  });
}

els.eatButton.addEventListener("click", onEat);
els.resetBtn.addEventListener("click", resetGame);
els.rebirthBtn.addEventListener("click", performRebirth);
els.skinSelector.addEventListener("change", (event) => {
  state.selectedSkinId = event.target.value;
  applySelectedSkin();
});

initSkinSelector();
render();
setInterval(passiveTick, 250);

// Simple helper so the rebirth UI stays visible even if no prestige upgrades are purchased yet.
if (!els.rebirthUpgradeBtns) {
  console.warn("rebirthUpgradeBtns is missing from the DOM");
}

if (!els.rebirthBtn) {
  console.warn("rebirthBtn is missing from the DOM");
}

if (!els.rebirthCount) {
  console.warn("rebirthCount is missing from the DOM");
}

if (!els.rebirthReward) {
  console.warn("rebirthReward is missing from the DOM");
}

if (!els.skinImage) {
  console.warn("skinImage is missing from the DOM");
}

if (!els.skinSelector) {
  console.warn("skinSelector is missing from the DOM");
}

if (!els.shopList) {
  console.warn("shopList is missing from the DOM");
}

if (!els.statusText) {
  console.warn("statusText is missing from the DOM");
}

if (!els.goalText) {
  console.warn("goalText is missing from the DOM");
}

if (!els.weightValue) {
  console.warn("weightValue is missing from the DOM");
}

if (!els.caloriesValue) {
  console.warn("caloriesValue is missing from the DOM");
}

if (!els.tapValue) {
  console.warn("tapValue is missing from the DOM");
}

if (!els.autoValue) {
  console.warn("autoValue is missing from the DOM");
}

if (!els.eatButton) {
  console.warn("eatButton is missing from the DOM");
}

if (!els.resetBtn) {
  console.warn("resetBtn is missing from the DOM");
}

if (!els.goalLabel) {
  console.warn("goalLabel is missing from the DOM");
}

if (!els.progressFill) {
  console.warn("progressFill is missing from the DOM");
}

if (!els.skinMeta) {
  console.warn("skinMeta is missing from the DOM");
}

if (!els.goalText) {
  console.warn("goalText is missing from the DOM");
}

if (!els.tapGain) {
  console.warn("tapGain is missing from the DOM");
}

if (!els.rebirthBtn) {
  console.warn("rebirthBtn is missing from the DOM");
}

if (!els.rebirthReward) {
  console.warn("rebirthReward is missing from the DOM");
}

if (!els.rebirthCount) {
  console.warn("rebirthCount is missing from the DOM");
}

if (!els.rebirthUpgradeBtns) {
  console.warn("rebirthUpgradeBtns is missing from the DOM");
}

// Keep the game mobile-friendly and easy to read on smaller screens.
window.addEventListener("orientationchange", () => {
  render();
});

window.addEventListener("resize", () => {
  render();
});

render();
setInterval(passiveTick, 250);

console.log("Bulk Builder loaded with rebirth, prestige, and skin progression.");











































































































































































































































































































































"}]}  