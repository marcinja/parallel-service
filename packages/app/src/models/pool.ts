import { Entity, Column, BaseEntity, PrimaryColumn, Index } from 'typeorm'

@Entity({ name: 'pool' })
export class Pool extends BaseEntity {
    @PrimaryColumn()
    id!: number

    @Column()
    trader!: string

    @Column()
    base_id!: number

    @Column()
    quote_id!: number

    @Column()
    base_symbol!: string

    @Column()
    quote_symbol!: string

    @Index()
    @Column()
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}
