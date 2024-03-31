import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

export default class PrismaService {
    public static readonly prisma: PrismaClient = new PrismaClient()
}