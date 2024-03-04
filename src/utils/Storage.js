export const toggleSummonerFavorite = (puuid, info = null) => {
  // load from local storage
  try {
    let enabled;
    let favorites = JSON.parse(localStorage.getItem("favorite_summoners") ?? "[]");
    let isFavorite = false;

    if (puuid == null) {
      return;
    }

    console.log(favorites);

    // find if the summoner is already in favorites
    for (const f of favorites) {
      if (f.puuid === puuid) {
        isFavorite = true;
        break;
      }
    }

    if (isFavorite) {
      favorites = favorites.filter((f) => f.puuid !== puuid);
      enabled = false;
    } else if (info != null) {
      const { gameName, tagLine, profileIconId } = info;
      if (gameName == null || tagLine == null || profileIconId == null) {
        return;
      }

      favorites.push({
        profileIconId: profileIconId,
        gameName: gameName,
        tagLine: tagLine,
        puuid: puuid,
      });
      enabled = true;
    }
    localStorage.setItem("favorite_summoners", JSON.stringify(favorites));
    return enabled;
  } catch (err) {
    throw err;
  }
};

export const updateSummonerInfo = (puuid, info) => {
  // load from local storage
  try {
    let summoners = JSON.parse(localStorage.getItem("favorite_summoners") ?? "[]");
    let isExist = false;

    if (puuid == null) {
      return;
    }

    for (let i = 0; i < summoners.length; i++) {
      if (summoners[i].puuid === puuid) {
        summoners[i] = info;
        isExist = true;
        break;
      }
    }

    localStorage.setItem("favorite_summoners", JSON.stringify(summoners));
  } catch (err) {
    throw err;
  }
};
