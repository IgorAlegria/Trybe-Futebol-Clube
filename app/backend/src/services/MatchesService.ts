import { IMatches } from '../Interfaces/Matches/IMatches';
import { IMatchesModel } from '../Interfaces/Matches/IMatchesModel';
import MatchesModel from '../models/MatchesModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

export default class MatcheService {
  constructor(
    private matches: IMatchesModel = new MatchesModel(),
  ) { }

  public async findAll(inProgress: string): Promise<ServiceResponse<IMatches[]>> {
    const getAllMatches = await this.matches.findAll();

    if (!inProgress) {
      return { status: 'SUCCESSFUL', data: getAllMatches };
    }

    if (inProgress === 'true') {
      const data = getAllMatches.filter((match) => match.inProgress === true);
      return { status: 'SUCCESSFUL', data };
    }

    const data = getAllMatches.filter((match) => match.inProgress === false);
    return { status: 'SUCCESSFUL', data };
  }
}