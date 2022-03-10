import { Entity, Column, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "lending_action"})
export class LendingAction extends BaseEntity {
    @PrimaryColumn()
    id!: string     // tx hash

    @Column()
    address!: string

    @Column()
    token!: string

    @Column()
    amount!: string

    @Column()
    method!: string

    @Column()
    supply_balance!: string

    @Column()
    borrow_balance!: string

    @Column()
    borrow_index!: string

    @Column()
    exchange_rate!: string

    @Column()
    block_number!: number

    @Column({type: 'timestamptz'})
    block_timestamp!: string
}