"""initial

Revision ID: 0001_initial
Revises:
Create Date: 2026-04-12 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


role_enum = sa.Enum("admin", "ngo_coordinator", "volunteer", "field_worker", name="roleenum")
report_source_enum = sa.Enum("PAPER_SURVEY", "FIELD_REPORT", "WHATSAPP", "DIRECT_ENTRY", "OCR_UPLOAD", name="reportsource")
report_status_enum = sa.Enum("PENDING", "PROCESSED", "FLAGGED", name="reportstatus")
need_category_enum = sa.Enum(
    "FOOD",
    "MEDICAL",
    "SHELTER",
    "EDUCATION",
    "LEGAL",
    "MENTAL_HEALTH",
    "ELDERLY_CARE",
    "DISABILITY",
    "OTHER",
    name="needcategory",
)
need_urgency_enum = sa.Enum("CRITICAL", "HIGH", "MEDIUM", "LOW", name="needurgency")
need_status_enum = sa.Enum("OPEN", "ASSIGNED", "FULFILLED", "CLOSED", name="needstatus")
skill_enum = sa.Enum(
    "MEDICAL",
    "LEGAL",
    "TEACHING",
    "COOKING",
    "LOGISTICS",
    "TRANSLATION",
    "COUNSELING",
    "TECH",
    name="skillenum",
)
dispatch_status_enum = sa.Enum("PENDING_ACCEPT", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "DECLINED", name="dispatchstatus")


def upgrade() -> None:
    op.create_table(
        "wards",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("district", sa.String(), nullable=False),
        sa.Column("state", sa.String(), nullable=False),
        sa.Column("polygon", sa.JSON(), nullable=False),
        sa.Column("population", sa.Integer(), nullable=False),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=False),
        sa.Column("role", role_enum, nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("ward_id", sa.String(length=36), nullable=True),
        sa.ForeignKeyConstraint(["ward_id"], ["wards.id"]),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "reports",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("source", report_source_enum, nullable=False),
        sa.Column("raw_text", sa.Text(), nullable=False),
        sa.Column("parsed_needs", sa.JSON(), nullable=True),
        sa.Column("ward_id", sa.String(length=36), nullable=False),
        sa.Column("submitted_by", sa.String(length=36), nullable=False),
        sa.Column("status", report_status_enum, nullable=False),
        sa.Column("attachments", sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(["ward_id"], ["wards.id"]),
        sa.ForeignKeyConstraint(["submitted_by"], ["users.id"]),
    )

    op.create_table(
        "needs",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("category", need_category_enum, nullable=False),
        sa.Column("urgency", need_urgency_enum, nullable=False),
        sa.Column("urgency_score", sa.Float(), nullable=False),
        sa.Column("report_count", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("ward_id", sa.String(length=36), nullable=False),
        sa.Column("location_lat", sa.Float(), nullable=True),
        sa.Column("location_lng", sa.Float(), nullable=True),
        sa.Column("status", need_status_enum, nullable=False),
        sa.ForeignKeyConstraint(["ward_id"], ["wards.id"]),
    )

    op.create_table(
        "volunteers",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("skills", sa.JSON(), nullable=False),
        sa.Column("languages", sa.JSON(), nullable=False),
        sa.Column("availability_schedule", sa.JSON(), nullable=False),
        sa.Column("current_lat", sa.Float(), nullable=True),
        sa.Column("current_lng", sa.Float(), nullable=True),
        sa.Column("max_radius_km", sa.Float(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("completed_tasks", sa.Integer(), nullable=False),
        sa.Column("reliability_score", sa.Float(), nullable=False),
        sa.Column("home_ward_id", sa.String(length=36), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["home_ward_id"], ["wards.id"]),
        sa.UniqueConstraint("user_id"),
    )

    op.create_table(
        "dispatches",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("need_id", sa.String(length=36), nullable=False),
        sa.Column("volunteer_id", sa.String(length=36), nullable=False),
        sa.Column("match_score", sa.Float(), nullable=False),
        sa.Column("status", dispatch_status_enum, nullable=False),
        sa.Column("volunteer_notes", sa.Text(), nullable=True),
        sa.Column("notified_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("responded_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["need_id"], ["needs.id"]),
        sa.ForeignKeyConstraint(["volunteer_id"], ["volunteers.id"]),
    )


def downgrade() -> None:
    op.drop_table("dispatches")
    op.drop_table("volunteers")
    op.drop_table("needs")
    op.drop_table("reports")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    op.drop_table("wards")