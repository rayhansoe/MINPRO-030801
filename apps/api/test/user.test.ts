import supertest from "supertest"
import { logger } from "../src/application/logging"
import { app } from "../src/application"


describe('POST /api/users', () => {

  it('should reject new user if request body is invalid', async () => {
    const response = await supertest(app)
      .post('/api/users')
      .send({
        username: "",
        email: "",
        password: "",
      })

      logger.debug(response.body)
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeDefined()
  })

})