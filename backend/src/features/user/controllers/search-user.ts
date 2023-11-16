import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { userService } from '@service/db/user.service';
import { Helpers } from '@global/helpers/helpers';
import { ISearchUser } from './../interfaces/user.interface';

export class Search {
  // we will only use db for the search feature because redis doesn't have any special feature for searching
  public async user(req: Request, res: Response): Promise<void> {
    const regex = new RegExp(Helpers.escapeRegex(req.params.query), 'i'); // regex to search the users, 'i' stands for case insensitive
    const users: ISearchUser[] = await userService.searchUsers(regex);
    res.status(HTTP_STATUS.OK).json({ message: 'Search results', search: users });
  }
}
