var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/chance', async function (req, res, next) {
  const { hora: time, fecha: today = new Date().toISOString().substr(0, 10) } = req.query;
  const localTime = getTime(time);
  const localDate = today.toString().split("-").reverse().join("/")
  try {
    const data = await axios.get(`http://tuchance.com.ve/Home/FechaResul?fecha=${localDate}`)
    const result = data.data.filter(item => {
      if (item.fecSorteo.indexOf(` ${localTime}`) > -1) return true;
    })[0]
    if (!result) return res.json({ error: 'no data' })
    res.json({
      ganador: result.codAnimalA,
      fecha: localDate,
      hora: localTime,
      sorteo: "chance"
    })
  } catch (e) {
    res.json({
      error: e.message
    })
  }
});

function getTime(/** @type {string} */ time) {
  const regPattern = /\d{1,2}/;
  const regResult = regPattern.exec(time);
  const localTime = regResult[0];
  if (regResult) return `${localTime}:00`;
}

module.exports = router;
