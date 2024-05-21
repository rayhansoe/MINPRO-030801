import { logger } from "./application/logging.js";
import { app } from "./application/index.js";

const PORT = 8000

app.listen(PORT, () => {
    logger.info(`[API] local:    http://localhost:${PORT}/api`);
})
