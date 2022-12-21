import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core'
import Chart from 'chart.js/auto'
import {
  dateToDateLabel,
  getHistoryRates,
  HistoryData,
  HistoryRatesData,
} from 'src/currency/utils'

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.scss'],
})
export class HistoryChartComponent implements OnChanges, AfterViewInit {
  @Input() historyRecord?: HistoryData
  @Input() from?: string | null
  @Input() to?: string | null
  chart?: Chart<'line', number[] | undefined, string>

  historyRates?: HistoryRatesData

  @ViewChild('chart', { read: ElementRef })
  canvasRef?: ElementRef<HTMLCanvasElement>

  ngOnChanges(): void {
    this.loadHistoryRatesFromCurrencyPair()
  }

  ngAfterViewInit(): void {
    this.initiateChart()
  }

  private initiateChart() {
    if (this.canvasRef?.nativeElement) {
      this.chart = new Chart(this.canvasRef.nativeElement, {
        type: 'line',
        data: {
          labels: this.getChartLabels(),
          datasets: [],
        },
      })
      this.loadHistoryRatesFromCurrencyPair()
    }
  }

  loadHistoryRatesFromCurrencyPair() {
    if (this.historyRecord && this.from && this.to) {
      this.historyRates = getHistoryRates(
        { from: this.from, to: this.to },
        this.historyRecord
      )
      if (this.chart) {
        this.chart.data.datasets = [
          {
            data: Object.values(this.historyRates),
            label: `1 ${this.from} to ${this.to}`,
          },
        ]
        this.chart.update()
      }
    }
  }

  private getChartLabels(): string[] | undefined {
    const keyNamesArray = Object.keys(this.historyRates ?? {})
    return keyNamesArray.map((date, index) =>
      dateToDateLabel(
        date,
        // show year if not equal to prev year
        date.slice(0, 3) !== keyNamesArray[index - 1]?.slice(0, 3)
      )
    )
  }
}
