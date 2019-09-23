import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'dr-leanda-home',
  templateUrl: './leanda.component.html',
  styleUrls: ['./leanda.component.scss'],
})
export class LeandaHomeComponent implements OnInit {
  buildTime: number;
  buildNumber: string;
  apiVersion: number;
  environment: string;
  error = false;
  profileExists = false;
  currentYear = new Date().getFullYear();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getBuildData();
  }

  getBuildData() {
    this.http.get(`${environment.apiUrl}/version`).subscribe((x: any) => {
      const data = x.build;
      this.apiVersion = data.version;
    });
    /*
     * Jenkins is replacing "jenkinsBuildData.json" with its own, setting build id and time
     * For local develoment set path to './src/jenkinsBuildData.json'
     */
    this.http.get('./jenkinsBuildData.json').subscribe((res: any) => {
      const data = res.buildInfo;
      this.buildNumber = data.buildId;
      this.buildTime = data.buildDate;
      this.environment = data.environment;
    });
  }
}
