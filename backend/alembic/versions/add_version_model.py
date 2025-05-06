"""add version model

Revision ID: add_version_model
Revises: update_created_at
Create Date: 2024-04-25 16:30:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "add_version_model"
down_revision: Union[str, None] = "update_created_at"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create versions table
    op.create_table(
        "versions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("number", sa.Integer(), nullable=False),
        sa.Column("system_prompt", sa.Text(), nullable=False),
        sa.Column("prompt_id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column("commit_message", sa.String(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["prompt_id"], ["prompts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_versions_id"), "versions", ["id"], unique=False)
    op.create_index(
        op.f("ix_versions_prompt_id"), "versions", ["prompt_id"], unique=False
    )


def downgrade() -> None:
    # Drop versions table
    op.drop_index(op.f("ix_versions_prompt_id"), table_name="versions")
    op.drop_index(op.f("ix_versions_id"), table_name="versions")
    op.drop_table("versions")
