/**
 * Utilitarian severity colors — classic clinical workstation palette.
 */

import type { ImpactTier, PrescribingPriority, SideEffectLikelihood } from "./types";

export function impactTierClasses(tier: ImpactTier) {
  if (tier === "High") {
    return {
      badge: "border border-[#800000] bg-[#ffcccc] px-2 py-0 text-xs font-bold text-[#800000]",
      border: "border border-[#cc6666] bg-[#fff5f5]",
      dot: "bg-[#cc0000]",
    };
  }
  if (tier === "Moderate") {
    return {
      badge: "border border-[#665500] bg-[#ffffcc] px-2 py-0 text-xs font-bold text-[#665500]",
      border: "border border-[#cccc66] bg-[#fffff5]",
      dot: "bg-[#996600]",
    };
  }
  return {
    badge: "border border-[#003366] bg-[#e8f4ff] px-2 py-0 text-xs font-bold text-[#003366]",
    border: "border border-[#a0c0e0] bg-[#f8fbff]",
    dot: "bg-[#316AC5]",
  };
}

export function likelihoodClasses(likelihood: SideEffectLikelihood) {
  if (likelihood === "High") return "font-semibold text-[#800000]";
  if (likelihood === "Moderate") return "font-semibold text-[#665500]";
  return "text-[#555]";
}

export function priorityClasses(priority: PrescribingPriority) {
  if (priority === "Required")
    return "border border-[#800000] bg-[#ffcccc] px-1 text-[10px] font-bold text-[#800000]";
  if (priority === "Recommended")
    return "border border-[#003366] bg-[#e8f4ff] px-1 text-[10px] font-bold text-[#003366]";
  return "border border-[#808080] bg-[#eeeeee] px-1 text-[10px] font-bold text-[#555]";
}

export const IMPACT_TIER_ORDER: Record<ImpactTier, number> = {
  High: 0,
  Moderate: 1,
  Supportive: 2,
};

export const LIKELIHOOD_ORDER: Record<SideEffectLikelihood, number> = {
  High: 0,
  Moderate: 1,
  Low: 2,
};
