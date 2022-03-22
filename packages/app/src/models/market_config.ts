import { BaseEntity, Entity, Column, PrimaryColumn, Index } from 'typeorm'

@Entity({ name: 'lending_market_config' })
export class LendingMarketConfigure extends BaseEntity {
    @PrimaryColumn({ type: 'varchar' })
    id!: string

    @Column({ type: 'varchar' })
    symbol!: string

    @Column({ type: 'varchar' })
    collateral_factor!: string

    @Column({ type: 'varchar' })
    borrow_cap!: string // market cap

    @Column({ type: 'varchar' })
    close_factor!: string

    @Column({ type: 'varchar' })
    liquidation_incentive!: string

    @Column({ type: 'varchar' })
    reserve_factor!: string

    @Column({type: 'int'})
    decimals!: number

    @Column({type: 'boolean'})
    borrow_enabled!: boolean // market active

    @Index()
    @Column({type: 'int'})
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}
