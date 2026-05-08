import { Injectable, NotFoundException } from '@nestjs/common';
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

  async remove(id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
    });
    if (!note) {
      throw new NotFoundException('Note not found!');
    }
    await this.prisma.note.delete({
      where: { id },
    });
    return { message: `Note has deleted: ${note.id}` };
  }
}
