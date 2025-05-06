"""update created_at

Revision ID: update_created_at
Revises: 561c6aaa8b74
Create Date: 2025-04-25 20:00:00.000000

"""

from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = "update_created_at"
down_revision = "561c6aaa8b74"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Update any null created_at values to the current UTC time
    op.execute(
        "UPDATE prompts SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"
    )
    # Make created_at column non-nullable
    op.alter_column(
        "prompts", "created_at", existing_type=sa.DateTime(), nullable=False
    )


def downgrade() -> None:
    # Make created_at column nullable again
    op.alter_column("prompts", "created_at", existing_type=sa.DateTime(), nullable=True)
