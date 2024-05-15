
import { Router } from "express";
import { UserController } from "../user/user.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { uploader } from "../helpers/uploader";
import multer from "multer";

export const publicRouter = Router()
publicRouter.post('/api/users', multer().none(), UserController.regitser)
publicRouter.get('/api/users', multer().none(), UserController.getUsers)
publicRouter.post('/api/users/signin', multer().none(), UserController.signin)
publicRouter.post('/api/users/signout', multer().none(), AuthMiddleware.private, UserController.signout)
publicRouter.get('/api/users/session', multer().none(), UserController.getSession)
publicRouter.post('/api/users/verify/resend', multer().none(), AuthMiddleware.shared, UserController.resend)
publicRouter.get('/api/users/verify/:token', multer().none(), UserController.verify)
publicRouter.get('/api/users/profile', multer().none(), AuthMiddleware.private, UserController.getUserProfile)
publicRouter.patch('/api/users/profile', AuthMiddleware.private, uploader('IMG', '/images').single('file'), UserController.updateProfile)
publicRouter.post('/api/users/forgot', multer().none(), UserController.forgot)
publicRouter.patch('/api/users/reset', multer().none(), AuthMiddleware.private, UserController.changePassword)
publicRouter.patch('/api/users/reset/:token', multer().none(), AuthMiddleware.reset, UserController.reset)
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