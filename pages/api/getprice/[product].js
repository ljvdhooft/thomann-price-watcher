import { JSDOM } from 'jsdom'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const data = req.body;
        const auth_key = data.auth_key;

		const { product } = req.query //| 'genelec_1237apm'
        if (product === '0') {
            res.status(200).json('')
            return
        }
        const api_url = `https://www.thomann.de/nl/${product}.htm`;
        const options = {
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json',
            // }
        };

        const fetchResponse = await fetch(api_url, options);
        if (fetchResponse.status === 404) {
            res.status(200).json('----')
            return           
        }
        const text = await fetchResponse.text();
		const dom = new JSDOM(text);
		const script = dom.window.document.querySelector("div.price").innerHTML
		const min = script.search("</span>") + 7;
	    const link = script.substring(min, script.length - 5).replace('.', '').replace(',', '.')

        res.status(200).json(link)
    }
}