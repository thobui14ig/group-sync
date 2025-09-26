import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', unique: true, name: 'phone_number' })
    phoneNumber: string;

    @Column({ type: 'text' })
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
