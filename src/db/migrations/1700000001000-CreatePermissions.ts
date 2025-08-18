import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreatePermissions1700000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'identity',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'url',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'regex',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'enable',
            type: 'boolean',
            default: true,
          },
          {
            name: 'deleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
        indices: [
          {
            name: 'IDX_permissions_name',
            columnNames: ['name'],
          },
          {
            name: 'IDX_permissions_deleted_enable',
            columnNames: ['deleted', 'enable'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permissions');
  }
}
