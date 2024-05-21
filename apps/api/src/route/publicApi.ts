
import { Router } from "express";
import { UserController } from "../user/user.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { uploader } from "../helpers/uploader";
import multer from "multer";

export const publicRouter = Router()
publicRouter.post('/api/users', multer().none(), UserController.regitser)
publicRouter.get('/api/users', multer().none(), UserController.getUsers)
publicRouter.post('/api/users/signup', multer().none(), UserController.regitser)
publicRouter.post('/api/users/signin', multer().none(), UserController.signin)
publicRouter.post('/api/users/signout', multer().none(), AuthMiddleware.private, UserController.signout)
publicRouter.get('/api/users/session', multer().none(), UserController.getSession)
publicRouter.post('/api/users/verify/resend', multer().none(), AuthMiddleware.shared, UserController.resend)
publicRouter.get('/api/users/verify/:token', multer().none(), UserController.verify)
publicRouter.get('/api/users/profile', multer().none(), AuthMiddleware.private, UserController.getUserProfile)
publicRouter.get('/api/users/vouchers', multer().none(), AuthMiddleware.private, UserController.getUserVouchers)
publicRouter.patch('/api/users/profile', AuthMiddleware.private, uploader('IMG', '/images').single('file'), UserController.updateProfile)
publicRouter.post('/api/users/forgot', multer().none(), UserController.forgot)
publicRouter.post('/api/users/reset/email', multer().none(), AuthMiddleware.private, UserController.requestChangeEmail)
publicRouter.patch('/api/users/reset/email/:token', multer().none(), AuthMiddleware.private, AuthMiddleware.reset.email, UserController.changePassword)
publicRouter.patch('/api/users/reset/password', multer().none(), AuthMiddleware.private, UserController.changePassword)
publicRouter.patch('/api/users/reset/password/:token', multer().none(), AuthMiddleware.reset.password, UserController.reset)
publicRouter.patch('/api/users/upgrade', multer().none(), AuthMiddleware.private, UserController.upgrade)
publicRouter.get('/api/users/:username', multer().none(), AuthMiddleware.shared, UserController.getUserByUsername)

publicRouter.post('/api/hello', async (req, res) => {
  console.log(req.body);
  console.log(typeof req.body);
  console.log(req.body instanceof FormData);
  res.status(200)
    .json({
      msg: 'hello'
    })
})