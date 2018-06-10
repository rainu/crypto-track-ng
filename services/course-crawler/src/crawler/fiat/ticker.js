"use strict";

const request = require('../../../../../common/request_repeater');
const cheerio = require('cheerio');
const TickerCourse = require('../../../../../common/db/model/course/ticker');

const saveCourses = function(courses){
  if(!courses || courses.length === 0) {
    return Promise.resolve()
  }

  let bulk = TickerCourse.collection.initializeUnorderedBulkOp();
  for(let curCourse of courses) {
    let where = {
      currency: curCourse.currency,
      "price.currency": curCourse.price.currency
    }

    //add bulk operation
    bulk.find(where).upsert().updateOne(curCourse);
  }

  //return a promise of db-execute
  return bulk.execute()
}

const extractData = function(data){
  return {
    currency: {
      name: data.from,
      type: 'fiat'
    },
    price: {
      amount: data.value,
      currency: {
        name: data.to,
        type: 'fiat'
      },
    },
    change: {
      day: data.change,
    }
  }
}

const parsePage = function(body) {
  const $ = cheerio.load(body);

  /*
    Example content for dif '.col-lg-4'[0]

    <div class="col-lg-4">
      <div class="list-box" style="min-height:255px">
				<h2 class="box">
					EUR/USD Realtimekurs
				</h2>
					<table class="table normal-font">
						<tbody>
							<tr>
								<td colspan="4">
									<span class="type">Letzter</span><br><br>

									<span class="price inline"><div data-field="Mid" data-item="Y0306000000EURUSD" data-template="Mid" data-source="mdsng" data-table="1" class="" data-room="RY0306000000EURUSD" style="display: inline;"><span class="push-data price" data-format="minimumFractionDigits:4" data-animation="">1,1771</span></div></span>

									<span class="currency">USD</span>
								</td>
							</tr>
							<tr>
								<td>
									<strong>Kurszeit</strong>
								</td>
								<td>
									<div data-field="MidTimestamp" data-item="Y0306000000EURUSD" data-template="MidTimestamp" data-source="mdsng" data-table="1" class="" data-room="RY0306000000EURUSD" style="display: inline;"><span class="push-data " data-format="utcToApplicationOffset:2;" data-animation="animationType:none"> </span></div>
								</td>
								<td>
									<strong>Vortag</strong>
								</td>
								<td>
									1,1753
								</td>
							</tr>
							<tr>
								<td>
									<strong>+/-</strong>
								</td>
								<td>
									<div data-source="mdsng" data-table="1" data-item="Y0306000000EURUSD" class="" style="display: inline;" data-room="RY0306000000EURUSD" data-field="changeabs"><span class="push-data colorGreen " data-format="minimumFractionDigits:4" data-animation="animationType:color" data-jsvalue="1.1753">0,0018</span></div>
								</td>
								<td>
									<strong>%</strong>
								</td>
								<td>
									<div data-source="mdsng" data-table="1" data-item="Y0306000000EURUSD" class="" style="display: inline;" data-room="RY0306000000EURUSD" data-field="changeper"><span class="push-data colorGreen " data-format="maximumFractionDigits:2" data-animation="animationType:color" data-jsvalue="1.1753">0,15%</span></div>
								</td>
							</tr>
						</tbody>
					</table>
		  </div>
		</div>
   */

  const dataBox = $('.col-lg-4')[0];
  const pair = $(dataBox).find('h2.box').text().trim().split(' ')[0]
  const from = pair.split('/')[0]
  const to = pair.split('/')[1]

  const sValue = $(dataBox).find('.push-data.price').text()
  const fValue = Number.parseFloat(sValue.replace('.', ' ').replace(',', '.'))

  const sDayChange = $($($(dataBox).find('table tr')[2]).find('td')[1]).find('span').text()
  const fDayChange = Number.parseFloat(sDayChange.replace('.', ' ').replace(',', '.'))

  return [
    extractData({
      from, to, value: fValue, change: fDayChange
    }),
    extractData({
      from: to, to: from, value: 1 / fValue, change: fDayChange
    }),
  ]
}

const get = function(slug) {
  const url = `https://www.boerse-online.de/devisen/realtimekurs/${slug}`

  return request(url)
    .then(({body}) => parsePage(body))
    .then(saveCourses)
}

const crawl = function(){
  return get('dollarkurs')
}

module.exports = crawl;

