moment.locale('fr');
window.timestampToDate = (stamp, format) => moment(stamp || Date.now()).format(format || "DD/MM/YYYY HH[h]mm")