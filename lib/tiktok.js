const axios = require('axios')
const cheerio = require('cheerio')

async function tiktokDown(link) {
	const Result = []
	await axios.request({
		url: `https://ttdownloader.com/`,
		method: "get",
		headers: {
			"accept-language": "en-US,en;q=0.9,id;q=0.8",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
				"cookie": "_ga=GA1.2.1240046717.1620835673; PHPSESSID=797oo0b7ao6ma18170vfggf8sa; popCookie=1; _gid=GA1.2.182249774.1621486055; _gat_gtag_UA_117413493_7=1"
		}
	})
	.then(async res => {
		const $ = cheerio.load(res.data)
		let token = $('#token').attr('value');
		const Form = {
			url: link,
			format: '',
			token: token
		}
		await axios("https://ttdownloader.com/ajax/", {
			method: "POST",
			data: new URLSearchParams(Object.entries(Form)),
			headers: {
				"accept": "*/*",
				"accept-language": "en-US,en;q=0.9,id;q=0.8",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
				"cookie": "_ga=GA1.2.1240046717.1620835673; PHPSESSID=797oo0b7ao6ma18170vfggf8sa; popCookie=1; _gid=GA1.2.182249774.1621486055; _gat_gtag_UA_117413493_7=1"
			}
		}).then(respon => {
			const ch = cheerio.load(respon.data)
			let result = {
				status: respon.status,
				author: 'RA BOT',
				result: {
					nowm: ch('#results-list > div:nth-child(2)').find('div.download > a').attr('href'),
					wm: ch('#results-list > div:nth-child(3)').find('div.download > a').attr('href'),
					audio: ch('#results-list > div:nth-child(4)').find('div.download > a').attr('href')
				}
			}
			Result.push(result)
		})
	})
	return Result[0]
}

module.exports = { tiktokDown }