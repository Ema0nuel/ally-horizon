export type CardStatus = "pending" | "approved" | "issued" | "declined";

const labels: Record<CardStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  issued: "Issued",
  declined: "Declined",
};

export function getCardStatusLabel(status: string | null): string {
  return (status && labels[status as CardStatus]) || "Pending";
}

export function getCardStatusTone(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "issued":
    case "approved":
      return "default";
    case "declined":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
}

export function maskCardNumber(value: string | null): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  const last = digits.slice(-4);
  return last ? `•••• •••• •••• ${last}` : "•••• •••• •••• ••••";
}
