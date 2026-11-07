const changeableColumns = [
  "status",
  "agronomist_id",
  "assigned_at",
  "agronomist_response",
  "answered_at",
  "rejection_reason",
  "closed_at",
];

export const applyStatusChanges = async (client, requestId, changes) => {
  const keys = changeableColumns.filter((key) => changes[key] !== undefined);
  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

  await client.query(
    `UPDATE consultation_requests
     SET ${setClauses.join(", ")}
     WHERE id = $${keys.length + 1}`,
    [...keys.map((key) => changes[key]), requestId],
  );
};

export const addStatusHistory = async (
  client,
  { requestId, fromStatus, toStatus, changedBy, note },
) => {
  await client.query(
    `INSERT INTO request_status_history
       (request_id, from_status, to_status, changed_by, note)
     VALUES ($1, $2, $3, $4, $5)`,
    [requestId, fromStatus, toStatus, changedBy, note || null],
  );
};
