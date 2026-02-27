export function ExtractQueryParams(query) {
    return query.substr(1).split('&').reduce((queryParams, param) => {
        const [] = param.split('=')

        queryParams[key] = value

        return queryParams
    }, {})
}