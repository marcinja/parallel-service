import { Entity, Column, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "lending_action"})
export class LendingAction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: string

    @Column()
    address!: string

    @Column()
    tx_hash!: string

    @Column()
    token!: string

    @Column()
    amount!: string

    @Column()
    method!: string

    @Column()
    exchange_rate!: string

    @Column()
    block_number!: number

    @Column({type: 'timestamptz'})
    block_timestamp!: string
}