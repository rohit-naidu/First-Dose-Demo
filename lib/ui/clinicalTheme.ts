/**
 * Retro clinical workstation styling — flat panels, sharp borders, legacy EMR feel.
 * Import `ui` in components instead of repeating long Tailwind strings.
 */

export const ui = {
  app: "min-h-screen bg-[#c0c0c0] font-sans text-sm text-[#1a1a1a]",
  layout: "flex min-h-screen flex-col lg:flex-row",

  sidebar:
    "shrink-0 border-b border-[#808080] bg-[#ece9d8] p-2 lg:w-52 lg:border-b-0 lg:border-r",
  sidebarBrand: "mb-3 flex items-center gap-2 border-b border-[#a0a0a0] pb-2",
  sidebarTitle: "text-[10px] font-bold uppercase text-[#003366]",
  sidebarNote: "mt-3 border border-[#a0a0a0] bg-[#f5f5f5] p-2 text-xs leading-snug text-[#333]",

  navItem:
    "flex w-full items-center gap-2 px-2 py-1 text-left text-sm text-[#1a1a1a] hover:bg-[#316AC5] hover:text-white",
  navItemActive:
    "flex w-full items-center gap-2 bg-[#316AC5] px-2 py-1 text-left text-sm font-semibold text-white",

  workArea: "flex min-h-screen flex-1 flex-col bg-[#c0c0c0]",
  content: "flex-1 p-2",

  /** Patient banner — classic blue chart header */
  banner: "mb-2 border border-[#003366] bg-[#003366] text-white",
  bannerInner: "flex flex-col gap-2 p-2 lg:flex-row lg:items-stretch lg:justify-between",
  bannerLabel: "text-[10px] font-bold uppercase text-[#b8d4f0]",
  bannerTitle: "text-lg font-bold leading-tight",
  statGrid: "grid gap-1 sm:grid-cols-2 lg:grid-cols-4",
  statCell: "border border-[#5a8ab5] bg-[#1e4a7a] px-2 py-1",
  statLabel: "text-[10px] uppercase text-[#b8d4f0]",
  statValue: "text-sm font-semibold",

  /** Standard framed panel */
  panel: "border border-[#808080] bg-[#f5f5f5]",
  panelTitle:
    "border-b border-[#808080] bg-[#d4d0c8] px-2 py-1 text-xs font-bold uppercase text-[#1a1a1a]",
  panelBody: "p-2",

  sectionHeading:
    "mb-1 border border-[#808080] bg-[#d4d0c8] px-2 py-0.5 text-xs font-bold uppercase text-[#1a1a1a]",

  bodyText: "text-sm leading-snug text-[#333]",
  muted: "text-xs text-[#555]",

  btn:
    "inline-flex items-center justify-center gap-1 border border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#e8e8e8] px-3 py-1 text-sm text-[#1a1a1a] hover:bg-[#dddddd] disabled:cursor-not-allowed disabled:opacity-60",
  btnPrimary:
    "inline-flex items-center justify-center gap-1 border border-[#003366] bg-[#316AC5] px-3 py-1 text-sm font-semibold text-white hover:bg-[#2555a8] disabled:cursor-not-allowed disabled:opacity-60",
  btnDanger:
    "inline-flex items-center justify-center gap-1 border border-[#800000] bg-[#c05050] px-3 py-1 text-sm font-semibold text-white hover:bg-[#a04040]",

  geneChip:
    "border border-[#808080] bg-white px-2 py-0.5 text-xs font-semibold text-[#003366] hover:bg-[#e8f4ff]",

  tableWrap: "overflow-x-auto border border-[#808080] bg-white",
  table: "w-full min-w-[640px] border-collapse text-left text-sm",
  tableHead: "bg-[#d4d0c8]",
  th: "border border-[#a0a0a0] px-2 py-1 text-xs font-bold text-[#1a1a1a]",
  tableRow:
    "cursor-pointer border-b border-[#d8d8d8] odd:bg-white even:bg-[#f7f7f7] hover:bg-[#e8f4ff]",
  td: "border border-[#e8e8e8] px-2 py-1",

  listRow: "border border-[#c0c0c0] bg-white p-2",
  listRowSelected: "border border-[#316AC5] bg-[#e8f4ff] p-2",

  insetBox: "border border-[#a0a0a0] bg-white p-2",
  calloutWarn: "border border-[#996600] bg-[#fff8dc] p-2 text-sm text-[#4a3800]",

  footer: "sticky bottom-0 z-20 border-t-2 border-[#808080] bg-[#ece9d8] p-2",
  footerStatus: "text-xs text-[#333]",

  modalOverlay: "fixed inset-0 z-50 overflow-y-auto bg-[#808080]/50 p-2",
  modal: "mx-auto my-2 w-full max-w-7xl border-2 border-[#404040] bg-[#f5f5f5]",
  modalTitleBar:
    "flex items-start justify-between gap-2 border-b border-[#003366] bg-[#003366] px-2 py-1 text-white",
  modalTitle: "text-sm font-bold",
  modalSubtitle: "text-xs text-[#b8d4f0]",
  modalBody: "p-2",
  modalClose:
    "grid h-6 w-6 place-items-center border border-[#808080] bg-[#e8e8e8] text-[#1a1a1a] hover:bg-white",

  dropZone:
    "border border-dashed border-[#606060] bg-white p-4 hover:border-[#316AC5] hover:bg-[#f8fbff]",
  dropZoneIcon: "mb-2 inline-block border border-[#a0a0a0] bg-[#ece9d8] p-2",

  chartBox: "h-[380px] border border-[#a0a0a0] bg-white p-1",
  pre: "max-h-72 overflow-auto border border-[#a0a0a0] bg-white p-2 font-mono text-xs text-[#1a1a1a]",
} as const;
