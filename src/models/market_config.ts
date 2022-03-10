import { BaseEntity, Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "lending_market_config"})
export class LendingMarketConfigure extends BaseEntity {
    @PrimaryColumn()
    id!: string

    @Column()
    symbol!: string

    @Column()
    collateral_factor!: string

    @Column()
    borrow_cap!: string // market cap

    @Column()
    close_factor!: string

    @Column()
    liquidation_incentive!: string

    @Column()
    reserve_factor!: string

    @Column()
    decimals!: number

    @Column()
    borrow_enabled!: boolean    // market active

    @Column()
    block_number!: number

    @Column({ type: 'timestamptz'})
    block_timestamp!: string
}