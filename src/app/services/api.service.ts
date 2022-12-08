import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  switchMap,
  take,
  timer,
  of,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { Met, SymbolCode, Timesery, Weather, WeatherForDay } from './weather';

const celsiusSymbol: string = '&deg;';
const millisInDay: number = 1000 * 60 * 60 * 24; // Amount of milli seconds in a day

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private dataSubj: BehaviorSubject<Weather> = new BehaviorSubject<Weather>(
    {} as Weather
  );

  isPolling: number = 0;

  constructor(private httpClient: HttpClient) {
    this.isPolling = 1;
    console.log('Starting long polling');
    timer(0, environment.pollTimeSeconds * 1000)
      .pipe(
        switchMap(() => this.getWeatherData()),
        map((data) => this.dataSubj.next(this.metToWeather(data))),
        switchMap(() => of(this.isPolling)),
        filter((isPolling) => isPolling == 0),
        take(1)
      )
      .subscribe();
  }

  getCompactData(): Observable<Weather> {
    return this.dataSubj;
  }

  private getWeatherData(): Observable<Met> {
    let params: HttpParams = new HttpParams();

    // Using static values as a first solution
    params = params.append('lat', 59);
    params = params.append('lon', 10);

    // return of({
    //   type: 'Feature',
    //   geometry: { type: 'Point', coordinates: [10, 59, 63] },
    //   properties: {
    //     meta: {
    //       updated_at: '2022-12-08T14:40:42Z',
    //       units: {
    //         air_pressure_at_sea_level: 'hPa',
    //         air_temperature: 'celsius',
    //         cloud_area_fraction: '%',
    //         precipitation_amount: 'mm',
    //         relative_humidity: '%',
    //         wind_from_direction: 'degrees',
    //         wind_speed: 'm/s',
    //       },
    //     },
    //     timeseries: [
    //       {
    //         time: new Date('2022-12-08T15:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1001.3,
    //               air_temperature: -4.6,
    //               cloud_area_fraction: 31.6,
    //               relative_humidity: 78.5,
    //               wind_from_direction: 18.2,
    //               wind_speed: 3.2,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_night' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-08T16:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1001.2,
    //               air_temperature: -5.0,
    //               cloud_area_fraction: 21.1,
    //               relative_humidity: 77.1,
    //               wind_from_direction: 17.6,
    //               wind_speed: 4.5,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_night' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-08T17:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1001.1,
    //               air_temperature: -5.1,
    //               cloud_area_fraction: 11.8,
    //               relative_humidity: 77.9,
    //               wind_from_direction: 16.4,
    //               wind_speed: 5.1,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_night' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'clearsky_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-08T18:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1001.3,
    //               air_temperature: -5.1,
    //               cloud_area_fraction: 2.0,
    //               relative_humidity: 78.9,
    //               wind_from_direction: 22.4,
    //               wind_speed: 5.1,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_night' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'clearsky_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-08T19:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1001.7,
    //               air_temperature: -5.1,
    //               cloud_area_fraction: 10.6,
    //               relative_humidity: 83.9,
    //               wind_from_direction: 25.9,
    //               wind_speed: 4.7,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_night' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'clearsky_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-08T20:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1002.2,
    //               air_temperature: -5.1,
    //               cloud_area_fraction: 49.1,
    //               relative_humidity: 84.4,
    //               wind_from_direction: 16.4,
    //               wind_speed: 4.5,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_night' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-08T21:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1002.4,
    //               air_temperature: -5.0,
    //               cloud_area_fraction: 85.1,
    //               relative_humidity: 83.7,
    //               wind_from_direction: 7.1,
    //               wind_speed: 4.3,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-08T22:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1002.5,
    //               air_temperature: -4.8,
    //               cloud_area_fraction: 51.3,
    //               relative_humidity: 84.3,
    //               wind_from_direction: 2.4,
    //               wind_speed: 4.3,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-08T23:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1002.7,
    //               air_temperature: -4.7,
    //               cloud_area_fraction: 40.2,
    //               relative_humidity: 84.3,
    //               wind_from_direction: 13.2,
    //               wind_speed: 4.6,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T00:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1002.9,
    //               air_temperature: -4.5,
    //               cloud_area_fraction: 62.6,
    //               relative_humidity: 83.9,
    //               wind_from_direction: 24.2,
    //               wind_speed: 4.8,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T01:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1003.8,
    //               air_temperature: -4.5,
    //               cloud_area_fraction: 96.7,
    //               relative_humidity: 84.1,
    //               wind_from_direction: 4.8,
    //               wind_speed: 3.1,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T02:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1003.9,
    //               air_temperature: -4.2,
    //               cloud_area_fraction: 97.4,
    //               relative_humidity: 82.7,
    //               wind_from_direction: 11.3,
    //               wind_speed: 4.0,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T03:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1004.0,
    //               air_temperature: -4.2,
    //               cloud_area_fraction: 81.0,
    //               relative_humidity: 81.2,
    //               wind_from_direction: 13.6,
    //               wind_speed: 4.4,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T04:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1004.2,
    //               air_temperature: -4.3,
    //               cloud_area_fraction: 67.5,
    //               relative_humidity: 82.1,
    //               wind_from_direction: 17.8,
    //               wind_speed: 4.8,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T05:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1004.5,
    //               air_temperature: -4.5,
    //               cloud_area_fraction: 69.3,
    //               relative_humidity: 83.4,
    //               wind_from_direction: 21.2,
    //               wind_speed: 4.8,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T06:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1004.7,
    //               air_temperature: -4.3,
    //               cloud_area_fraction: 76.0,
    //               relative_humidity: 82.6,
    //               wind_from_direction: 25.4,
    //               wind_speed: 5.7,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T07:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1005.1,
    //               air_temperature: -4.4,
    //               cloud_area_fraction: 65.6,
    //               relative_humidity: 78.1,
    //               wind_from_direction: 28.5,
    //               wind_speed: 5.7,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T08:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1005.8,
    //               air_temperature: -4.6,
    //               cloud_area_fraction: 60.3,
    //               relative_humidity: 76.4,
    //               wind_from_direction: 30.7,
    //               wind_speed: 5.2,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T09:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1006.2,
    //               air_temperature: -4.9,
    //               cloud_area_fraction: 34.8,
    //               relative_humidity: 76.0,
    //               wind_from_direction: 30.3,
    //               wind_speed: 5.4,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T10:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1006.6,
    //               air_temperature: -4.8,
    //               cloud_area_fraction: 9.7,
    //               relative_humidity: 74.9,
    //               wind_from_direction: 27.6,
    //               wind_speed: 6.2,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'clearsky_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T11:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1006.8,
    //               air_temperature: -4.5,
    //               cloud_area_fraction: 6.1,
    //               relative_humidity: 73.5,
    //               wind_from_direction: 27.9,
    //               wind_speed: 6.4,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'clearsky_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T12:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1007.0,
    //               air_temperature: -4.2,
    //               cloud_area_fraction: 33.9,
    //               relative_humidity: 73.4,
    //               wind_from_direction: 31.0,
    //               wind_speed: 6.0,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T13:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1007.1,
    //               air_temperature: -4.0,
    //               cloud_area_fraction: 61.0,
    //               relative_humidity: 74.5,
    //               wind_from_direction: 32.9,
    //               wind_speed: 6.0,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T14:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1007.5,
    //               air_temperature: -4.2,
    //               cloud_area_fraction: 87.3,
    //               relative_humidity: 76.1,
    //               wind_from_direction: 32.3,
    //               wind_speed: 5.7,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T15:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1008.0,
    //               air_temperature: -4.2,
    //               cloud_area_fraction: 96.1,
    //               relative_humidity: 77.4,
    //               wind_from_direction: 34.7,
    //               wind_speed: 4.9,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T16:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1008.2,
    //               air_temperature: -4.0,
    //               cloud_area_fraction: 98.4,
    //               relative_humidity: 79.1,
    //               wind_from_direction: 30.6,
    //               wind_speed: 5.1,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T17:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1008.4,
    //               air_temperature: -3.9,
    //               cloud_area_fraction: 93.3,
    //               relative_humidity: 81.6,
    //               wind_from_direction: 29.6,
    //               wind_speed: 5.7,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T18:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1008.5,
    //               air_temperature: -3.9,
    //               cloud_area_fraction: 74.4,
    //               relative_humidity: 82.5,
    //               wind_from_direction: 33.3,
    //               wind_speed: 6.3,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_night' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T19:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1008.9,
    //               air_temperature: -3.9,
    //               cloud_area_fraction: 79.9,
    //               relative_humidity: 82.4,
    //               wind_from_direction: 35.7,
    //               wind_speed: 5.9,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_night' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T20:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1009.6,
    //               air_temperature: -3.9,
    //               cloud_area_fraction: 93.2,
    //               relative_humidity: 82.8,
    //               wind_from_direction: 38.3,
    //               wind_speed: 4.9,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_night' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T21:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1009.9,
    //               air_temperature: -3.9,
    //               cloud_area_fraction: 98.5,
    //               relative_humidity: 82.7,
    //               wind_from_direction: 35.7,
    //               wind_speed: 5.7,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T22:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1010.3,
    //               air_temperature: -3.9,
    //               cloud_area_fraction: 93.2,
    //               relative_humidity: 81.7,
    //               wind_from_direction: 37.2,
    //               wind_speed: 5.5,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'fair_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-09T23:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1010.6,
    //               air_temperature: -4.1,
    //               cloud_area_fraction: 81.7,
    //               relative_humidity: 81.8,
    //               wind_from_direction: 32.5,
    //               wind_speed: 5.5,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'fair_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T00:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1010.7,
    //               air_temperature: -4.5,
    //               cloud_area_fraction: 61.7,
    //               relative_humidity: 81.9,
    //               wind_from_direction: 29.3,
    //               wind_speed: 6.1,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'fair_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T01:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1010.9,
    //               air_temperature: -4.8,
    //               cloud_area_fraction: 50.5,
    //               relative_humidity: 81.7,
    //               wind_from_direction: 27.9,
    //               wind_speed: 5.9,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'fair_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T02:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1011.1,
    //               air_temperature: -5.0,
    //               cloud_area_fraction: 50.4,
    //               relative_humidity: 81.2,
    //               wind_from_direction: 26.3,
    //               wind_speed: 5.7,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'fair_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T03:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1011.0,
    //               air_temperature: -5.2,
    //               cloud_area_fraction: 13.9,
    //               relative_humidity: 80.7,
    //               wind_from_direction: 28.0,
    //               wind_speed: 6.0,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'fair_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T04:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1011.3,
    //               air_temperature: -5.3,
    //               cloud_area_fraction: 13.4,
    //               relative_humidity: 80.6,
    //               wind_from_direction: 29.1,
    //               wind_speed: 5.8,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'fair_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T05:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1011.4,
    //               air_temperature: -5.4,
    //               cloud_area_fraction: 16.2,
    //               relative_humidity: 80.1,
    //               wind_from_direction: 30.7,
    //               wind_speed: 5.8,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'fair_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T06:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1011.6,
    //               air_temperature: -5.6,
    //               cloud_area_fraction: 18.9,
    //               relative_humidity: 80.2,
    //               wind_from_direction: 29.5,
    //               wind_speed: 5.6,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'fair_day' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T07:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1011.9,
    //               air_temperature: -5.6,
    //               cloud_area_fraction: 31.1,
    //               relative_humidity: 79.9,
    //               wind_from_direction: 28.2,
    //               wind_speed: 5.5,
    //             },
    //           },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T08:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.2,
    //               air_temperature: -5.7,
    //               cloud_area_fraction: 37.0,
    //               relative_humidity: 79.6,
    //               wind_from_direction: 28.4,
    //               wind_speed: 5.2,
    //             },
    //           },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T09:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.3,
    //               air_temperature: -5.6,
    //               cloud_area_fraction: 26.1,
    //               relative_humidity: 78.6,
    //               wind_from_direction: 28.8,
    //               wind_speed: 5.6,
    //             },
    //           },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T10:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.4,
    //               air_temperature: -5.2,
    //               cloud_area_fraction: 22.1,
    //               relative_humidity: 76.1,
    //               wind_from_direction: 28.6,
    //               wind_speed: 5.9,
    //             },
    //           },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T11:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.4,
    //               air_temperature: -4.6,
    //               cloud_area_fraction: 34.9,
    //               relative_humidity: 73.6,
    //               wind_from_direction: 29.9,
    //               wind_speed: 5.7,
    //             },
    //           },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T12:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.4,
    //               air_temperature: -4.2,
    //               cloud_area_fraction: 42.8,
    //               relative_humidity: 72.0,
    //               wind_from_direction: 29.3,
    //               wind_speed: 5.0,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T13:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.2,
    //               air_temperature: -4.1,
    //               cloud_area_fraction: 37.1,
    //               relative_humidity: 71.7,
    //               wind_from_direction: 31.1,
    //               wind_speed: 5.0,
    //             },
    //           },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T14:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.3,
    //               air_temperature: -4.3,
    //               cloud_area_fraction: 27.2,
    //               relative_humidity: 71.9,
    //               wind_from_direction: 30.9,
    //               wind_speed: 4.7,
    //             },
    //           },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T15:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.5,
    //               air_temperature: -4.7,
    //               cloud_area_fraction: 17.4,
    //               relative_humidity: 72.8,
    //               wind_from_direction: 25.2,
    //               wind_speed: 4.3,
    //             },
    //           },
    //           next_1_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T16:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.5,
    //               air_temperature: -4.9,
    //               cloud_area_fraction: 39.2,
    //               relative_humidity: 72.7,
    //               wind_from_direction: 24.0,
    //               wind_speed: 4.7,
    //             },
    //           },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T17:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.6,
    //               air_temperature: -5.0,
    //               cloud_area_fraction: 40.4,
    //               relative_humidity: 73.9,
    //               wind_from_direction: 25.5,
    //               wind_speed: 4.7,
    //             },
    //           },
    //           next_1_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-10T18:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.5,
    //               air_temperature: -5.1,
    //               cloud_area_fraction: 15.4,
    //               relative_humidity: 75.5,
    //               wind_from_direction: 27.8,
    //               wind_speed: 4.9,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-11T00:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1014.1,
    //               air_temperature: -5.0,
    //               cloud_area_fraction: 96.9,
    //               relative_humidity: 80.0,
    //               wind_from_direction: 29.4,
    //               wind_speed: 4.8,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-11T06:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1015.3,
    //               air_temperature: -4.5,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 82.3,
    //               wind_from_direction: 36.9,
    //               wind_speed: 5.7,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-11T12:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1017.3,
    //               air_temperature: -3.1,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 78.8,
    //               wind_from_direction: 40.0,
    //               wind_speed: 5.7,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-11T18:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1019.1,
    //               air_temperature: -3.9,
    //               cloud_area_fraction: 98.4,
    //               relative_humidity: 78.1,
    //               wind_from_direction: 38.6,
    //               wind_speed: 5.5,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-12T00:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1020.2,
    //               air_temperature: -2.8,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 79.8,
    //               wind_from_direction: 38.5,
    //               wind_speed: 6.2,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-12T06:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1020.8,
    //               air_temperature: -3.9,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 78.5,
    //               wind_from_direction: 36.6,
    //               wind_speed: 7.3,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-12T12:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1021.4,
    //               air_temperature: -3.6,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 74.7,
    //               wind_from_direction: 26.6,
    //               wind_speed: 7.5,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-12T18:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1021.0,
    //               air_temperature: -4.4,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 74.1,
    //               wind_from_direction: 24.3,
    //               wind_speed: 8.2,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-13T00:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1021.1,
    //               air_temperature: -6.9,
    //               cloud_area_fraction: 20.3,
    //               relative_humidity: 76.1,
    //               wind_from_direction: 20.7,
    //               wind_speed: 4.3,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-13T06:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1018.3,
    //               air_temperature: -7.9,
    //               cloud_area_fraction: 35.9,
    //               relative_humidity: 78.4,
    //               wind_from_direction: 18.9,
    //               wind_speed: 3.6,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-13T12:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1014.3,
    //               air_temperature: -5.0,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 67.5,
    //               wind_from_direction: 19.6,
    //               wind_speed: 5.7,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-13T18:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1013.7,
    //               air_temperature: -5.3,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 70.7,
    //               wind_from_direction: 22.0,
    //               wind_speed: 5.1,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-14T00:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.7,
    //               air_temperature: -5.5,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 71.7,
    //               wind_from_direction: 19.5,
    //               wind_speed: 4.9,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-14T06:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1011.4,
    //               air_temperature: -6.5,
    //               cloud_area_fraction: 64.8,
    //               relative_humidity: 86.6,
    //               wind_from_direction: 37.9,
    //               wind_speed: 2.6,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-14T12:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1009.1,
    //               air_temperature: -5.0,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 70.9,
    //               wind_from_direction: 24.7,
    //               wind_speed: 5.1,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-14T18:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1009.4,
    //               air_temperature: -6.0,
    //               cloud_area_fraction: 95.7,
    //               relative_humidity: 78.9,
    //               wind_from_direction: 29.6,
    //               wind_speed: 4.3,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-15T00:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1010.5,
    //               air_temperature: -6.6,
    //               cloud_area_fraction: 35.9,
    //               relative_humidity: 85.5,
    //               wind_from_direction: 31.1,
    //               wind_speed: 2.4,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'fair_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-15T06:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1010.3,
    //               air_temperature: -7.7,
    //               cloud_area_fraction: 69.5,
    //               relative_humidity: 84.2,
    //               wind_from_direction: 34.7,
    //               wind_speed: 3.2,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-15T12:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1009.6,
    //               air_temperature: -5.6,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 80.4,
    //               wind_from_direction: 30.9,
    //               wind_speed: 4.0,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-15T18:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1010.9,
    //               air_temperature: -7.7,
    //               cloud_area_fraction: 46.1,
    //               relative_humidity: 88.6,
    //               wind_from_direction: 268.8,
    //               wind_speed: 2.2,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_night' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-16T00:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1009.9,
    //               air_temperature: -6.4,
    //               cloud_area_fraction: 98.4,
    //               relative_humidity: 86.1,
    //               wind_from_direction: 32.6,
    //               wind_speed: 4.5,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'partlycloudy_day' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-16T06:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.0,
    //               air_temperature: -8.8,
    //               cloud_area_fraction: 64.8,
    //               relative_humidity: 86.9,
    //               wind_from_direction: 28.7,
    //               wind_speed: 3.0,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-16T12:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1009.8,
    //               air_temperature: -5.4,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 80.7,
    //               wind_from_direction: 34.0,
    //               wind_speed: 5.3,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-16T18:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1010.5,
    //               air_temperature: -6.2,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 85.6,
    //               wind_from_direction: 34.6,
    //               wind_speed: 5.3,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-17T00:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1012.6,
    //               air_temperature: -6.2,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 87.0,
    //               wind_from_direction: 34.7,
    //               wind_speed: 5.5,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-17T06:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1016.2,
    //               air_temperature: -7.9,
    //               cloud_area_fraction: 75.8,
    //               relative_humidity: 87.1,
    //               wind_from_direction: 30.4,
    //               wind_speed: 3.5,
    //             },
    //           },
    //           next_12_hours: { summary: { symbol_code: 'cloudy' } },
    //           next_6_hours: {
    //             summary: { symbol_code: 'partlycloudy_day' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-17T12:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1013.5,
    //               air_temperature: -4.7,
    //               cloud_area_fraction: 100.0,
    //               relative_humidity: 84.5,
    //               wind_from_direction: 48.1,
    //               wind_speed: 4.2,
    //             },
    //           },
    //           next_6_hours: {
    //             summary: { symbol_code: 'cloudy' },
    //             details: { precipitation_amount: 0.0 },
    //           },
    //         },
    //       },
    //       {
    //         time: new Date('2022-12-17T18:00:00Z'),
    //         data: {
    //           instant: {
    //             details: {
    //               air_pressure_at_sea_level: 1022.5,
    //               air_temperature: -8.0,
    //               cloud_area_fraction: 69.5,
    //               relative_humidity: 86.5,
    //               wind_from_direction: 36.5,
    //               wind_speed: 3.5,
    //             },
    //           },
    //         },
    //       },
    //     ],
    //   },
    // } as Met);

    return this.httpClient.get<Met>(`${environment.metBaseUrl}/compact`, {
      params,
    });
  }

  // metToWeatherForDay will look through data provided by the api, and shorten the list to only be 7 days.
  // As well as showing data for only 7 days, we will also simplify the data to something easier to consume by our components
  private metToWeather(data: Met): Weather {
    if (!data?.properties?.timeseries) {
      return {} as Weather;
    }

    data?.properties?.timeseries.map((el) => (el.time = new Date(el.time)));

    var wind_unit = 'm/s';
    var temp_unit = celsiusSymbol;
    if (data?.properties?.meta?.units) {
      wind_unit = data.properties.meta.units.wind_speed;
      if (data?.properties?.meta?.units?.air_temperature !== 'celsius') {
        temp_unit = data?.properties?.meta?.units?.air_temperature;
      }
    }

    var weather: Weather = {
      location: 'Oslo',
      updated_at: new Date(),
      weather_for_week: [],
    };

    // We assume that the original list of data is sorted by date
    const timeseries = data.properties.timeseries;

    const today: Date = new Date();
    const dates: Date[] = [];
    for (let index = 0; index < 7; index++) {
      dates.push(new Date(today.getTime() + index * millisInDay));
    }

    dates.forEach((el, i) => {
      const entries: Timesery[] = this.getEntriesForDate(el, timeseries);
      if (!entries || entries.length < 1) {
        return;
      }

      const weatherForDay: WeatherForDay = {
        date: entries[0].time,
        temp_unit: temp_unit,
        wind_unit: wind_unit,
      } as WeatherForDay;

      entries.forEach((entry) => {
        if (
          !weatherForDay.min_temp ||
          entry.data?.instant?.details?.air_temperature > weatherForDay.min_temp
        ) {
          weatherForDay.min_temp =
            entry.data?.instant?.details?.air_temperature;
        }

        if (
          !weatherForDay.max_temp ||
          entry.data?.instant?.details?.air_temperature < weatherForDay.max_temp
        ) {
          weatherForDay.max_temp =
            entry.data?.instant?.details?.air_temperature;
        }

        if (
          !weatherForDay.max_wind ||
          entry.data?.instant?.details?.air_temperature < weatherForDay.max_wind
        ) {
          weatherForDay.max_wind =
            entry.data?.instant?.details?.air_temperature;
        }

        if (!weatherForDay.night_symbol_code && entry.time.getHours() < 8) {
          weatherForDay.night_symbol_code = this.getSymbolCode(entry);
        }

        if (
          !weatherForDay.day_symbol_code &&
          entry.time.getHours() < 16 &&
          entry.time.getHours() >= 8
        ) {
          weatherForDay.day_symbol_code = this.getSymbolCode(entry);
        }

        if (
          !weatherForDay.evening_symbol_code &&
          entry.time.getHours() >= 16 &&
          entry.time.getHours() < 24
        ) {
          weatherForDay.evening_symbol_code = this.getSymbolCode(entry);
        }
      });

      weather.weather_for_week.push(weatherForDay);
    });

    return weather;
  }

  private getEntriesForDate(date: Date, times: Timesery[]): Timesery[] {
    if (!date) {
      return [];
    }

    if (!times) {
      return [];
    }

    const strToMatch = `${date.getFullYear()}${date.getMonth}${date.getDate()}`;

    return times.filter(
      (el) =>
        `${el.time.getFullYear()}${el.time.getMonth}${el.time.getDate()}` ===
        strToMatch
    );
  }

  private getSymbolCode(timeserie: Timesery): SymbolCode {
    if (timeserie.data.next_1_hours?.summary?.symbol_code) {
      return timeserie.data.next_1_hours?.summary?.symbol_code;
    }
    if (timeserie.data.next_6_hours?.summary?.symbol_code) {
      return timeserie.data.next_6_hours?.summary?.symbol_code;
    }
    if (timeserie.data.next_12_hours?.summary?.symbol_code) {
      return timeserie.data.next_12_hours?.summary?.symbol_code;
    }

    return '' as SymbolCode;
  }
}
