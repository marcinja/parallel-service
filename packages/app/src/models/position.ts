import { BaseEntity, Entity, Column, PrimaryColumn, Index } from 'typeorm'

@Entity({ name: 'lending_position' })
export class LendingPosition extends BaseEntity {
    @PrimaryColumn({ type: 'varchar' })
    id!: string

    @Column({ type: 'varchar' })
    address!: string

    @Column({ type: 'varchar' })
    symbol!: string

    @Column({type: 'int'})
    decimals!: number

    @Column({ type: 'varchar' })
    supply_balance!: string

    @Column({ type: 'varchar' })
    borrow_balance!: string

    @Column({ type: 'varchar' })
    exchange_rate!: string

    @Index()
    @Column({type: 'int'})
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}
