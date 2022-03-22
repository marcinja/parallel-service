import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity({ name: 'lending_asset_config' })
export class LendingAssetConfigure extends BaseEntity {
    @PrimaryColumn({ type: 'varchar' })
    id!: string

    @Index()
    @Column({ type: 'int' })
    block_number!: number

    @Column({ type: 'int' })
    asset_id!: number

    @Column({ type: 'varchar' })
    symbol!: string

    @Column({ type: 'varchar' })
    total_supply!: string

    @Column({ type: 'varchar' })
    total_borrows!: string

    @Column({ type: 'varchar' })
    total_reserves!: string

    @Column({ type: 'varchar' })
    borrow_index!: string

    @Column({ type: 'varchar' })
    borrow_rate!: string

    @Column({ type: 'varchar' })
    supply_rate!: string

    @Column({ type: 'varchar' })
    exchange_rate!: string

    @Column({ type: 'varchar' })
    utilization_ratio!: string

    @Column({ type: 'varchar' })
    last_accrued_timestamp!: string

    @Column({ type: 'varchar' })
    block_timestamp!: string
}
