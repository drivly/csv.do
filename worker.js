export const api = {
  icon: '彡',
  name: 'csv.do',
  description: 'CSV File Transformations',
  url: 'https://csv.do/api',
  type: 'https://apis.do/transformations',
  endpoints: {
    resources: 'https://csv.do/delimiter=;/',
    list: 'https://csv.do/:url',
  },
  site: 'https://csv.do',
  login: 'https://csv.do/login',
  signup: 'https://csv.do/signup',
  repo: 'https://github.com/drivly/csv.do',
}

export default {
  fetch: async (req, env) => {
    const { user, origin, requestId, method, body, time, pathname, pathSegments, pathOptions, query } = await env.CTX.fetch(req).then(res => res.json())
    let { delimiter = ',', fields } = pathOptions
    const url = `https://${pathOptions ?  pathSegments.slice(1).join('/') : pathSegments.join('/')}`
    const file = await fetch(url).then(res => res.text())
    const rows = file.split('\n')
    fields = fields ? fields.split(',') : rows[0].split(delimiter)
    
    let data = rows.map(row => row.split(delimiter).reduce((acc, val, i) => {
        acc[fields[i]] = val
        return acc
    }, {}))
 
    return new Response(JSON.stringify({api, delimiter, fields, url, data, user}, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  }
}
