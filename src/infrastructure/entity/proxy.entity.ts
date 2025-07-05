// src/proxy/entities/proxy.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
export enum ProxyStatus {
    ACTIVE = 'active',
    IN_ACTIVE = 'inactive'
}

@Entity('proxy')
export class ProxyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    value: string;

    @Column({ type: 'enum', enum: ProxyStatus, default: ProxyStatus.ACTIVE })
    status: ProxyStatus;
}
