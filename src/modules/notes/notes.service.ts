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

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const { title, content } = updateNoteDto;
    return await this.prisma.note.update({
      where: { id },
      data: { title, content },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
