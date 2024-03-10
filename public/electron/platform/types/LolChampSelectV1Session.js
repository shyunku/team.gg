import Serializable from "../utils/Serializable.js";

export default class LolChampSelectV1Session extends Serializable {
  constructor(data) {
    super(data);

    /** @type {Array<Action>} */
    this.actions;
    /** @type {bool} */
    this.allowBattleBoost;
    /** @type {bool} */
    this.allowDuplicatePicks;
    /** @type {bool} */
    this.allowLockedEvents;
    /** @type {bool} */
    this.allowRerolling;
    /** @type {bool} */
    this.allowSkinSelection;
    /** @type {Bans} */
    this.bans;
    /** @type {Array<any>} */
    this.benchChampions;
    /** @type {bool} */
    this.benchEnabled;
    /** @type {number} */
    this.boostableSkinCount;
    /** @type {ChatDetails} */
    this.chatDetails;
    /** @type {number} */
    this.counter;
    /** @type {number} */
    this.gameId;
    /** @type {bool} */
    this.hasSimultaneousBans;
    /** @type {bool} */
    this.hasSimultaneousPicks;
    /** @type {bool} */
    this.isCustomGame;
    /** @type {bool} */
    this.isSpectating;
    /** @type {number} */
    this.localPlayerCellId;
    /** @type {number} */
    this.lockedEventIndex;
    /** @type {Array<Teammate>} */
    this.myTeam;
    /** @type {Array<any>} */
    this.pickOrderSwaps;
    /** @type {number} */
    this.recoveryCounter;
    /** @type {number} */
    this.rerollsRemaining;
    /** @type {bool} */
    this.skipChampionSelect;
    /** @type {Array<Teammate>} */
    this.theirTeam;
    /** @type {Timer} */
    this.timer;
    /** @type {Array<any>} */
    this.trades;
  }
}

class Action {
  constructor() {
    /** @type {number} */
    this.actorCellId;
    /** @type {number} */
    this.championId;
    /** @type {bool} */
    this.completed;
    /** @type {number} */
    this.id;
    /** @type {bool} */
    this.isAllyAction;
    /** @type {bool} */
    this.isInProgress;
    /** @type {number} */
    this.pickTurn;
    /** @type {string} */
    this.type;
  }
}

class Bans {
  constructor() {
    /** @type {Array<number>} */
    this.myTeamBans;
    /** @type {number} */
    this.numBans;
    /** @type {Array<number>} */
    this.theirTeamBans;
  }
}

class ChatDetails {
  constructor() {
    /** @type {MucJwtDto} */
    this.mucJwtDto;
    /** @type {string} */
    this.multiUserChatId;
    /** @type {string} */
    this.multiUserChatPassword;
  }
}

class Teammate {
  constructor() {
    /** @type {string} */
    this.assignedPosition;
    /** @type {number} */
    this.cellId;
    /** @type {number} */
    this.championId;
    /** @type {number} */
    this.championPickIntent;
    /** @type {string} */
    this.nameVisibilityType;
    /** @type {string} */
    this.obfuscatedPuuid;
    /** @type {number} */
    this.obfuscatedSummonerId;
    /** @type {string} */
    this.puuid;
    /** @type {number} */
    this.selectedSkinId;
    /** @type {number} */
    this.spell1Id;
    /** @type {number} */
    this.spell2Id;
    /** @type {number} */
    this.summonerId;
    /** @type {number} */
    this.team;
    /** @type {number} */
    this.wardSkinId;
  }
}

class MucJwtDto {
  constructor() {
    /** @type {string} */
    this.channelClaim;
    /** @type {string} */
    this.domain;
    /** @type {string} */
    this.jwt;
    /** @type {string} */
    this.targetRegion;
  }
}

class Timer {
  constructor() {
    /** @type {number} */
    this.adjustedTimeLeftInPhase;
    /** @type {number} */
    this.internalNowInEpochMs;
    /** @type {bool} */
    this.isInfinite;
    /** @type {string} */
    this.phase;
    /** @type {number} */
    this.totalTimeInPhase;
  }
}
