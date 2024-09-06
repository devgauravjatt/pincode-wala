import { Notyf } from 'notyf'
import './style.css'

import 'notyf/notyf.min.css'

import type { IPDataInfo, PincodeData, Record } from './vite-env'

console.log('javascript is working fine 💖')

// Create an instance of Notyf
const notyf = new Notyf({
	position: {
		x: 'center',
		y: 'top',
	},
})

const pincodeInput: HTMLInputElement | null =
	document.querySelector('.searchTerm')

const searchButton = document.querySelector(
	'.searchButton'
) as HTMLButtonElement

const officename = document.querySelector('#officename') as HTMLSelectElement

const getLocationBtn = document.querySelector(
	'.get-location'
) as HTMLButtonElement

const DataUi1 = document.querySelector('.data-ui-1') as Element

const sub_distname = document.querySelector(
	'#sub_distname'
) as HTMLSelectElement

const pincode_data_table = document.querySelector(
	'.pincode-data-table'
) as Element

// notify funtions

function notify_fetch(msg: string) {
	notyf.dismissAll()
	notyf.success({
		background: 'green',
		message: msg,
		duration: 30000,
	})
}
function notify_done() {
	notyf.dismissAll()
	notyf.success({
		background: 'green',
		message: 'Data fetched successfully',
		duration: 2000,
	})
}

function notify_error(err: string) {
	notyf.dismissAll()
	notyf.error({
		background: 'red',
		message: err,
		duration: 2000,
	})
}

function notify_removeAll() {
	notyf.dismissAll()
}

async function pincodeApiCall(pincode: string) {
	const res = await fetch(
		`https://api.data.gov.in/resource/9115b89c-7a80-4f54-9b06-21086e0f0bd7?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=50&filters%5Bpincode%5D=${pincode}#`
	)
	const data: PincodeData = await res.json()
	if (data.count === 0) {
		notify_error('invalid pincode area')
	}
	return data
}

function UiUpdate(data: PincodeData, pincode: string) {
	DataUi1.innerHTML = `
	            <ul>
						<li>
							<div>
								<p>Statename</p>
								<p>-</p>
								<p>${data.records[0].statename}</p>
							</div>
						</li>
						<li>
							<div>
								<p>District</p>
								<p>-</p>
								<p>${data.records[0].districtname}</p>
							</div>
						</li>

						<li>
							<div>
								<p>Pincode</p>
								<p>-</p>
								<p>${pincode}</p>
							</div>
						</li>
					</ul>
	`

	function change_table(officenameValue: string) {
		const filteredData = data.records.filter(
			(record) => record.officename___bo_so_ho_ === officenameValue
		)
		pincode_data_table.innerHTML = `
			<table>
						<thead>
							<tr>
								<th>Village</th>
								<th>Officename</th>
							</tr>
						</thead>
						<tbody>
							${filteredData.map(
								(record) => `<tr>
								<td>${record.village_locality_name}</td>
								<td>${record.officename___bo_so_ho_}</td>
							</tr>`
							)}
						</tbody>
					</table>
		`
	}

	function change_select_ui_2(sub_distnameValue: string) {
		const filteredData = data.records.filter(
			(record) => record.sub_distname === sub_distnameValue
		)

		const officename___bo_so_ho_list: string[] = [
			...new Set(filteredData.map((record) => record.officename___bo_so_ho_)),
		]
		officename.innerHTML = `
				${officename___bo_so_ho_list
					.map((sub_distname) => {
						return `<option value="${sub_distname}">${sub_distname}</option>`
					})
					.join('')}
		`

		change_table(officename___bo_so_ho_list[0])
	}

	const allSub_distname: string[] = [
		...new Set(data.records.map((record) => record.sub_distname)),
	]
	sub_distname.innerHTML = `
			${allSub_distname
				.map((sub_distname) => {
					return `<option value="${sub_distname}">${sub_distname}</option>`
				})
				.join('')}
	`

	change_select_ui_2(allSub_distname[0])

	change_table(data.records[0].officename___bo_so_ho_)

	sub_distname.addEventListener('change', () => {
		const sub_distnameValue = sub_distname.value
		change_select_ui_2(sub_distnameValue)
	})

	officename.addEventListener('change', () => {
		const officenameValue = officename.value
		change_table(officenameValue)
	})
}

async function RunPineCode() {
	const pincode = pincodeInput?.value || ''
	if (pincode.length === 6) {
		const data = await pincodeApiCall(pincode)
		UiUpdate(data, pincode)
		notify_done()
	} else {
		notify_error('invalid pincode')
	}
}

searchButton.addEventListener('click', () => {
	notify_fetch('Fetching data wait...')
	RunPineCode()
})

async function OnRunCode() {
	const res = await fetch('https://ipapi.co/json')
	const ipInfo: IPDataInfo = await res.json()

	if (ipInfo.postal.length === 6) {
		const data = await pincodeApiCall(ipInfo.postal)
		UiUpdate(data, ipInfo.postal)
		notyf.dismissAll()
	}
}

OnRunCode()

getLocationBtn.addEventListener('click', () => {
	notify_fetch('Fetching your location...')
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError)
	} else {
		notify_error('Geolocation is not supported by this browser.')
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function showError(error: any) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				notify_error('User denied the request for Geolocation.')
				break
			case error.POSITION_UNAVAILABLE:
				notify_error('Location information is unavailable.')
				break
			case error.TIMEOUT:
				notify_error('The request to get user location timed out.')
				break
			case error.UNKNOWN_ERROR:
				notify_error('An unknown error occurred.')
				break
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function showPosition(position: any) {
		const lat = position.coords.latitude
		const long = position.coords.longitude

		const url = `https://api.opencagedata.com/geocode/v1/json?key=e905ec19ce5d46c3a0e9d11f19545641&q=${lat}+${long}&pretty=1&no_annotations=1#`
		fetch(url)
			.then((response) => response.json())
			.then(async (data) => {
				const postal = data.results[0].components.postcode
				if (postal.length === 6) {
					const data = await pincodeApiCall(postal)
					UiUpdate(data, postal)
					notify_done()
				} else {
					notify_error('invalid pincode area')
				}
			})
			.catch(() => {
				notify_error('some time server error')
			})
	}
})
