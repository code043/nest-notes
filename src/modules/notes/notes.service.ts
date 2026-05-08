import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}
  async create(createNoteDto: CreateNoteDto) {
    const { userId, title, content } = createNoteDto;
    return await this.prisma.note.create({
      data: { userId, title, content },
    });
  }

  async findAll() {
    return await this.prisma.note.findMany();
  }
  async findAllUserNotes(userId: string) {
    return await this.prisma.note.findMany({ where: { userId } });
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
