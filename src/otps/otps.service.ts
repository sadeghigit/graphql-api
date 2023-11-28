import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from './schemas/otp.schema';
import { Model } from 'mongoose';
import * as randexp from 'randexp';
import * as moment from 'moment-jalaali';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OtpsService {
  private readonly logger = new Logger(OtpsService.name);

  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
  ) { }

  async generateOtp(mobile: string): Promise<Otp> {
    const code = new randexp(/^[1-9][0-9]{4}$/).gen()
    await this.otpModel.deleteMany({ mobile })
    const result = await this.otpModel.create({ code, mobile })
    return result.toObject()
  }

  async verifyOtp(mobile: string, code: string): Promise<void> {
    const expiredAt = moment().subtract(2, 'minute').toDate()
    const result = await this.otpModel.deleteOne({ createdAt: { $gt: expiredAt }, mobile, code })
    if (result.deletedCount != 1) throw new BadRequestException('Otp is invalid')
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpired(): Promise<void> {
    const expiredAt = moment().subtract(2, 'minute').toDate()
    const result = await this.otpModel.deleteMany({ createdAt: { $lt: expiredAt } })
    this.logger.log('expired otps deleted: ' + result.deletedCount)
  }
}
