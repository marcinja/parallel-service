import { Entity, Column, BaseEntity, PrimaryColumn, Index } from 'typeorm'

@Entity({ name: 'lending_action' })
export class LendingAction extends BaseEntity {
    @PrimaryColumn({ type: 'varchar' })
    id!: string // tx hash

    @Column({type: 'varchar'})
    address!: string

    @Column({type: 'varchar'})
    token!: string

    @Column({type: 'varchar'})
    amount!: string

    @Column({type: 'varchar'})
    method!: string

    @Column({type: 'varchar'})
    supply_balance!: string

    @Column({type: 'varchar'})
    borrow_balance!: string

    @Column({type: 'varchar'})
    borrow_index!: string

    @Column({type: 'varchar'})
    exchange_rate!: string

    @Index()
    @Column({type: 'int'})
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}
