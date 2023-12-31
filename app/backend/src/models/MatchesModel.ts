import IMatches from '../Interfaces/Matches/IMatches';
import { IMatchesModel } from '../Interfaces/Matches/IMatchesModel';
import SequelizeMatches from '../database/models/SequelizeMatches';
import SequelizeTeams from '../database/models/SequelizeTeams';

export default class MatchesModel implements IMatchesModel {
  private model = SequelizeMatches;

  async findAll(): Promise<IMatches[]> {
    const matches = await this.model.findAll({
      include: [
        {
          model: SequelizeTeams,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
        {
          model: SequelizeTeams,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
      ],
    });
    return matches;
  }

  async finishMatch(id:number): Promise<void> {
    await this.model.update({ inProgress: false }, { where: { id } });
  }

  public async updateMatch(
    id: number,
    homeTeam: number,
    awayTeam: number,
  ): Promise<boolean> {
    await this.model.update(
      { homeTeamGoals: homeTeam, awayTeamGoals: awayTeam },
      { where: { id } },
    );
    return true;
  }

  public async create(data: IMatches): Promise<IMatches> {
    const { homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals } = data;
    const match = await this.model.create({
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
      inProgress: true,
    });
    return match;
  }

  async findById(id: number): Promise<IMatches | null> {
    const dbData = await this.model.findByPk(id);
    if (dbData == null) return null;

    return dbData;
  }
}
