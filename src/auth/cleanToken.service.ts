import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import mongoose from 'mongoose';
import { Auth } from '../schema/authentications.schema';

@Injectable()
export class RefreshTokenCleanUpService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: mongoose.Model<Auth>,
  ) {}

  @Cron('0 0 0 * * *', { timeZone: 'Asia/Jakarta' })
  async handleCron(): Promise<void> {
    const now = new Date();
    try {
      await this.authModel.deleteMany({
        expiryDate: { $lte: now },
      });

      console.log('Cron Job Running');
    } catch (error) {
      console.log('Gagal Hapus Refresh Token Yang Kadaluarsa', error);
    }
  }
}
