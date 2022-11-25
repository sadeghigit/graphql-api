import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { CreateSessionInput } from './input-types/create-session.input';
import * as RandExp from 'randexp';
import { SearchSessionInput } from './input-types/search-session.input';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async createSession(
    createSessionInput: CreateSessionInput,
  ): Promise<Session> {
    const refreshToken = new RandExp(/^[0-9a-zA-Z]{64}$/).gen();
    return await this.sessionModel.create({
      ...createSessionInput,
      refreshToken,
    });
  }

  async getSessions(
    searchSessionInput: SearchSessionInput,
  ): Promise<Session[]> {
    const where = this.searchInputToWhere(searchSessionInput);
    return await this.sessionModel.find(where).lean();
  }

  async getSessionsCount(
    searchSessionInput: SearchSessionInput,
  ): Promise<number> {
    const where = this.searchInputToWhere(searchSessionInput);
    return await this.sessionModel.countDocuments(where);
  }

  async getSession(id: Types.ObjectId): Promise<Session | null> {
    return await this.sessionModel.findById(id);
  }

  async getSessionByRefershToken(
    refreshToken: string,
  ): Promise<Session | null> {
    return await this.sessionModel.findOne({ refreshToken });
  }

  async removeSession(id: Types.ObjectId): Promise<boolean> {
    const result = await this.sessionModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  searchInputToWhere(searchSessionInput: SearchSessionInput) {
    const where: any = {};
    if (searchSessionInput.user) {
      where.user = { $in: searchSessionInput.user };
    }
    if (searchSessionInput.createdAt) {
      const date = searchSessionInput.createdAt;
      where.createdAt = { $gte: date[0], $lte: date[1] };
    }
    if (searchSessionInput.updatedAt) {
      const date = searchSessionInput.updatedAt;
      where.updatedAt = { $gte: date[0], $lte: date[1] };
    }
    return where;
  }
}
