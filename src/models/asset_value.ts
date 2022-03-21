import { BaseEntity, Entity, Column, PrimaryColumn, Index } from 'typeorm'

@Entity({name: 'asset_value'})
export class AssetValue extends BaseEntity {
    @PrimaryColumn()
    id!: string // assetid-startOfHour

    @Column()
    asset_id!: number

    @Column()
    symbol!: string

    @Column()
    value!: string

    @Index()
    @Column()
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}