import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schemas/session.schema';
import { Model, Types } from 'mongoose';
import * as randexp from 'randexp';
import * as moment from 'moment-jalaali';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) { }

  async generateSession(userId: Types.ObjectId): Promise<Session> {
    const token = new randexp(/^[a-zA-Z0-9]{64}$/).gen()
    const result = await this.sessionModel.create({ token, userId, refreshAt: new Date() })
    return result.toObject()
  }

  async verifySession(token: string): Promise<Session> {
    const result = await this.sessionModel.updateOne({ token }, { refreshAt: new Date() })
    if (result.modifiedCount != 1) throw new BadRequestException('token is invalid')
    return this.sessionModel.findOne({ token }, {}, { lean: true }).orFail()
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpired() {
    const expiredAt = moment().subtract(30, 'days').toDate()
    const result = await this.sessionModel.deleteMany({ refreshAt: { $lt: expiredAt } })
    this.logger.log('expired otps deleted: ' + result.deletedCount)
  }
}
