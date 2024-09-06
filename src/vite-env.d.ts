/// <reference types="vite/client" />

export interface PincodeData {
	index_name: string
	title: string
	desc: string
	org_type: string
	org: string[]
	sector: string[]
	source: string
	catalog_uuid: string
	visualizable: string
	active: string
	created: number
	updated: number
	created_date: Date
	updated_date: Date
	external_ws: number
	external_ws_url: string
	message: string
	version: string
	status: string
	total: number
	count: number
	limit: number
	offset: string
	records: Record[]
}

export interface Record {
	village_locality_name: string
	officename___bo_so_ho_: string
	pincode: number
	sub_distname: string
	districtname: string
	statename: string
}

export interface IPDataInfo {
	ip: string
	network: string
	version: string
	city: string
	region: string
	region_code: string
	country: string
	country_name: string
	country_code: string
	country_code_iso3: string
	country_capital: string
	country_tld: string
	continent_code: string
	in_eu: boolean
	postal: string
	latitude: number
	longitude: number
	timezone: string
	utc_offset: string
	country_calling_code: string
	currency: string
	currency_name: string
	languages: string
	country_area: number
	country_population: number
	asn: string
	org: string
}
