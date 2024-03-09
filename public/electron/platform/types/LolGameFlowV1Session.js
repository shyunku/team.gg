import Serializable from "../utils/Serializable.js";

export default class LolGameFlowV1Session extends Serializable {
  constructor(data) {
    super(data);

    /** @type {GameClient} */
    this.gameClient;
    /** @type {GameData} */
    this.gameData;
    /** @type {GameDodge} */
    this.gameDodge;
    /** @type {Map} */
    this.map;
    /** @type {string} */
    this.phase;
  }
}

class GameClient {
  constructor() {
    /** @type {string} */
    this.observerServerIp = null;
    /** @type {number} */
    this.observerServerPort = null;
    /** @type {bool} */
    this.running = null;
    /** @type {string} */
    this.serverIp = null;
    /** @type {number} */
    this.serverPort = null;
    /** @type {bool} */
    this.visible = null;
  }
}

class GameData {
  constructor() {
    /** @type {number} */
    this.gameId = null;
    /** @type {string} */
    this.gameName = null;
    /** @type {bool} */
    this.isCustomGame = null;
    /** @type {string} */
    this.password = null;
    /** @type {Array<any>} */
    this.playerChampionSelections = [];
    /** @type {Queue} */
    this.queue = null;
    /** @type {bool} */
    this.spectatorsAllowed = null;
    /** @type {Array<any>} */
    this.teamOne = [];
    /** @type {Array<any>} */
    this.teamTwo = [];
  }
}

class Queue {
  constructor() {
    /** @type {Array<number>} */
    this.allowablePremadeSizes = [];
    /** @type {bool} */
    this.areFreeChampionsAllowed = null;
    /** @type {string} */
    this.assetMutator = null;
    /** @type {string} */
    this.category = null;
    /** @type {number} */
    this.championsRequiredToPlay = null;
    /** @type {string} */
    this.description = null;
    /** @type {string} */
    this.detailedDescription = null;
    /** @type {string} */
    this.gameMode = null;
    /** @type {GameTypeConfig} */
    this.gameTypeConfig = null;
    /** @type {number} */
    this.id = null;
    /** @type {bool} */
    this.isRanked = null;
    /** @type {bool} */
    this.isTeamBuilderManaged = null;
    /** @type {number} */
    this.lastToggledOffTime = null;
    /** @type {number} */
    this.lastToggledOnTime = null;
    /** @type {number} */
    this.mapId = null;
    /** @type {number} */
    this.maximumParticipantListSize = null;
    /** @type {number} */
    this.minLevel = null;
    /** @type {number} */
    this.minimumParticipantListSize = null;
    /** @type {string} */
    this.name = null;
    /** @type {number} */
    this.numPlayersPerTeam = null;
    /** @type {string} */
    this.queueAvailability = null;
    /** @type {QueueRewards} */
    this.queueRewards = null;
    /** @type {bool} */
    this.removalFromGameAllowed = null;
    /** @type {number} */
    this.removalFromGameDelayMinutes = null;
    /** @type {string} */
    this.shortName = null;
    /** @type {bool} */
    this.showPositionSelector = null;
    /** @type {bool} */
    this.spectatorEnabled = null;
    /** @type {string} */
    this.type = null;
  }
}

class GameTypeConfig {
  constructor() {
    /** @type {bool} */
    this.advancedLearningQuests = null;
    /** @type {bool} */
    this.allowTrades = null;
    /** @type {string} */
    this.banMode = null;
    /** @type {number} */
    this.banTimerDuration = null;
    /** @type {bool} */
    this.battleBoost = null;
    /** @type {bool} */
    this.crossTeamChampionPool = null;
    /** @type {bool} */
    this.deathMatch = null;
    /** @type {bool} */
    this.doNotRemove = null;
    /** @type {bool} */
    this.duplicatePick = null;
    /** @type {bool} */
    this.exclusivePick = null;
    /** @type {number} */
    this.id = null;
    /** @type {bool} */
    this.learningQuests = null;
    /** @type {number} */
    this.mainPickTimerDuration = null;
    /** @type {number} */
    this.maxAllowableBans = null;
    /** @type {string} */
    this.name = null;
    /** @type {bool} */
    this.onboardCoopBeginner = null;
    /** @type {string} */
    this.pickMode = null;
    /** @type {number} */
    this.postPickTimerDuration = null;
    /** @type {bool} */
    this.reroll = null;
    /** @type {bool} */
    this.teamChampionPool = null;
  }
}

class QueueRewards {
  constructor() {
    /** @type {bool} */
    this.isChampionPointsEnabled = null;
    /** @type {bool} */
    this.isIpEnabled = null;
    /** @type {bool} */
    this.isXpEnabled = null;
    /** @type {Array<any>} */
    this.partySizeIpRewards = [];
  }
}

class GameDodge {
  constructor() {
    /** @type {Array<any>} */
    this.dodgeIds = [];
    /** @type {string} */
    this.phase = null;
    /** @type {string} */
    this.state = null;
  }
}
