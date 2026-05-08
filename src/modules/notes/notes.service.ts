import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(createNoteDto: CreateNoteDto, userId: string) {
    return this.prisma.note.create({
      data: {
        ...createNoteDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const note = await this.prisma.note.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found!');
    }

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string) {
    const result = await this.prisma.note.updateMany({
      where: {
        id,
        userId,
      },
      data: updateNoteDto,
    });

    if (result.count === 0) {
      throw new NotFoundException('Note not found!');
    }

    return {
      message: 'Note updated successfully!',
      updatedId: id,
    };
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.note.deleteMany({
      where: {
        id,
        userId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Note not found!');
    }

    return {
      message: 'Note deleted successfully!',
      deletedId: id,
    };
  }
}
