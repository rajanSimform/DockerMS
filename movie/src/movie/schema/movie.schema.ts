import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ versionKey: false })
export class Movie {}

export const MovieSchema = SchemaFactory.createForClass(Movie);
