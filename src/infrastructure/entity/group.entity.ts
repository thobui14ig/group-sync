import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('groups')
export class GroupEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', unique: true, name: 'group_id' })
    groupId: string;
}
