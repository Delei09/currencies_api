// src/schemas/currency.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CurrencyDocument = Currency & Document;

@Schema()
export class Currency {
    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    codein: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    high: string;

    @Prop({ required: true })
    low: string;

    @Prop({ required: true })
    varBid: string;

    @Prop({ required: true })
    pctChange: string;

    @Prop({ required: true })
    bid: string;

    @Prop({ required: true })
    ask: string;

    @Prop({ required: true })
    timestamp: string;

    @Prop({ required: true })
    create_date: string;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
