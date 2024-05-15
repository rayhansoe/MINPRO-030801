
import cors from "cors";
import multer from "multer";
import express from "express";

import path from 'path'

import { publicRouter } from "../route/publicApi";
import { errorMiddleware } from "../middleware/error.middleware";
export const app = express()

app.use(cors())
app.use(express.json({
  limit: '10mb'
}))
// app.use(multer().none())
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/public', express.static(path.join(__dirname, '../public')))
app.use(publicRouter)
app.use(errorMiddleware)