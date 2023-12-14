export const toggleSummonerFavorite = (puuid, info = null) => {
  // load from local storage
  try {
    let enabled;
    let favorites = JSON.parse(localStorage.getItem("favorite_summoners") ?? "[]");
    let isFavorite = false;

    if (puuid == null) {
      return;
    }

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
