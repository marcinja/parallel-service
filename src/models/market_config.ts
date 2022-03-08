import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "lending_market_config"})
export class LendingConfigure extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: string

    @Column()
    symbol!: string

    @Column()
    collateral_factor!: string

    @Column()
    borrow_cap!: number // market cap

    @Column()
    close_factor!: number

    @Column()
    liquidation_incentive!: number

    @Column()
    reserve_factor!: number

    @Column()
    decimals!: number

    @Column()
    borrow_enabled!: boolean    // market active

    @Column()
    block_number!: number

    @Column({ type: 'timestamptz'})
    timestamp!: Date
}