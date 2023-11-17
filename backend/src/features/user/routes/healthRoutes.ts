import HTTP_STATUS from 'http-status-codes';
import axios from 'axios';
import express, { Router, Request, Response } from 'express';
import moment from 'moment';
import { performance } from 'perf_hooks'; // No need to install perf_hooks, it is a part from nodejs module, it is used to calculate the time for the request to be made
import { config } from '@root/config';

class HealthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public health(): Router {
    this.router.get('/health', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.OK).send(`Health: Server instance is healthy with process id ${process.pid} on ${moment().format('LL')}`); // give it a full moment time
    });

    return this.router;
  }

  // this will display the exact environment on which we are on
  public env(): Router {
    this.router.get('/env', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.OK).send(`This is the ${config.NODE_ENV} environment.`);
    });

    return this.router;
  }

  public instance(): Router {
    this.router.get('/instance', async (req: Request, res: Response) => {
      const response = await axios({
        method: 'get',
        url: config.EC2_URL // url from aws to get the instance id
      });
      res.status(HTTP_STATUS.OK).send(`Server is running on EC2 instance with id ${response.data} and process id ${process.pid} on ${moment().format('LL')}`);
    });

    return this.router;
  }

  public fiboRoutes(): Router {
    this.router.get('/fibo/:num', async (req: Request, res: Response) => {
      const { num } = req.params;
      const start: number = performance.now();
      const result: number = this.fibo(parseInt(num, 10));
      const end: number = performance.now();
      const response = await axios({
        method: 'get',
        url: config.EC2_URL // url from aws to get the instance id
      });
      res.status(HTTP_STATUS.OK).send(
        `Fibonacci series of ${num} is ${result} and it took ${end - start}ms with EC2 instance of ${
          response.data
        } and process id ${process.pid} on ${moment().format('LL')}`
      );
    });

    return this.router;
  }

  // a recursive function to put heavy load on the server to check its performance
  private fibo(data: number): number {
    if(data < 2) {
      return 1;
    } else {
      return this.fibo(data - 2) + this.fibo(data - 1);
    }
  }
}

export const healthRoutes: HealthRoutes = new HealthRoutes();

