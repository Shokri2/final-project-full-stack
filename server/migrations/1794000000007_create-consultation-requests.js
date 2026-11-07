export const up = (pgm) => {
  pgm.createTable("consultation_requests", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    crop_id: {
      type: "integer",
      notNull: true,
      references: "crops",
      onDelete: "RESTRICT",
    },
    agronomist_id: { type: "integer", references: "users", onDelete: "SET NULL" },
    title: { type: "varchar(150)", notNull: true },
    description: { type: "text", notNull: true },
    farm_location: { type: "varchar(200)" },
    field_area_m2: { type: "numeric(10,2)" },
    priority: { type: "varchar(10)", notNull: true, default: "medium" },
    status: { type: "varchar(20)", notNull: true, default: "pending" },
    agronomist_response: { type: "text" },
    rejection_reason: { type: "text" },
    assigned_at: { type: "timestamptz" },
    answered_at: { type: "timestamptz" },
    closed_at: { type: "timestamptz" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
    updated_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
  });

  pgm.addConstraint("consultation_requests", "requests_status_check", {
    check:
      "status IN ('pending', 'assigned', 'in_progress', 'answered', 'closed', 'rejected', 'cancelled')",
  });
  pgm.addConstraint("consultation_requests", "requests_priority_check", {
    check: "priority IN ('low', 'medium', 'high')",
  });
  pgm.addConstraint("consultation_requests", "requests_field_area_check", {
    check: "field_area_m2 IS NULL OR field_area_m2 > 0",
  });
  pgm.addConstraint("consultation_requests", "requests_rejection_reason_check", {
    check: "status <> 'rejected' OR rejection_reason IS NOT NULL",
  });
  pgm.addConstraint("consultation_requests", "requests_response_check", {
    check: "status NOT IN ('answered', 'closed') OR agronomist_response IS NOT NULL",
  });
  pgm.addConstraint("consultation_requests", "requests_agronomist_check", {
    check: "status NOT IN ('assigned', 'in_progress', 'answered') OR agronomist_id IS NOT NULL",
  });

  pgm.createIndex("consultation_requests", "user_id");
  pgm.createIndex("consultation_requests", "agronomist_id");
  pgm.createIndex("consultation_requests", "crop_id");
  pgm.createIndex("consultation_requests", "status");
  pgm.createIndex("consultation_requests", "created_at");

  pgm.sql(`
    CREATE TRIGGER consultation_requests_set_updated_at
    BEFORE UPDATE ON consultation_requests
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `);

  pgm.createTable("request_status_history", {
    id: { type: "bigserial", primaryKey: true },
    request_id: {
      type: "integer",
      notNull: true,
      references: "consultation_requests",
      onDelete: "CASCADE",
    },
    from_status: { type: "varchar(20)" },
    to_status: { type: "varchar(20)", notNull: true },
    changed_by: { type: "integer", references: "users", onDelete: "SET NULL" },
    note: { type: "text" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
  });
  pgm.createIndex("request_status_history", ["request_id", "created_at"]);

  pgm.createTable("request_attachments", {
    id: "id",
    request_id: {
      type: "integer",
      notNull: true,
      references: "consultation_requests",
      onDelete: "CASCADE",
    },
    uploaded_by: { type: "integer", references: "users", onDelete: "SET NULL" },
    file_url: { type: "varchar(500)", notNull: true },
    storage_key: { type: "varchar(255)" },
    original_name: { type: "varchar(255)", notNull: true },
    mime_type: { type: "varchar(50)", notNull: true },
    size_bytes: { type: "integer", notNull: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
  });
  pgm.addConstraint("request_attachments", "attachments_mime_check", {
    check: "mime_type IN ('image/jpeg', 'image/png', 'image/webp')",
  });
  pgm.addConstraint("request_attachments", "attachments_size_check", {
    check: "size_bytes > 0 AND size_bytes <= 5242880",
  });
  pgm.createIndex("request_attachments", "request_id");
};

export const down = (pgm) => {
  pgm.dropTable("request_attachments");
  pgm.dropTable("request_status_history");
  pgm.dropTable("consultation_requests");
};
