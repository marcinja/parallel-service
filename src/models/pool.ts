import { CONNREFUSED } from 'dns'
import { Entity, Column, BaseEntity, PrimaryColumn, Index, OneToMany } from 'typeorm'

@Entity({name: 'pool'})
class Pool extends BaseEntity {
    @PrimaryColumn()
    id!: number

    @Column()
    trader!: string

    @Column()
    base_id!: number

    @Column()
    quote_id!: number

    @Index()
    @Column()
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}