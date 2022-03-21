import { Entity, Column, BaseEntity, Index, PrimaryColumn } from 'typeorm'

@Entity({ name: 'liquidity_pool' })
export class LiquidityPool extends BaseEntity {
    @PrimaryColumn()
    id!: string

    @Column()
    poolId!: number

    @Column()
    baseVolume!: string

    @Column()
    quoteVolume!: string

    @Index()
    @Column()
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}
