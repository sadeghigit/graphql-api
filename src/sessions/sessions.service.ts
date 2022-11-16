import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './session.schema';
import { CreateSessionInput } from './create-session.input';
import * as RandExp from 'randexp';
import { SearchSessionInput } from './search-session.input';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async createSession(input: CreateSessionInput): Promise<Session> {
    const refreshToken = new RandExp(/^[0-9a-zA-Z]{64}$/).gen();
    return await this.sessionModel.create({ ...input, refreshToken });
  }

  async getSessions(input: SearchSessionInput): Promise<Session[]> {
    const where = this.searchInputToWhere(input);
    return await this.sessionModel.find(where).lean();
  }

  async getSessionsCount(input: SearchSessionInput): Promise<number> {
    const where = this.searchInputToWhere(input);
    return await this.sessionModel.countDocuments(where);
  }

  async getSession(id: string): Promise<Session | null> {
    return await this.sessionModel.findById(id);
  }

  async getSessionByRefershToken(
    refreshToken: string,
  ): Promise<Session | null> {
    return await this.sessionModel.findOne({ refreshToken });
  }

  async removeSession(id: string): Promise<boolean> {
    const result = await this.sessionModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  searchInputToWhere(searchInput: SearchSessionInput) {
    const where: any = {};
    if (searchInput.user) {
      where.user = { $in: searchInput.user };
    }
    if (searchInput.createdAt) {
      const date = searchInput.createdAt;
      where.createdAt = { $gte: date[0], $lte: date[1] };
    }
    if (searchInput.updatedAt) {
      const date = searchInput.updatedAt;
      where.updatedAt = { $gte: date[0], $lte: date[1] };
    }
    return where;
  }
}
