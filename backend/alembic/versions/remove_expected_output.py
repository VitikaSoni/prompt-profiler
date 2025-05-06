"""remove expected_output from test_cases

Revision ID: remove_expected_output
Revises: update_version_model
Create Date: 2024-03-21 12:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "remove_expected_output"
down_revision: Union[str, None] = "update_version_model"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop the expected_output column from test_cases table
    op.drop_column("test_cases", "expected_output")


def downgrade() -> None:
    # Add back the expected_output column
    op.add_column(
        "test_cases", sa.Column("expected_output", sa.String(), nullable=False)
    )
