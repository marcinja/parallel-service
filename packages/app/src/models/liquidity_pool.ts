import { Entity, Column, BaseEntity, Index, PrimaryColumn } from 'typeorm'

@Entity({ name: 'liquidity_pool' })
export class LiquidityPool extends BaseEntity {
    @PrimaryColumn({ type: 'varchar' })
    id!: string

    @Column({type: 'int'})
    poolId!: number

    @Column({ type: 'varchar' })
    baseVolume!: string

    @Column({ type: 'varchar' })
    quoteVolume!: string

    @Index()
    @Column({type: 'int'})
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}
