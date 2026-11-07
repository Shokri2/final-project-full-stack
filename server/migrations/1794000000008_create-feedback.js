export const up = (pgm) => {
  pgm.createTable("feedback", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    crop_id: { type: "integer", references: "crops", onDelete: "CASCADE" },
    request_id: {
      type: "integer",
      references: "consultation_requests",
      onDelete: "SET NULL",
      unique: true,
    },
    rating: { type: "smallint", notNull: true },
    comment: { type: "text", notNull: true },
    status: { type: "varchar(20)", notNull: true, default: "pending" },
    reviewed_by: { type: "integer", references: "users", onDelete: "SET NULL" },
    reviewed_at: { type: "timestamptz" },
    rejection_reason: { type: "text" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
    updated_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
  });

  pgm.addConstraint("feedback", "feedback_rating_check", {
    check: "rating BETWEEN 1 AND 5",
  });
  pgm.addConstraint("feedback", "feedback_status_check", {
    check: "status IN ('pending', 'approved', 'rejected')",
  });
  pgm.addConstraint("feedback", "feedback_not_self_reviewed_check", {
    check: "reviewed_by IS NULL OR reviewed_by <> user_id",
  });

  pgm.createIndex("feedback", "status");
  pgm.createIndex("feedback", "user_id");
  pgm.createIndex("feedback", ["crop_id", "status"]);

  pgm.sql(`
    CREATE TRIGGER feedback_set_updated_at
    BEFORE UPDATE ON feedback
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `);
};

export const down = (pgm) => {
  pgm.dropTable("feedback");
};
