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
