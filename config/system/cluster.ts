import cluster from 'cluster';
import Logger from 'config/logger';
import * as os from 'os';

const logger = new Logger();

// Prevent container thrashing: cap local cluster forks to a max of 2 or 3 processes inside Docker
const numCPUs = Math.min(os.cpus().length, 2);

export default class ClusterConfig {
  async set(app: { listen: (port: number | string, host: string) => any }) {
    // Standardize port fallback to 8080 if process.env.PORT is undefined
    const port = process.env.PORT || 8080;
    const host = '0.0.0.0'; // CRITICAL FOR DOCKER

    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.NODE_ENV !== 'local'
    ) {
      try {
        if (cluster.isPrimary) {
          logger.log(
            'cluster',
            'info',
            `Master ${process.pid} is running`,
            'cluster',
          );

          for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
          }

          cluster.on(
            'exit',
            (worker: { process: { pid: any } }, code: any, signal: any) => {
              logger.log(
                'cluster',
                'warn',
                `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`,
                'cluster',
              );
              logger.log('cluster', 'info', 'Starting a new worker', 'cluster');
              cluster.fork(); // Actually fork a replacement worker if one dies!
            },
          );
        } else {
          // Pass both port AND host to allow external connections
          await app.listen(port, host);
          logger.log(
            'app',
            'info',
            `Server started on port ${port} (Worker ${process.pid})`,
            'bootstrap',
          );
        }
      } catch (error: any) {
        logger.log(
          'cluster',
          'error',
          `Error in cluster setup: ${error.message}\n${error.stack}`,
          'cluster',
        );
      }
    } else {
      // In development mode, bypass clustering entirely to make testing stable
      await app.listen(port, host);
      logger.log(
        'app',
        'info',
        `Server started on port ${port} (Single Process Development Mode)`,
        'bootstrap',
      );
    }
  }
}
