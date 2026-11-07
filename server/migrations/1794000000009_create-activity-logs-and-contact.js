export const up = (pgm) => {
  pgm.createTable("activity_logs", {
    id: { type: "bigserial", primaryKey: true },
    user_id: { type: "integer", references: "users", onDelete: "SET NULL" },
    action: { type: "varchar(50)", notNull: true },
    entity_type: { type: "varchar(50)" },
    entity_id: { type: "integer" },
    details: { type: "jsonb" },
    ip_address: { type: "varchar(45)" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
  });
  pgm.createIndex("activity_logs", "created_at");
  pgm.createIndex("activity_logs", "user_id");
  pgm.createIndex("activity_logs", ["entity_type", "entity_id"]);

  pgm.createTable("contact_messages", {
    id: "id",
    name: { type: "varchar(100)", notNull: true },
    email: { type: "varchar(255)", notNull: true },
    subject: { type: "varchar(150)", notNull: true },
    message: { type: "text", notNull: true },
    status: { type: "varchar(20)", notNull: true, default: "new" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
  });
  pgm.addConstraint("contact_messages", "contact_messages_status_check", {
    check: "status IN ('new', 'read', 'archived')",
  });
  pgm.createIndex("contact_messages", ["status", "created_at"]);
};

export const down = (pgm) => {
  pgm.dropTable("contact_messages");
  pgm.dropTable("activity_logs");
};
