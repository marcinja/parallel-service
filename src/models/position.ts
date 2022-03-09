

import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "lending_position"})
export class LendingPosition extends BaseEntity {
    @PrimaryGeneratedColumn()
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