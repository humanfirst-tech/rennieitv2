const controlData = {
  "Access to Patient Information": {
    goal: "Limit access to electronic patient information to people who need it for their job.",
    kci: "83% MFA coverage",
    kciNote: "6 of 36 workforce accounts lack MFA",
    kri: "4 shared or stale accounts",
    kriNote: "Target: 0",
    meaning: "Unnecessary or weakly protected access increases the chance of inappropriate access to ePHI."
  },
  "Workstations & Devices": {
    goal: "Keep workstations and devices that access patient information protected and reasonably current.",
    kci: "91% managed endpoint coverage",
    kciNote: "2 clinical workstations not centrally managed",
    kri: "5 devices >30 days overdue",
    kriNote: "Target: fewer than 2",
    meaning: "Unmanaged or overdue systems may leave patient information exposed to known weaknesses."
  },
  "Backup & Recovery": {
    goal: "Make sure critical systems and electronic patient information can be recovered after an outage or cyber incident.",
    kci: "98% backup-job success",
    kciNote: "Backups are completing consistently",
    kri: "214 days since restore test",
    kriNote: "Practice target: 90 days",
    meaning: "Successful backup jobs do not prove the practice can restore data when it matters."
  },
  "Vendors & Remote Access": {
    goal: "Understand which vendors can access systems or ePHI and control that access appropriately.",
    kci: "75% vendor access reviewed",
    kciNote: "3 of 12 vendors need review",
    kri: "2 persistent remote-access paths",
    kriNote: "Review necessity and safeguards",
    meaning: "Vendor access that is not periodically reviewed can create an avoidable path to sensitive systems."
  }
};
const riskRows = [
  {
    risk:"Workforce accounts lack MFA",
    control:"Access to Patient Information",
    level:"High",
    trend:"↑ Increasing",
    owner:"Practice Manager",
    action:"Enable MFA for remaining workforce accounts and document exceptions.",
    effort:"Low",
    description:"Six workforce accounts can access systems used by the practice without multi-factor authentication."
  },
  {
    risk:"Shared or stale user accounts remain active",
    control:"Access to Patient Information",
    level:"High",
    trend:"→ Stable",
    owner:"Practice Manager",
    action:"Assign unique accounts and remove access that is no longer required.",
    effort:"Low",
    description:"Shared and stale accounts make it harder to limit access appropriately and determine who performed an action."
  },
  {
    risk:"Clinical workstations are not centrally managed",
    control:"Workstations & Devices",
    level:"Medium",
    trend:"↑ Increasing",
    owner:"IT / Practice",
    action:"Bring the two unmanaged systems into endpoint management and confirm protection settings.",
    effort:"Medium",
    description:"Two systems used in clinical workflows are outside the practice's normal endpoint-management process."
  },
  {
    risk:"Security updates are overdue on five devices",
    control:"Workstations & Devices",
    level:"Medium",
    trend:"↑ Increasing",
    owner:"IT",
    action:"Patch overdue devices and define how exceptions will be tracked.",
    effort:"Low",
    description:"Delayed updates may leave known vulnerabilities on devices that can access practice systems."
  },
  {
    risk:"Recovery capability has not been recently tested",
    control:"Backup & Recovery",
    level:"High",
    trend:"↑ Increasing",
    owner:"Practice / IT",
    action:"Perform and document a restore test for a representative critical system.",
    effort:"Medium",
    description:"Backup jobs are succeeding, but the practice has not recently demonstrated that critical information can be restored."
  },
  {
    risk:"Vendor access review is incomplete",
    control:"Vendors & Remote Access",
    level:"Medium",
    trend:"→ Stable",
    owner:"Practice Manager",
    action:"Review vendor access, business need, account ownership, and remote-access safeguards.",
    effort:"Medium",
    description:"Several vendors have technology access that has not been recently reviewed for continued need and appropriate safeguards."
  },
  {
    risk:"ePHI inventory may be incomplete",
    control:"Vendors & Remote Access",
    level:"High",
    trend:"→ Stable",
    owner:"Privacy / Security",
    action:"Confirm where ePHI is created, received, maintained, or transmitted, including vendor-hosted systems.",
    effort:"Medium",
    description:"The practice cannot fully assess risk until it understands all locations and systems where electronic protected health information exists."
  }
];
function riskBadge(params) {
  const value = String(params.value || "");
  return `<span class="risk-pill risk-${value.toLowerCase()}">${value}</span>`;
}
const gridOptions = {
  rowData: riskRows,
  columnDefs: [
    { field:"risk", headerName:"Practice Risk", minWidth:250, flex:1.6, pinned:"left" },
    { field:"control", headerName:"Review Area", minWidth:210, flex:1.05 },
    { field:"level", headerName:"Risk", minWidth:100, flex:.55, cellRenderer:riskBadge },
    { field:"trend", headerName:"Trend", minWidth:125, flex:.7 },
    { field:"owner", headerName:"Suggested Owner", minWidth:150, flex:.8 },
    { field:"action", headerName:"Recommended Next Action", minWidth:300, flex:1.8 },
    { field:"effort", headerName:"Effort", minWidth:95, flex:.5 }
  ],
  defaultColDef: { sortable:true, filter:true, resizable:true },
  rowHeight:54,
  headerHeight:48,
  animateRows:true,
  suppressCellFocus:true,
  onRowClicked: e => showRisk(e.data)
};
const gridElement = document.getElementById("ops-grid");
const gridApi = gridElement && window.agGrid ? agGrid.createGrid(gridElement, gridOptions) : null;
function showRisk(row) {
  document.getElementById("risk-name").textContent = row.risk;
  document.getElementById("risk-description").textContent = row.description;
  document.getElementById("risk-action").textContent = row.action;
  document.getElementById("risk-effort").textContent = row.effort;
}
function showControl(name) {
  const c = controlData[name];
  document.getElementById("control-title").textContent = name;
  document.getElementById("control-goal").textContent = c.goal;
  document.getElementById("kci-value").textContent = c.kci;
  document.getElementById("kci-note").textContent = c.kciNote;
  document.getElementById("kri-value").textContent = c.kri;
  document.getElementById("kri-note").textContent = c.kriNote;
  document.getElementById("business-meaning").textContent = c.meaning;
  if (gridApi) {
    gridApi.setGridOption("quickFilterText", name);
  }
}
document.querySelectorAll(".control-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".control-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    showControl(card.dataset.control);
  });
});
document.getElementById("show-all-risks")?.addEventListener("click", () => {
  document.querySelectorAll(".control-card").forEach(c => c.classList.remove("active"));
  if (gridApi) gridApi.setGridOption("quickFilterText", "");
});
showRisk(riskRows[0]);