export const REQUEST_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "answered", label: "Answered" },
  { value: "closed", label: "Closed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const STATUS_DESCRIPTIONS = {
  pending: "Waiting for the admin to assign an agronomist.",
  assigned: "An agronomist has been assigned and will start soon.",
  in_progress: "The agronomist is working on your request.",
  answered: "The agronomist has answered. Close the request when you're done.",
  closed: "This consultation is complete.",
  rejected: "This request was rejected.",
  cancelled: "This request was cancelled.",
};

export const MAX_IMAGES = 3;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
