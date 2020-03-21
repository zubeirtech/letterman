import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Letter } from './interfaces/letter.interface';

// TODO: Create update letter

@Injectable()
export class LetterService {
    constructor(@InjectModel('Letter') private readonly letterModel: Model<Letter>) {
    }

    async create(letterDto) {
        try {
            const newLetter = new this.letterModel({ ...letterDto, createdAt: new Date(), updatedAt: new Date() })
            return await newLetter.save();
        } catch (e) {
            throw e;
        }
    }

    async get() {
        try {
            return this.letterModel.find().populate("account").exec();
        }catch (e) {
            throw e
        }
    }

    async getOne(letterId: string) {
        try {
            return await this.findLetter(letterId);
        } catch (e) {
            throw e;
        }
    }

    async delete(letterId: string) {
        try {
            if(await this.findLetter(letterId)) {
                await this.letterModel.deleteOne({letterId}).exec()
            }
        } catch (e) {
            throw e;
        }

    }

    async findLetter(letterId: string) {
        try {
            const letter = await this.letterModel.findOne(letterId);
            if(!letter) {
                throw new NotFoundException('Letter Not Found')
            }
            return letter;
        } catch(e) {
            throw e;
        }
    }
}
