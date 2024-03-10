import Serializable from "../utils/Serializable.js";

export default class LolSummonerV1CurrentSummoner extends Serializable {
  constructor(data) {
    super(data);

    /** @type {number}  */
    this.accountId;
    /** @type {string}  */
    this.displayName;
    /** @type {string}  */
    this.gameName;
    /** @type {string}  */
    this.internalName;
    /** @type {bool}  */
    this.nameChangeFlag;
    /** @type {number}  */
    this.percentCompleteForNextLevel;
    /** @type {string}  */
    this.privacy;
    /** @type {number}  */
    this.profileIconId;
    /** @type {string}  */
    this.puuid;
    /** @type {RerollPoints}  */
    this.rerollPoints;
    /** @type {number}  */
    this.summonerId;
    /** @type {number}  */
    this.summonerLevel;
    /** @type {string}  */
    this.tagLine;
    /** @type {bool}  */
    this.unnamed;
    /** @type {number}  */
    this.xpSinceLastLevel;
    /** @type {number}  */
    this.xpUntilNextLevel;
  }
}

class RerollPoints {
  constructor() {
    /** @type {number}  */
    this.currentPoints = null;
    /** @type {number}  */
    this.maxRolls = null;
    /** @type {number}  */
    this.numberOfRolls = null;
    /** @type {number}  */
    this.pointsCostToRoll = null;
    /** @type {number}  */
    this.pointsToReroll = null;
  }
}
