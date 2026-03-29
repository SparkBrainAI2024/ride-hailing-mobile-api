import { HttpException, HttpStatus } from '@nestjs/common'
import * as countries from 'countries-list'

export const countriesList = () => {
    try {
        const rawList = countries.countries
        let formattedList = []
        for (let key in rawList) {
            const country = rawList[key]
            formattedList.push({
                name: country.name,
                phoneCode: country.phone,
                symbol: key,
                flag: country.emoji
            })
        }
        return formattedList
    } catch (e) {
        throw new HttpException("COMMON.INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR)
    }

}