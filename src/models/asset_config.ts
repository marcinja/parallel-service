import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'lending_asset_config'})
export class LendingAssetConfigure extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: string

    @Column()
    block_number!: number

    @Column()
    asset_id!: number

    @Column()
    total_supply!: string

    @Column()
    total_borrows!: string

    @Column()
    total_reserves!: string

    @Column()
    borrow_index!: string

    @Column()
    borrow_rate!: string

    @Column()
    supply_rate!: string

    @Column()
    exchange_rate!: string

    @Column()
    utilization_ratio!: string

    @Column()
    last_accrued_timestamp!: string
}