import { Entity, Column, BaseEntity, PrimaryColumn, Index } from 'typeorm'

@Entity({name: "liquidity"})
export class Liquidity extends BaseEntity {

    @Index()
    @Column()
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}