import { useContext } from "react";
import skillsReference from "../RawData/bpSkills.json";
import { EveESIStatusContext } from "../Context/EveDataContext";

export function useEveApi() {
  const { eveESIStatus, updateEveESIStatus } = useContext(EveESIStatusContext);

  const CharacterSkills = async (userObj) => {
    try {
      const skillsPromise = await fetch(
        `https://esi.evetech.net/latest/characters/${userObj.CharacterID}/skills/?datasource=tranquility&token=${userObj.aToken}`
      );
      const skillsJSON = await skillsPromise.json();

      const newSkillArray = [];
      if (skillsPromise.status !== 200) {
        return [];
      }
      skillsReference.forEach((ref) => {
        const x = skillsJSON.skills.find((s) => ref.id === s.skill_id);
        const y = {
          id: ref.id,
          activeLevel: null,
        };

        if (x !== undefined) {
          y.activeLevel = x.active_skill_level;
        } else {
          y.activeLevel = 0;
        }
        newSkillArray.push(y);
      });

      return newSkillArray;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const IndustryJobs = async (userObj) => {
    try {
      const indyPromise = await fetch(
        `https://esi.evetech.net/latest/characters/${userObj.CharacterID}/industry/jobs/?datasource=tranquility&include_completed=true&token=${userObj.aToken}`
      );

      const indyJSON = await indyPromise.json();

      if (indyPromise.status !== 200) {
        return [];
      }
      let filterOld = indyJSON.filter(
        (job) =>
          job.completed_date === undefined ||
          new Date() - Date.parse(job.completed_date) <= 1209600000
        // 10 days
      );

      filterOld.forEach((job) => {
        job.isCorp = false;
      });
      return filterOld;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const MarketOrders = async (userObj) => {
    try {
      const marketPromise = await fetch(
        `https://esi.evetech.net/latest/characters/${userObj.CharacterID}/orders/?datasource=tranquility&token=${userObj.aToken}`
      );

      let marketJSON = await marketPromise.json();

      if (marketPromise.status !== 200) {
        return [];
      }
      marketJSON = marketJSON.filter((item) => !item.is_buy_order);

      marketJSON.forEach((item) => {
        item.CharacterHash = userObj.CharacterHash;
      });

      return marketJSON;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const HistoricMarketOrders = async (userObj) => {
    const returnArray = [];

    let pageCount = 1;
    while (pageCount < 11) {
      try {
        const histPromise = await fetch(
          `https://esi.evetech.net/latest/characters/${userObj.CharacterID}/orders/history/?datasource=tranquility&page=${pageCount}&token=${userObj.aToken}`
        );
        const histJSON = await histPromise.json();
        if (histPromise.status === 200) {
          histJSON.forEach((item) => {
            returnArray.push(item);
          });

          if (histJSON.length < 2501) {
            pageCount = 11;
          } else {
            pageCount++;
          }
        } else {
          pageCount = 11;
        }
      } catch (err) {
        return [];
      }
    }
    let filtered = returnArray.filter((item) => !item.is_buy_order);

    filtered.forEach((item) => {
      item.CharacterHash = userObj.CharacterHash;
    });

    return filtered;
  };

  const BlueprintLibrary = async (userObj) => {
    let returnArray = [];
    let pageCount = 1;
    while (pageCount < 11) {
      try {
        const blueprintPromise = await fetch(
          `https://esi.evetech.net/latest/characters/${userObj.CharacterID}/blueprints/?datasource=tranquility&page=${pageCount}&token=${userObj.aToken}`
        );

        const blueprintJSON = await blueprintPromise.json();
        if (blueprintPromise.status === 200) {
          returnArray = returnArray.concat(blueprintJSON);

          if (blueprintJSON.length < 1000) {
            pageCount = 11;
          } else {
            pageCount++;
          }
        } else {
          pageCount = 11;
        }
      } catch (err) {
        pageCount = 11;
        console.log(err);
        return [];
      }
    }
    return returnArray;
  };

  const WalletTransactions = async (userObj) => {
    try {
      const transactionsPromise = await fetch(
        `https://esi.evetech.net/latest/characters/${userObj.CharacterID}/wallet/transactions/?datasource=tranquility&token=${userObj.aToken}`
      );

      const transactionsJSON = await transactionsPromise.json();
      if (transactionsPromise.status === 200) {
        const filtered = transactionsJSON.filter(
          (i) =>
            i.is_buy === false && new Date() - Date.parse(i.date) <= 1209600000
        );
        return filtered;
      } else return [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const WalletJournal = async (userObj) => {
    let pageCount = 1;
    let returnArray = [];
    while (pageCount < 11) {
      try {
        const journalPromise = await fetch(
          `https://esi.evetech.net/latest/characters/${userObj.CharacterID}/wallet/journal/?datasource=tranquility&page=${pageCount}&token=${userObj.aToken}`
        );

        let journalJSON = await journalPromise.json();
        if (journalPromise.status === 200) {
          let currentDate = new Date();

          journalJSON = journalJSON.filter(
            (item) => currentDate - Date.parse(item.date) <= 1209600000
          );
          returnArray = returnArray.concat(journalJSON);

          if (journalJSON.length < 1000) {
            pageCount = 11;
          } else {
            pageCount++;
          }
        } else {
          pageCount = 11;
        }
      } catch (err) {
        pageCount = 11;
        console.log(err);
        return [];
      }
    }

    return returnArray;
  };

  const IDtoName = async (idArray, userObj) => {
    let citadelIDs = idArray.filter((i) => i.toString().length > 10);

    let standardIDs = idArray.filter((i) => i.toString().length < 10);
    let newArray = [];
    if (standardIDs.length > 0) {
      const idPromise = await fetch(
        `https://esi.evetech.net/latest/universe/names/?datasource=tranquility`,
        {
          method: "POST",
          body: JSON.stringify(standardIDs),
        }
      );
      if (idPromise.status === 200) {
        const idJSON = await idPromise.json();
        newArray = newArray.concat(idJSON);
      }
    }
    if (citadelIDs.length > 0) {
      for (let id of citadelIDs) {
        const idPromise = await fetch(
          `https://esi.evetech.net/latest/universe/structures/${id}/?datasource=tranquility&token=${userObj.aToken}`
        );
        if (idPromise.status === 200) {
          const idJSON = await idPromise.json();

          idJSON.id = id;
          newArray.push(idJSON);
        } else if (idPromise.status === 403) {
          newArray.push({ id: id, name: "No Access To Location" });
        } else {
          break;
        }
      }
    }
    return newArray;
  };

  const serverStatus = async () => {
    try {
      const statusPromise = await fetch(
        "https://esi.evetech.net/latest/status/?datasource=tranquility"
      );

      const statusJSON = await statusPromise.json();
      if (statusPromise.status === 200 || statusPromise.status === 304) {
        let newAttempt = [...eveESIStatus.serverStatus.attempts];
        if (newAttempt.length <= 5) {
          newAttempt.push(1);
        } else {
          newAttempt.shift();
          newAttempt.push(1);
        }
        updateEveESIStatus((prev) => ({
          ...prev,
          serverStatus: {
            online: true,
            playerCount: statusJSON.players,
            attempts: newAttempt,
          },
        }));
        return true;
      } else {
        let newAttempt = [...eveESIStatus.serverStatus.attempts];
        if (newAttempt.length <= 5) {
          newAttempt.push(0);
        } else {
          newAttempt.shift();
          newAttempt.push(0);
        }
        updateEveESIStatus((prev) => ({
          ...prev,
          serverStatus: {
            online: false,
            playerCount: 0,
            attempts: newAttempt,
          },
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fullAssetsList = async (userObj) => {
    let pageCount = 1;
    let returnArray = [];

    while (pageCount < 21) {
      try {
        const assetPromise = await fetch(
          `https://esi.evetech.net/latest/characters/${userObj.CharacterID}/assets/?datasource=tranquility&page=${pageCount}&token=${userObj.aToken}`
        );
        const assetJSON = await assetPromise.json();

        if (assetPromise.status === 200) {
          assetJSON.forEach((item) => {
            item.CharacterHash = userObj.CharacterHash;
          });
          returnArray = returnArray.concat(assetJSON);

          if (assetJSON.length < 1000) {
            pageCount = 21;
          } else {
            pageCount++;
          }
        } else {
          pageCount = 21;
        }
      } catch (err) {
        pageCount = 21;
        console.log(err);
        return [];
      }
    }
    return returnArray;
  };

  const standingsList = async (userObj) => {
    try {
      const standingsPromise = await fetch(
        `https://esi.evetech.net/latest/characters/${userObj.CharacterID}/standings/?datasource=tranquility&token=${userObj.aToken}`
      );
      const standingsJSON = await standingsPromise.json();

      if (standingsPromise.status !== 200) {
        return [];
      }
      return standingsJSON;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const stationData = async (stationID) => {
    try {
      const stationDataPromise = await fetch(
        `https://esi.evetech.net/latest/universe/stations/${stationID}`
      );

      const stationDataJson = await stationDataPromise.json();

      if (stationDataPromise.status === 200) {
        return stationDataJson;
      }
    } catch (err) {
      return null;
    }
  };

  const characterData = async (userObj) => {
    try {
      const characterPromise = await fetch(
        `https://esi.evetech.net/legacy/characters/${userObj.CharacterID}/?datasource=tranquility`
      );
      const characterData = await characterPromise.json();

      if (characterPromise.status === 200) {
        return characterData;
      }
    } catch (err) {
      return {};
    }
  };

  const corpIndustryJobs = async (userObj) => {
    let returnArray = [];
    let pageCount = 1;
    while (pageCount < 11) {
      try {
        const corpIndyPromise = await fetch(
          `https://esi.evetech.net/latest/corporations/${userObj.corporation_id}/industry/jobs/?include_completed=true&page=${pageCount}&token=${userObj.aToken}`
        );
        const corpIndyJSON = await corpIndyPromise.json();
        if (corpIndyPromise.status === 200) {
          let filterOld = corpIndyJSON.filter(
            (job) =>
              job.completed_date === undefined ||
              new Date() - Date.parse(job.completed_date) <= 1209600000
            // 10 days
          );

          let filterOnlyChar = filterOld.filter(
            (job) => job.installer_id === userObj.CharacterID
          );

          filterOnlyChar.forEach((job) => {
            job.isCorp = true;
          });

          returnArray = returnArray.concat(filterOnlyChar);

          if (corpIndyJSON.length < 1000) {
            pageCount = 11;
          } else {
            pageCount++;
          }
        } else {
          pageCount = 11;
        }
      } catch (err) {
        pageCount = 11;
        console.log(err);
        return [];
      }
    }

    return returnArray;
  };

  return {
    BlueprintLibrary,
    characterData,
    CharacterSkills,
    corpIndustryJobs,
    fullAssetsList,
    HistoricMarketOrders,
    IDtoName,
    IndustryJobs,
    MarketOrders,
    serverStatus,
    standingsList,
    stationData,
    WalletTransactions,
    WalletJournal,
  };
}
