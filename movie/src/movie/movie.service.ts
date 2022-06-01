import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieDocument } from './schema/movie.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel('Movie') private readonly movie: Model<MovieDocument>,
  ) {}
  getMovies() {
    return this.movie.find({}).limit(20);
  }
}
