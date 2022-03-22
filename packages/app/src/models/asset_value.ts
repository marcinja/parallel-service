import { BaseEntity, Entity, Column, PrimaryColumn, Index } from 'typeorm'

@Entity({ name: 'asset_value' })
export class AssetValue extends BaseEntity {
    @PrimaryColumn({ type: 'varchar' })
    id!: string // assetid-startOfHour

    @Column({type: 'int'})
    asset_id!: number

    @Column({ type: 'varchar' })
    symbol!: string

    @Column({ type: 'varchar' })
    value!: string

    @Index()
    @Column({ type: 'int' })
    block_number!: number

    @Column({ type: 'timestamptz' })
    block_timestamp!: string
}
