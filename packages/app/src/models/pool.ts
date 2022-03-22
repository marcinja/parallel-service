import { Entity, Column, BaseEntity, PrimaryColumn, Index } from 'typeorm'

@Entity({ name: 'pool' })
export class Pool extends BaseEntity {
    @PrimaryColumn({ type: 'int' })
    id!: number

    @Column({ type: 'varchar' })
    trader!: string

    @Column({type: 'int'})
    base_id!: number

    @Column({type: 'int'})
    quote_id!: number

    @Column({ type: 'varchar' })
    base_symbol!: string

    @Column({ type: 'varchar' })
    quote_symbol!: string

    @Index()
    @Column({type: 'int'})
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}
