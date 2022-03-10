

import { BaseEntity, Entity, Column, PrimaryColumn } from "typeorm";

@Entity({name: "lending_position"})
export class LendingPosition extends BaseEntity {
    @PrimaryColumn()
    id!: string

    @Column()
    address!: string

    @Column()
    token!: string

    @Column()
    supply_balance!: string

    @Column()
    borrow_balance!: string

    @Column()
    exchange_rate!: string

    @Column()
    block_number!: number

    @Column({ type: 'timestamptz'})
    block_timestamp!: string
}